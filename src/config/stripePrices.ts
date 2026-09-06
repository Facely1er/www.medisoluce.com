/**
 * Stripe catalog for self-serve billing.
 *
 * Preferred path: Payment Links (`buy.stripe.com/...`) created in the Stripe
 * Dashboard. These need no serverless checkout call — the UI just redirects.
 *
 * Fallback path: Price IDs (`price_...`) that go through `/api/create-checkout-session`.
 *
 * Env vars (build-time, Vite):
 *   VITE_STRIPE_PAYMENT_LINK_<PRODUCT>_<TIER>=https://buy.stripe.com/...
 *   VITE_STRIPE_PRICE_<PRODUCT>_<TIER>=price_...
 */

export type BillableProduct = 'hipaa' | 'ransomware' | 'continuity';
export type BillableTier = 'essential' | 'professional';

const PRICE_ID_PATTERN = /^price_[A-Za-z0-9]+$/;
/** Stripe Payment Links hosted on buy.stripe.com */
const PAYMENT_LINK_PATTERN = /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_-]+$/i;

export function readPriceId(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return PRICE_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export function readPaymentLink(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\/+$/, '');
  return PAYMENT_LINK_PATTERN.test(trimmed) ? trimmed : null;
}

// Explicit static references so Vite can statically replace each variable.
const priceIds: Record<BillableProduct, Record<BillableTier, string | null>> = {
  hipaa: {
    essential: readPriceId(import.meta.env.VITE_STRIPE_PRICE_HIPAA_ESSENTIAL),
    professional: readPriceId(import.meta.env.VITE_STRIPE_PRICE_HIPAA_PROFESSIONAL),
  },
  ransomware: {
    essential: readPriceId(import.meta.env.VITE_STRIPE_PRICE_RANSOMWARE_ESSENTIAL),
    professional: readPriceId(import.meta.env.VITE_STRIPE_PRICE_RANSOMWARE_PROFESSIONAL),
  },
  continuity: {
    essential: readPriceId(import.meta.env.VITE_STRIPE_PRICE_CONTINUITY_ESSENTIAL),
    professional: readPriceId(import.meta.env.VITE_STRIPE_PRICE_CONTINUITY_PROFESSIONAL),
  },
};

const paymentLinks: Record<BillableProduct, Record<BillableTier, string | null>> = {
  hipaa: {
    essential: readPaymentLink(import.meta.env.VITE_STRIPE_PAYMENT_LINK_HIPAA_ESSENTIAL),
    professional: readPaymentLink(import.meta.env.VITE_STRIPE_PAYMENT_LINK_HIPAA_PROFESSIONAL),
  },
  ransomware: {
    essential: readPaymentLink(import.meta.env.VITE_STRIPE_PAYMENT_LINK_RANSOMWARE_ESSENTIAL),
    professional: readPaymentLink(import.meta.env.VITE_STRIPE_PAYMENT_LINK_RANSOMWARE_PROFESSIONAL),
  },
  continuity: {
    essential: readPaymentLink(import.meta.env.VITE_STRIPE_PAYMENT_LINK_CONTINUITY_ESSENTIAL),
    professional: readPaymentLink(import.meta.env.VITE_STRIPE_PAYMENT_LINK_CONTINUITY_PROFESSIONAL),
  },
};

export function getStripePriceId(product: BillableProduct, tier: BillableTier): string | null {
  return priceIds[product][tier];
}

export function getStripePaymentLink(product: BillableProduct, tier: BillableTier): string | null {
  return paymentLinks[product][tier];
}

export function hasStripePrice(product: BillableProduct, tier: BillableTier): boolean {
  return getStripePriceId(product, tier) !== null;
}

export function hasStripePaymentLink(product: BillableProduct, tier: BillableTier): boolean {
  return getStripePaymentLink(product, tier) !== null;
}

/** True when this tier can start self-serve payment (Payment Link or Price ID). */
export function hasCheckoutOption(product: BillableProduct, tier: BillableTier): boolean {
  return hasStripePaymentLink(product, tier) || hasStripePrice(product, tier);
}

/**
 * Build the Payment Link URL with optional prefilled email and client reference
 * (so the webhook / Stripe Dashboard can tie the purchase back to a user).
 */
export function buildPaymentLinkUrl(
  link: string,
  options?: { email?: string | null; clientReferenceId?: string | null }
): string {
  const url = new URL(link);
  if (options?.email) {
    url.searchParams.set('prefilled_email', options.email);
  }
  if (options?.clientReferenceId) {
    url.searchParams.set('client_reference_id', options.clientReferenceId);
  }
  return url.toString();
}

function countConfigured(
  catalog: Record<BillableProduct, Record<BillableTier, string | null>>
): number {
  return (Object.keys(catalog) as BillableProduct[]).reduce(
    (count, product) =>
      count +
      (Object.keys(catalog[product]) as BillableTier[]).filter((tier) => catalog[product][tier] !== null)
        .length,
    0
  );
}

/** Number of product/tier combinations with a configured Stripe Price. */
export function getConfiguredPriceCount(): number {
  return countConfigured(priceIds);
}

/** Number of product/tier combinations with a configured Payment Link. */
export function getConfiguredPaymentLinkCount(): number {
  return countConfigured(paymentLinks);
}

/** True when at least one self-serve checkout option is configured. */
export function hasAnyStripePrice(): boolean {
  return getConfiguredPriceCount() > 0 || getConfiguredPaymentLinkCount() > 0;
}
