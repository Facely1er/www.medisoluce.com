/**
 * Netlify Function - Stripe Webhook Handler
 * Endpoint: /.netlify/functions/webhook (also /api/webhook via netlify.toml)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getSupabaseAdmin, handleStripeEvent } = require('../../api/stripeWebhookCore');

exports.handler = async (event) => {
  const json = (statusCode, body) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return json(500, { error: 'Webhook secret not configured' });
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return json(400, { error: `Webhook Error: ${err.message}` });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error('Supabase admin client unavailable:', err.message);
    return json(500, { error: 'Database not configured' });
  }

  try {
    await handleStripeEvent(stripe, supabase, stripeEvent);
    return json(200, { received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return json(500, { error: 'Error processing webhook' });
  }
};
