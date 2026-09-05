import { describe, it, expect } from 'vitest';
import { getStripePriceId, hasAnyStripePrice, readPriceId } from '../stripePrices';

describe('readPriceId', () => {
  it('accepts a Stripe Price id', () => {
    expect(readPriceId('price_1ABC')).toBe('price_1ABC');
    expect(readPriceId('  price_1ABC  ')).toBe('price_1ABC');
  });

  it('rejects empty and non-price values', () => {
    expect(readPriceId(undefined)).toBeNull();
    expect(readPriceId('')).toBeNull();
    expect(readPriceId('   ')).toBeNull();
    expect(readPriceId('pk_live_abc')).toBeNull();
    expect(readPriceId('price_')).toBeNull();
    expect(readPriceId('sk_test_123')).toBeNull();
  });
});

describe('stripePrices catalog', () => {
  it('has no prices in the test environment unless env is injected at build time', () => {
    expect(getStripePriceId('hipaa', 'professional')).toBeNull();
    expect(getStripePriceId('ransomware', 'essential')).toBeNull();
    expect(hasAnyStripePrice()).toBe(false);
  });
});
