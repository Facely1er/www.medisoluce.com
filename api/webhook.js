/**
 * Vercel Serverless Function - Stripe Webhook Handler
 * 
 * This endpoint handles Stripe webhook events for payment processing,
 * subscription updates, and other payment-related events.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret
 * 
 * Webhook Setup:
 * 1. In Stripe Dashboard, go to Developers > Webhooks
 * 2. Add endpoint: https://your-domain.com/api/webhook
 * 3. Select events to listen to:
 *    - checkout.session.completed
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_succeeded
 *    - invoice.payment_failed
 * 4. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        
        // Handle successful checkout
        // You can update user subscription status here
        // Example: Update database, send confirmation email, etc.
        
        if (session.mode === 'subscription') {
          console.log('Subscription created:', session.subscription);
        }
        
        break;

      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        console.log('Subscription created:', subscriptionCreated.id);
        // Handle new subscription
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        console.log('Subscription updated:', subscriptionUpdated.id);
        // Handle subscription update (plan change, etc.)
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        console.log('Subscription deleted:', subscriptionDeleted.id);
        // Handle subscription cancellation
        break;

      case 'invoice.payment_succeeded':
        const invoiceSucceeded = event.data.object;
        console.log('Invoice payment succeeded:', invoiceSucceeded.id);
        // Handle successful payment
        break;

      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object;
        console.log('Invoice payment failed:', invoiceFailed.id);
        // Handle failed payment - notify user, etc.
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
}

