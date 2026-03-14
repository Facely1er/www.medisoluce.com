/**
 * Policy URL utilities for Stripe Checkout integration
 * Provides absolute URLs for policy pages that Stripe can link to
 */

/**
 * Get the base URL for the application
 * In production, this should be your actual domain
 * In development, uses localhost
 */
export function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback to environment variable or default
  return import.meta.env.VITE_APP_BASE_URL || 
         import.meta.env.VITE_BASE_URL || 
         (import.meta.env.MODE === 'production' 
           ? 'https://www.medisoluce.com' 
           : 'http://localhost:5173');
}

/**
 * Get absolute URL for Privacy Policy
 */
export function getPrivacyPolicyUrl(): string {
  return `${getBaseUrl()}/privacy`;
}

/**
 * Get absolute URL for Terms of Service
 */
export function getTermsOfServiceUrl(): string {
  return `${getBaseUrl()}/terms`;
}

/**
 * Get absolute URL for E-Commerce Policy
 */
export function getECommercePolicyUrl(): string {
  return `${getBaseUrl()}/ecommerce-policy`;
}

/**
 * Get absolute URL for Cookie Policy
 */
export function getCookiePolicyUrl(): string {
  return `${getBaseUrl()}/cookie-policy`;
}

/**
 * Get all policy URLs as an object
 * Useful for Stripe Checkout configuration
 */
export function getAllPolicyUrls() {
  return {
    privacy: getPrivacyPolicyUrl(),
    terms: getTermsOfServiceUrl(),
    ecommerce: getECommercePolicyUrl(),
    cookie: getCookiePolicyUrl(),
  };
}

/**
 * Format policy URLs for Stripe Checkout terms parameter
 * Stripe accepts a single URL or an object with multiple policy types
 * 
 * @returns Stripe-compatible terms configuration
 */
export function getStripeTermsConfig() {
  return {
    // For Stripe Checkout Session, you can use:
    // terms: 'once' or 'recurring' with URL
    // Or use payment_method_types with terms_url
    privacyPolicy: getPrivacyPolicyUrl(),
    termsOfService: getTermsOfServiceUrl(),
    ecommercePolicy: getECommercePolicyUrl(),
  };
}

/**
 * Generate policy acknowledgment text for checkout
 * This text will be shown to users before they complete payment
 */
export function getPolicyAcknowledgmentText(): string {
  return `By completing this purchase, you agree to our Terms of Service, Privacy Policy, and E-Commerce Policies.`;
}

