import express from 'express';
import { askAIAssistant } from '../controllers/aiController.js';

const router = express.Router();

// Public / Authenticated route to ask AICTE Pravah Sahayak
router.post('/ask', askAIAssistant);

export default router;
