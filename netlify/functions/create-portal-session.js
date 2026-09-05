/**
 * Netlify Function - Create Stripe Customer Portal Session
 * Endpoint: /.netlify/functions/create-portal-session (also /api/create-portal-session)
 *
 * Thin adapter over api/stripeCheckoutCore.cjs. Stripe is initialised lazily
 * so a missing STRIPE_SECRET_KEY returns 503 with CORS headers instead of a
 * cold-start 502.
 */

const {
  corsHeaders,
  createPortalSession,
  parseJsonBody,
  getStripeClient,
} = require('../../api/stripeCheckoutCore.cjs');

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

  const client = getStripeClient();
  if (client.error) {
    return json(client.status, { error: client.error });
  }

  const body = parseJsonBody(event.body);
  if (body === null) {
    return json(400, { error: 'Invalid JSON body' });
  }

  const result = await createPortalSession(client.stripe, body);
  return json(result.status, result.body);
};
