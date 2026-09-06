import { describe, it, expect } from 'vitest';
import {
  buildPaymentLinkUrl,
  getStripePaymentLink,
  getStripePriceId,
  hasAnyStripePrice,
  readPaymentLink,
  readPriceId,
} from '../stripePrices';

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

describe('readPaymentLink', () => {
  it('accepts buy.stripe.com Payment Links', () => {
    expect(readPaymentLink('https://buy.stripe.com/test_abc123')).toBe(
      'https://buy.stripe.com/test_abc123'
    );
    expect(readPaymentLink('https://buy.stripe.com/test_abc123/')).toBe(
      'https://buy.stripe.com/test_abc123'
    );
  });

  it('rejects non-Payment-Link URLs', () => {
    expect(readPaymentLink(undefined)).toBeNull();
    expect(readPaymentLink('')).toBeNull();
    expect(readPaymentLink('https://checkout.stripe.com/c/pay/cs_test')).toBeNull();
    expect(readPaymentLink('https://evil.example/buy.stripe.com/x')).toBeNull();
    expect(readPaymentLink('http://buy.stripe.com/test_abc')).toBeNull();
  });
});

describe('buildPaymentLinkUrl', () => {
  it('appends prefilled email and client reference', () => {
    const url = buildPaymentLinkUrl('https://buy.stripe.com/test_abc', {
      email: 'user@example.com',
      clientReferenceId: 'user_123',
    });
    expect(url).toContain('prefilled_email=user%40example.com');
    expect(url).toContain('client_reference_id=user_123');
  });
});

describe('stripePrices catalog', () => {
  it('has no prices or links in the test environment unless env is injected at build time', () => {
    expect(getStripePriceId('hipaa', 'professional')).toBeNull();
    expect(getStripePaymentLink('hipaa', 'professional')).toBeNull();
    expect(getStripePriceId('ransomware', 'essential')).toBeNull();
    expect(hasAnyStripePrice()).toBe(false);
  });
});
