/**
 * Netlify Function - Create Stripe Customer Portal Session
 * Endpoint: /.netlify/functions/create-portal-session (also /api/create-portal-session)
 *
 * Thin adapter over api/stripeCheckoutCore.js (shared with the Vercel
 * function). CORS is restricted to VITE_APP_BASE_URL.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { corsHeaders, createPortalSession, parseJsonBody } = require('../../api/stripeCheckoutCore.cjs');

exports.handler = async (event) => {
  const requestOrigin = event.headers?.origin || event.headers?.Origin;
  const cors = corsHeaders(requestOrigin);
  const headers = { 'Content-Type': 'application/json', ...cors };
  const json = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const body = parseJsonBody(event.body);
  if (body === null) {
    return json(400, { error: 'Invalid JSON body' });
  }

  const result = await createPortalSession(stripe, body);
  return json(result.status, result.body);
};
