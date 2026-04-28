import express from 'express';
import { 
  bookAppointment, 
  getMyAppointments, 
  updateAppointmentStatus,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { protect, patientOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, patientOnly, bookAppointment)
  .get(protect, getMyAppointments);

router.route('/:id')
  .put(protect, updateAppointmentStatus)
  .delete(protect, deleteAppointment);

export default router;
