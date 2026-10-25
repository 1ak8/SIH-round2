import express from 'express';
import {
  getROQueue,
  raiseDeficiency,
  resolveDeficiency,
  passToEVC,
  revertApplication,
  directApprove,
  getFacultyRadar,
  flagFacultyDeficiency,
} from '../controllers/scrutinyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/queue', protect, getROQueue);
router.get('/application/:id/faculty-radar', protect, getFacultyRadar);
router.post('/application/:id/faculty-radar/flag-deficiency', protect, flagFacultyDeficiency);
router.post('/application/:id/deficiency', protect, raiseDeficiency);
router.post('/application/:id/deficiency/:deficiencyId/resolve', protect, resolveDeficiency);
router.post('/application/:id/pass-evc', protect, passToEVC);
router.post('/application/:id/revert', protect, revertApplication);
router.post('/application/:id/approve', protect, directApprove);

export default router;
