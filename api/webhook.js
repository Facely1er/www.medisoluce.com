/**
 * Vercel Serverless Function - Stripe Webhook Handler
 *
 * Required env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
 * VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getSupabaseAdmin, handleStripeEvent } = require('./stripeWebhookCore');

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
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error('Supabase admin client unavailable:', err.message);
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    await handleStripeEvent(stripe, supabase, event);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
};
