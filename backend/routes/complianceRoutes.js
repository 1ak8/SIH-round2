import express from 'express';
import {
  getUndertakings,
  submitUndertakingProof,
  verifyUndertaking,
  getDocumentRadar,
  dispatchAlert,
  renewDocument,
  verifyDocumentRenewal,
  verifyOnsiteDocument,
  issueShowCauseNotice,
} from '../controllers/complianceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/undertakings', protect, getUndertakings);
router.post('/undertakings/:id/proof', protect, upload.single('proof'), submitUndertakingProof);
router.post('/undertakings/:id/verify', protect, verifyUndertaking);
router.get('/documents/radar', protect, getDocumentRadar);
router.post('/documents/alert', protect, dispatchAlert);
router.post('/documents/:id/renew', protect, upload.single('document'), renewDocument);
router.post('/documents/:id/verify-renewal', protect, verifyDocumentRenewal);
router.post('/documents/:id/verify-onsite', protect, verifyOnsiteDocument);
router.post('/documents/:id/show-cause', protect, issueShowCauseNotice);

export default router;
