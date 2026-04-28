import express from 'express';
import { getDependents, addDependent, deleteDependent } from '../controllers/dependentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDependents)
  .post(protect, addDependent);

router.route('/:id')
  .delete(protect, deleteDependent);

export default router;
