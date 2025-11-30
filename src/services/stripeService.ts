/**
 * Stripe Checkout Service
 * Handles Stripe Checkout Session creation with policy links
 * 
 * Note: This service requires a backend API endpoint to securely create
 * Stripe Checkout Sessions. Never use your Stripe secret key in frontend code.
 */

import { getAllPolicyUrls, getStripeTermsConfig } from '../utils/policyUrls';

export interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  allowPromotionCodes?: boolean;
  subscriptionData?: {
    trialPeriodDays?: number;
  };
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * Create a Stripe Checkout Session via your backend API
 * 
 * This function calls your backend API which securely creates the session
 * using your Stripe secret key. Never expose your secret key in frontend code.
 * 
 * @param params Checkout session parameters
 * @returns Checkout session with redirect URL
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResponse> {
  const policyUrls = getAllPolicyUrls();
  const termsConfig = getStripeTermsConfig();

  // Call your backend API endpoint
  // Replace '/api/create-checkout-session' with your actual endpoint
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: params.priceId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      customer: params.customerId,
      metadata: {
        ...params.metadata,
        // Include policy URLs in metadata for reference
        privacy_policy_url: policyUrls.privacy,
        terms_url: policyUrls.terms,
        ecommerce_policy_url: policyUrls.ecommerce,
      },
      allow_promotion_codes: params.allowPromotionCodes ?? true,
      subscription_data: params.subscriptionData,
      // Stripe Checkout will display these policies
      // The 'terms' parameter can be set to show terms acceptance
      // For multiple policies, you can use custom fields or metadata
      payment_method_types: ['card'],
      // Note: Stripe's terms parameter accepts a single URL
      // For multiple policies, you'll need to:
      // 1. Create a combined terms page, OR
      // 2. Use Stripe's custom fields, OR
      // 3. Display policies in your checkout UI before redirecting
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create checkout session' }));
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const data = await response.json();
  return {
    sessionId: data.session_id || data.id,
    url: data.url,
  };
}

/**
 * Redirect to Stripe Checkout
 * 
 * @param params Checkout session parameters
 */
export async function redirectToCheckout(params: CheckoutSessionParams): Promise<void> {
  try {
    const session = await createCheckoutSession(params);
    // Redirect to Stripe Checkout
    window.location.href = session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Get Stripe public key from environment
 * This is safe to expose in frontend code
 */
export function getStripePublicKey(): string {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
  }
  return key;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}

