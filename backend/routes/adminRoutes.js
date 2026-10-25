import express from 'express';
import {
  getHQDashboardMetrics,
  getRegionalHeatmap,
  getEscalationMatrix,
  reassignOfficer,
  getRulesConfig,
  updateRulesConfig,
  getAuditLogs,
  reseedDatabaseHandler,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', protect, getHQDashboardMetrics);
router.get('/heatmap', protect, getRegionalHeatmap);
router.get('/escalation-matrix', protect, getEscalationMatrix);
router.post('/application/:id/reassign', protect, reassignOfficer);
router.get('/rules', protect, getRulesConfig);
router.put('/rules', protect, updateRulesConfig);
router.get('/audit-logs', protect, getAuditLogs);
router.post('/reseed', protect, reseedDatabaseHandler);

export default router;
