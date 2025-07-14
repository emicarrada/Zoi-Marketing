import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { createSite, getSites, updateSite, publishSite } from '../controllers/siteController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/site/create - Create a new site
router.post('/create', [
  body('title').notEmpty().withMessage('Site title is required'),
  body('template').optional().isString(),
  body('content').optional().isObject(),
], createSite);

// GET /api/site - Get user's sites
router.get('/', getSites);

// PUT /api/site/:id - Update a site
router.put('/:id', [
  body('title').optional().isString(),
  body('content').optional().isObject(),
], updateSite);

// POST /api/site/:id/publish - Publish a site
router.post('/:id/publish', publishSite);

export default router;
