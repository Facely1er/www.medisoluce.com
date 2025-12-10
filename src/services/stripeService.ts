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
  mode?: 'subscription' | 'payment'; // 'subscription' for recurring, 'payment' for one-time
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

  // Get API URL - supports both Vercel and Netlify deployments
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const endpoint = `${apiUrl}/create-checkout-session`;

  // Call your backend API endpoint
  const response = await fetch(endpoint, {
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
      mode: params.mode || 'subscription',
      subscription_data: params.subscriptionData,
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

/**
 * Create a Customer Portal session for managing subscriptions
 * 
 * @param customerId Stripe customer ID
 * @param returnUrl URL to return to after portal session
 * @returns Portal session URL
 */
export async function createPortalSession(
  customerId: string,
  returnUrl?: string
): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const endpoint = `${apiUrl}/create-portal-session`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
      return_url: returnUrl || window.location.origin,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create portal session' }));
    throw new Error(error.message || 'Failed to create portal session');
  }

  const data = await response.json();
  return data.url;
}

