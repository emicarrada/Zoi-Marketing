import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { generateAIContent, chatWithAI } from '../controllers/aiController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/ai/generate - Generate content with AI
router.post('/generate', [
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('type').optional().isString(),
  body('context').optional().isObject(),
], generateAIContent);

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', [
  body('message').notEmpty().withMessage('Message is required'),
  body('context').optional().isObject(),
], chatWithAI);

export default router;
