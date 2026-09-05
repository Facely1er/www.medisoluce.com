/**
 * Stripe Price ID configuration.
 *
 * Price IDs are environment-specific (test vs live) so they are injected at
 * build time via VITE_STRIPE_PRICE_<PRODUCT>_<TIER>. A tier without a
 * configured price is treated as "not purchasable online" and the UI routes
 * the user to sales instead of attempting a checkout that would 500.
 */

export type BillableProduct = 'hipaa' | 'ransomware' | 'continuity';
export type BillableTier = 'essential' | 'professional';

const PRICE_ID_PATTERN = /^price_[A-Za-z0-9]+$/;

export function readPriceId(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return PRICE_ID_PATTERN.test(trimmed) ? trimmed : null;
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

export function getStripePriceId(product: BillableProduct, tier: BillableTier): string | null {
  return priceIds[product][tier];
}

export function hasStripePrice(product: BillableProduct, tier: BillableTier): boolean {
  return getStripePriceId(product, tier) !== null;
}

/** Number of product/tier combinations with a configured Stripe Price. */
export function getConfiguredPriceCount(): number {
  return (Object.keys(priceIds) as BillableProduct[]).reduce(
    (count, product) =>
      count + (Object.keys(priceIds[product]) as BillableTier[]).filter((tier) => priceIds[product][tier] !== null).length,
    0
  );
}

/** True when at least one purchasable price is configured. */
export function hasAnyStripePrice(): boolean {
  return getConfiguredPriceCount() > 0;
}
