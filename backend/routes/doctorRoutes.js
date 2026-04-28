import express from 'express';
import { 
  grantAccess, 
  revokeAccess, 
  getMyDoctors, 
  searchDoctors, 
  getAccessiblePatients, 
  getPatientRecords, 
  addNoteToRecord,
  getDoctorByPublicId,
  grantAccessByPublicId
} from '../controllers/doctorController.js';
import { protect, patientOnly, doctorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/public/:publicId', getDoctorByPublicId);

// Patient routes
router.post('/grant', protect, patientOnly, grantAccess);
router.post('/grant-public', protect, patientOnly, grantAccessByPublicId);
router.post('/revoke', protect, patientOnly, revokeAccess);
router.get('/access-list', protect, patientOnly, getMyDoctors);
router.get('/search', protect, patientOnly, searchDoctors);

// Doctor routes
router.get('/patients', protect, doctorOnly, getAccessiblePatients);
router.get('/patients/:patientId/records', protect, doctorOnly, getPatientRecords);
router.post('/records/:recordId/notes', protect, doctorOnly, addNoteToRecord);

export default router;
