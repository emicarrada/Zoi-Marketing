import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { generateContent, getContentSuggestions, saveContent, getContent } from '../controllers/contentController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/content/suggestions - Get AI-generated content suggestions
router.get('/suggestions', getContentSuggestions);

// POST /api/content/generate - Generate new content with AI
router.post('/generate', [
  body('type').isIn(['SOCIAL_POST', 'BLOG_POST', 'EMAIL', 'AD_COPY', 'WEBSITE_COPY']),
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('platform').optional().isString(),
], generateContent);

// POST /api/content/save - Save generated content
router.post('/save', [
  body('type').isIn(['SOCIAL_POST', 'BLOG_POST', 'EMAIL', 'AD_COPY', 'WEBSITE_COPY']),
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('platform').optional().isString(),
], saveContent);

// GET /api/content - Get user's content
router.get('/', getContent);

export default router;
