# Stripe Setup

Paid checkout is **off** until `VITE_ENABLE_BILLING=true`. Pricing pages use `useCheckout` (`HIPAAPricingPage`, `RansomwarePricingPage`, `ContinuityPricingPage`).

Copy `.env.example` → `.env.local` for local work. Use `.env.production.example` on the host. Vite bakes `VITE_*` at **build** time — change env, then redeploy.

## Preferred: Payment Links

No serverless checkout call. Upgrade buttons redirect to `buy.stripe.com`.

1. In Stripe Dashboard, create a Payment Link per paid product/tier.
2. Set the link success redirect to:
   `https://www.medisoluce.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`
3. Set on the host:

```env
VITE_ENABLE_BILLING=true
VITE_STRIPE_PAYMENT_LINK_HIPAA_PROFESSIONAL=https://buy.stripe.com/...
VITE_STRIPE_PAYMENT_LINK_RANSOMWARE_PROFESSIONAL=https://buy.stripe.com/...
VITE_STRIPE_PAYMENT_LINK_CONTINUITY_PROFESSIONAL=https://buy.stripe.com/...
VITE_APP_BASE_URL=https://www.medisoluce.com
```

`STRIPE_SECRET_KEY` is not required to take payment this way.

Optional webhook (same `/api/webhook` endpoint) if you want subscription records in Supabase: set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

## Fallback: Checkout Session API

Used when billing is on, no Payment Link is set, and a Price ID exists.

Frontend: `redirectToCheckout` in `src/services/stripeService.ts`.

Server:

- Vercel: `api/create-checkout-session.js`, `api/create-portal-session.js`, `api/webhook.js`
- Netlify: `netlify/functions/create-checkout-session.js`, `create-portal-session.js`, `webhook.js`

Host variables:

```env
VITE_ENABLE_BILLING=true
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test
VITE_STRIPE_PRICE_HIPAA_PROFESSIONAL=price_...
VITE_APP_BASE_URL=https://www.medisoluce.com
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_ALLOWED_PRICE_IDS=price_aaa,price_bbb
STRIPE_WEBHOOK_SECRET=whsec_...
```

Never put `STRIPE_SECRET_KEY` in frontend code or git.

Customer portal API exists; no page calls `createPortalSession` yet.

## Webhook

- Vercel: `https://your-domain.com/api/webhook`
- Netlify: `https://your-domain.com/.netlify/functions/webhook`

Useful events: `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.

Local forward:

```bash
stripe listen --forward-to localhost:8888/.netlify/functions/webhook
```

## Test

- Test card `4242 4242 4242 4242`
- Confirm pricing CTA redirects (Payment Link) or opens Checkout (Price ID)
- If secret key is unset, Checkout/portal/webhook should return 503 rather than crash

## Related

- [docs/REAL_IMPLEMENTATION_CAPABILITIES.md](../REAL_IMPLEMENTATION_CAPABILITIES.md)
- [PRODUCTION_REVIEW.md](../../PRODUCTION_REVIEW.md)
- `.env.example` / `.env.production.example`
