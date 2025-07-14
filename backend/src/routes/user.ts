import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { updateProfile, getProfile } from '../controllers/userController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/user/profile - Create or update user profile
router.post('/profile', [
  body('businessType').notEmpty().withMessage('Business type is required'),
  body('businessName').optional().isString(),
  body('targetAudience').optional().isString(),
  body('tone').optional().isIn(['casual', 'professional', 'friendly', 'formal']),
  body('primaryColors').optional().isArray(),
  body('description').optional().isString(),
  body('goals').optional().isArray(),
], updateProfile);

// GET /api/user/profile - Get user profile
router.get('/profile', getProfile);

export default router;
