import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  buildCheckoutParams,
  corsHeaders,
  createCheckoutSession,
  createPortalSession,
  getConfiguredPriceIds,
  getStripeClient,
  isAllowedUrl,
  parseJsonBody,
} = require('../../api/stripeCheckoutCore.cjs');

const SITE = 'https://www.medisoluce.com';
const PRICE = 'price_1TestCatalogAAA';

function restoreEnv(snapshot: NodeJS.ProcessEnv) {
  for (const key of Object.keys(process.env)) {
    if (!(key in snapshot)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, snapshot);
}

describe('stripeCheckoutCore', () => {
  let snapshot: NodeJS.ProcessEnv;

  beforeEach(() => {
    snapshot = { ...process.env };
    process.env.VITE_APP_BASE_URL = SITE;
    process.env.STRIPE_ALLOWED_PRICE_IDS = PRICE;
    delete process.env.URL;
    delete process.env.DEPLOY_PRIME_URL;
    delete process.env.DEPLOY_URL;
    delete process.env.VERCEL_URL;
    delete process.env.VERCEL_BRANCH_URL;
  });

  afterEach(() => {
    restoreEnv(snapshot);
  });

  it('parses JSON bodies and empty payloads', () => {
    expect(parseJsonBody(null)).toEqual({});
    expect(parseJsonBody({ price_id: PRICE })).toEqual({ price_id: PRICE });
    expect(parseJsonBody(JSON.stringify({ price_id: PRICE }))).toEqual({ price_id: PRICE });
    expect(parseJsonBody('{')).toBeNull();
  });

  it('restricts CORS to the application origin', () => {
    expect(corsHeaders('https://evil.example')['Access-Control-Allow-Origin']).toBe(SITE);
    expect(corsHeaders(SITE)['Access-Control-Allow-Origin']).toBe(SITE);
  });

  it('rejects open redirects off the application origin', () => {
    expect(isAllowedUrl(`${SITE}/checkout/success`)).toBe(true);
    expect(isAllowedUrl('https://evil.example/steal')).toBe(false);
  });

  it('uses STRIPE_ALLOWED_PRICE_IDS as the exclusive catalog', () => {
    expect([...getConfiguredPriceIds()]).toEqual([PRICE]);
  });

  it('rejects unknown or unconfigured price ids', () => {
    const unknown = buildCheckoutParams({
      price_id: 'price_NotInCatalog',
      success_url: `${SITE}/checkout/success`,
      cancel_url: `${SITE}/checkout/cancel`,
    });
    expect(unknown.status).toBe(400);
    expect(unknown.error).toMatch(/allowed catalog/i);

    process.env.STRIPE_ALLOWED_PRICE_IDS = '';
    const empty = buildCheckoutParams({
      price_id: PRICE,
      success_url: `${SITE}/checkout/success`,
      cancel_url: `${SITE}/checkout/cancel`,
    });
    expect(empty.status).toBe(503);
  });

  it('builds subscription params for a catalog price', () => {
    const built = buildCheckoutParams({
      price_id: PRICE,
      success_url: `${SITE}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/checkout/cancel`,
      customer_email: 'clinic@example.com',
      metadata: { product: 'hipaa', tier: 'professional' },
    });
    expect(built.error).toBeUndefined();
    expect(built.params.mode).toBe('subscription');
    expect(built.params.line_items[0].price).toBe(PRICE);
    expect(built.params.customer_email).toBe('clinic@example.com');
    expect(built.params.metadata.product).toBe('hipaa');
  });

  it('creates a checkout session through the Stripe adapter', async () => {
    const stripe = {
      checkout: {
        sessions: {
          create: async () => ({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' }),
        },
      },
    };
    const result = await createCheckoutSession(stripe, {
      price_id: PRICE,
      success_url: `${SITE}/checkout/success`,
      cancel_url: `${SITE}/checkout/cancel`,
    });
    expect(result.status).toBe(200);
    expect(result.body.session_id).toBe('cs_test_123');
    expect(result.body.url).toContain('checkout.stripe.com');
  });

  it('returns 503 when Stripe is not configured', async () => {
    const result = await createCheckoutSession(null, {
      price_id: PRICE,
      success_url: `${SITE}/checkout/success`,
      cancel_url: `${SITE}/checkout/cancel`,
    });
    expect(result.status).toBe(503);
  });

  it('creates a portal session with a same-origin return url', async () => {
    const stripe = {
      billingPortal: {
        sessions: {
          create: async (params: { return_url: string }) => {
            expect(params.return_url).toBe(`${SITE}/dashboard`);
            return { url: 'https://billing.stripe.com/session/test' };
          },
        },
      },
    };
    const result = await createPortalSession(stripe, {
      customer_id: 'cus_test',
      return_url: `${SITE}/dashboard`,
    });
    expect(result.status).toBe(200);
    expect(result.body.url).toContain('billing.stripe.com');
  });

  it('getStripeClient returns 503 when STRIPE_SECRET_KEY is missing', () => {
    delete process.env.STRIPE_SECRET_KEY;
    const result = getStripeClient();
    expect(result.stripe).toBeUndefined();
    expect(result.status).toBe(503);
    expect(result.error).toMatch(/STRIPE_SECRET_KEY/);
  });

  it('getStripeClient constructs a client when the key is set', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_smoke';
    const result = getStripeClient();
    expect(result.error).toBeUndefined();
    expect(result.stripe).toBeDefined();
    expect(typeof result.stripe.webhooks?.constructEvent).toBe('function');
  });
});
