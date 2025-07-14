import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth';
import { createSubscription, handleWebhook, cancelSubscription } from '../controllers/stripeController';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Webhook endpoint (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// All other routes require authentication
router.use(authenticateToken);

// POST /api/stripe/create-subscription
router.post('/create-subscription', createSubscription);

// POST /api/stripe/cancel-subscription
router.post('/cancel-subscription', cancelSubscription);

// GET /api/stripe/billing-portal
router.get('/billing-portal', async (req: Request, res: Response) => {
  try {
    // This would create a billing portal session
    // Implementation depends on your specific needs
    res.json({ success: true, message: 'Billing portal endpoint' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to create billing portal' } });
  }
});

export default router;
