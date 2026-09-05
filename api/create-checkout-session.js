/**
 * Vercel Serverless Function - Create Stripe Checkout Session
 *
 * Thin adapter over api/stripeCheckoutCore.js (shared with the Netlify
 * function). Never expose the Stripe secret key in frontend code.
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY
 * - VITE_APP_BASE_URL (CORS origin + policy links)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { corsHeaders, createCheckoutSession, parseJsonBody } = require('./stripeCheckoutCore.cjs');

module.exports = async (req, res) => {
  Object.entries(corsHeaders(req.headers.origin)).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = parseJsonBody(req.body);
  if (body === null) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const result = await createCheckoutSession(stripe, body);
  return res.status(result.status).json(result.body);
};
