/**
 * Vercel Serverless Function - Create Stripe Customer Portal Session
 *
 * Thin adapter over api/stripeCheckoutCore.cjs. Stripe is initialised lazily
 * so a missing STRIPE_SECRET_KEY returns 503 with CORS headers.
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY
 * - VITE_APP_BASE_URL (CORS origin + default return URL)
 */

const {
  corsHeaders,
  createPortalSession,
  parseJsonBody,
  getStripeClient,
} = require('./stripeCheckoutCore.cjs');

module.exports = async (req, res) => {
  Object.entries(corsHeaders(req.headers.origin)).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = getStripeClient();
  if (client.error) {
    return res.status(client.status).json({ error: client.error });
  }

  const body = parseJsonBody(req.body);
  if (body === null) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const result = await createPortalSession(client.stripe, body);
  return res.status(result.status).json(result.body);
};
