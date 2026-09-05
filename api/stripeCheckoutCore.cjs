/**
 * Shared Stripe Checkout / Customer Portal logic for the Vercel (api/) and
 * Netlify (netlify/functions/) handlers. Keeps validation, CORS policy and
 * Stripe parameters in one place so the two deploy targets cannot drift.
 *
 * Environment Variables:
 * - STRIPE_SECRET_KEY: server-side Stripe key
 * - VITE_APP_BASE_URL: canonical site origin; the only origin allowed by CORS
 * - URL: Netlify-provided site URL (fallback when VITE_APP_BASE_URL is unset)
 */

const DEFAULT_ORIGIN = 'https://www.medisoluce.com';

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

/**
 * Canonical site origin. Used both for CORS and for policy links in metadata.
 */
function getBaseUrl() {
  const configured = process.env.VITE_APP_BASE_URL || process.env.URL;
  if (configured) {
    return stripTrailingSlash(configured);
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return DEFAULT_ORIGIN;
}

function toOrigin(value) {
  if (!value) return null;
  try {
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

/**
 * Origins allowed to call these endpoints and to receive Stripe redirects:
 * the canonical site plus the platform-provided preview/deploy URLs so
 * checkout can be exercised on Netlify deploy previews and Vercel previews.
 */
function getAllowedOrigins() {
  const candidates = [
    getBaseUrl(),
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ];
  return new Set(candidates.map(toOrigin).filter(Boolean));
}

/**
 * CORS headers restricted to a known origin. Never '*': these endpoints
 * create billable Stripe sessions under the MediSoluce account. When the
 * request's Origin is on the allow-list it is reflected; otherwise the
 * canonical origin is returned, which the browser will reject for any
 * third-party caller.
 */
function corsHeaders(requestOrigin) {
  const allowed = getAllowedOrigins();
  const origin = toOrigin(requestOrigin);
  return {
    'Access-Control-Allow-Origin': origin && allowed.has(origin) ? origin : getBaseUrl(),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

/**
 * Only allow redirect targets on an allowed origin so a caller cannot use
 * the Stripe session as an open redirect.
 */
function isAllowedUrl(candidate) {
  const origin = toOrigin(candidate);
  return Boolean(origin) && getAllowedOrigins().has(origin);
}

/**
 * Validate the request body and build Stripe Checkout Session params.
 * Returns { error, status } on validation failure, or { params }.
 */
function buildCheckoutParams(body) {
  const {
    price_id,
    success_url,
    cancel_url,
    customer_email,
    customer,
    metadata = {},
    allow_promotion_codes = true,
    subscription_data,
    mode = 'subscription',
  } = body || {};

  if (!price_id || typeof price_id !== 'string') {
    return { status: 400, error: 'price_id is required' };
  }

  if (!success_url || !cancel_url) {
    return { status: 400, error: 'success_url and cancel_url are required' };
  }

  const baseUrl = getBaseUrl();

  if (!isAllowedUrl(success_url) || !isAllowedUrl(cancel_url)) {
    return { status: 400, error: 'success_url and cancel_url must be on the application origin' };
  }

  if (mode !== 'subscription' && mode !== 'payment') {
    return { status: 400, error: "mode must be 'subscription' or 'payment'" };
  }

  const sessionMetadata = {
    ...metadata,
    privacy_policy_url: `${baseUrl}/privacy`,
    terms_url: `${baseUrl}/terms`,
    ecommerce_policy_url: `${baseUrl}/ecommerce-policy`,
  };

  const params = {
    payment_method_types: ['card'],
    line_items: [{ price: price_id, quantity: 1 }],
    mode,
    success_url,
    cancel_url,
    metadata: sessionMetadata,
    allow_promotion_codes: Boolean(allow_promotion_codes),
    payment_method_options: {
      card: { request_three_d_secure: 'automatic' },
    },
  };

  if (customer_email) {
    params.customer_email = customer_email;
  }

  if (customer) {
    params.customer = customer;
  }

  if (subscription_data && mode === 'subscription') {
    params.subscription_data = subscription_data;
  }

  return { params };
}

/**
 * Create a Checkout Session. Returns { status, body } ready to serialise.
 */
async function createCheckoutSession(stripe, body) {
  const built = buildCheckoutParams(body);
  if (built.error) {
    return { status: built.status, body: { error: built.error } };
  }

  try {
    const session = await stripe.checkout.sessions.create(built.params);
    return {
      status: 200,
      body: { session_id: session.id, url: session.url, id: session.id },
    };
  } catch (error) {
    console.error('Stripe Checkout Session creation error:', error);
    return {
      status: 500,
      body: {
        error: error.message || 'Failed to create checkout session',
        type: error.type || 'StripeError',
      },
    };
  }
}

/**
 * Create a Customer Portal session. Returns { status, body }.
 */
async function createPortalSession(stripe, body) {
  const { customer_id, return_url } = body || {};

  if (!customer_id || typeof customer_id !== 'string') {
    return { status: 400, body: { error: 'customer_id is required' } };
  }

  const portalReturnUrl = return_url && isAllowedUrl(return_url) ? return_url : getBaseUrl();

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: portalReturnUrl,
    });
    return { status: 200, body: { url: session.url } };
  } catch (error) {
    console.error('Stripe Portal Session creation error:', error);
    return {
      status: 500,
      body: {
        error: error.message || 'Failed to create portal session',
        type: error.type || 'StripeError',
      },
    };
  }
}

/**
 * Parse a raw request body that may already be an object (Vercel) or a JSON
 * string (Netlify). Returns null when the payload is not valid JSON.
 */
function parseJsonBody(raw) {
  if (raw == null) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = {
  getBaseUrl,
  corsHeaders,
  buildCheckoutParams,
  createCheckoutSession,
  createPortalSession,
  parseJsonBody,
};
