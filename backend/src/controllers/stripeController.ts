import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    const { planType } = req.body; // 'BASIC', 'PRO', 'ENTERPRISE'

    // Get user
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: { plan: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Define price IDs (these would be set up in Stripe dashboard)
    const priceIds = {
      BASIC: 'price_basic_monthly', // Replace with actual Stripe price ID
      PRO: 'price_pro_monthly',     // Replace with actual Stripe price ID
      ENTERPRISE: 'price_enterprise_monthly' // Replace with actual Stripe price ID
    };

    const priceId = priceIds[planType as keyof typeof priceIds];
    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid plan type' }
      });
    }

    // Create or get Stripe customer
    let customerId = user.plan?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user plan
    await prisma.plan.upsert({
      where: { userId: user.id },
      update: {
        planType: planType as any,
        stripeCustomerId: customerId,
        subscriptionId: subscription.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        isActive: subscription.status === 'active'
      },
      create: {
        userId: user.id,
        planType: planType as any,
        stripeCustomerId: customerId,
        subscriptionId: subscription.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        isActive: subscription.status === 'active'
      }
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create subscription' }
    });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
      include: { plan: true }
    });

    if (!user || !user.plan?.subscriptionId) {
      return res.status(404).json({
        success: false,
        error: { message: 'No active subscription found' }
      });
    }

    // Cancel subscription
    const subscription = await stripe.subscriptions.update(
      user.plan.subscriptionId,
      { cancel_at_period_end: true }
    );

    // Update plan
    await prisma.plan.update({
      where: { userId: user.id },
      data: {
        isActive: false
      }
    });

    res.json({
      success: true,
      data: {
        message: 'Subscription will be canceled at the end of the current period',
        periodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to cancel subscription' }
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Missing signature or webhook secret');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      // Update subscription status
      if (invoice.subscription) {
        await prisma.plan.updateMany({
          where: { subscriptionId: invoice.subscription as string },
          data: { isActive: true }
        });
      }
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      // Handle failed payment
      if (failedInvoice.subscription) {
        await prisma.plan.updateMany({
          where: { subscriptionId: failedInvoice.subscription as string },
          data: { isActive: false }
        });
      }
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      // Update plan to free
      await prisma.plan.updateMany({
        where: { subscriptionId: deletedSub.id },
        data: { 
          planType: 'FREE',
          isActive: false,
          subscriptionId: null
        }
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
