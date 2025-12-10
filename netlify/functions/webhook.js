/**
 * Netlify Serverless Function - Stripe Webhook Handler
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
 * 2. Add endpoint: https://your-domain.com/.netlify/functions/webhook
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

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Webhook secret not configured' }),
    };
  }

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log('Checkout completed:', session.id);
        
        // Handle successful checkout
        // You can update user subscription status here
        // Example: Update database, send confirmation email, etc.
        
        if (session.mode === 'subscription') {
          console.log('Subscription created:', session.subscription);
        }
        
        break;

      case 'customer.subscription.created':
        const subscriptionCreated = stripeEvent.data.object;
        console.log('Subscription created:', subscriptionCreated.id);
        // Handle new subscription
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = stripeEvent.data.object;
        console.log('Subscription updated:', subscriptionUpdated.id);
        // Handle subscription update (plan change, etc.)
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = stripeEvent.data.object;
        console.log('Subscription deleted:', subscriptionDeleted.id);
        // Handle subscription cancellation
        break;

      case 'invoice.payment_succeeded':
        const invoiceSucceeded = stripeEvent.data.object;
        console.log('Invoice payment succeeded:', invoiceSucceeded.id);
        // Handle successful payment
        break;

      case 'invoice.payment_failed':
        const invoiceFailed = stripeEvent.data.object;
        console.log('Invoice payment failed:', invoiceFailed.id);
        // Handle failed payment - notify user, etc.
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Error processing webhook' }),
    };
  }
};

