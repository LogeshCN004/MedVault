import express from 'express';
import { uploadRecord, getMyRecords, deleteRecord } from '../controllers/recordController.js';
import { protect, patientOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, patientOnly, upload.single('file'), uploadRecord)
  .get(protect, patientOnly, getMyRecords);

router.route('/:id')
  .delete(protect, patientOnly, deleteRecord);

export default router;
