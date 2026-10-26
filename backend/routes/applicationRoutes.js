import express from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  uploadCampusPhoto,
  simulateSlaBreach,
  generateDocket,
  forwardToRO,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);
router.post('/', protect, createApplication);
router.post('/:id/photos', protect, upload.single('photo'), uploadCampusPhoto);
router.post('/:id/simulate-breach', protect, simulateSlaBreach);
router.post('/:id/generate-docket', protect, generateDocket);
router.post('/:id/forward-ro', protect, forwardToRO);

export default router;
