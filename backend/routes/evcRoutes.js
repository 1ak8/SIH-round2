import express from 'express';
import {
  getEVCInspections,
  scheduleInspection,
  uploadInspectionPhoto,
  submitInspectionReport,
} from '../controllers/evcController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/inspections', protect, getEVCInspections);
router.post('/inspection/:id/schedule', protect, scheduleInspection);
router.post('/inspection/:id/photos', protect, upload.single('photo'), uploadInspectionPhoto);
router.post('/inspection/:id/report', protect, submitInspectionReport);

export default router;
