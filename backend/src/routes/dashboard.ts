import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getDashboardData } from '../controllers/dashboardController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/dashboard/data - Get dashboard data for the user
router.get('/data', getDashboardData);

export default router;
