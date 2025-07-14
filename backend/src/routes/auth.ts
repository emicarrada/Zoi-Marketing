import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required'),
], register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required'),
], login);

// GET /api/auth/verify
router.get('/verify', authenticateToken, verifyToken);

export default router;
