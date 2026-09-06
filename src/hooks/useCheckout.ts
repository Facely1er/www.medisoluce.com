/**
 * useCheckout — the single UI entry point into Stripe payment.
 *
 * Preferred: Stripe Payment Links (VITE_STRIPE_PAYMENT_LINK_*). No serverless
 * call — redirect straight to buy.stripe.com.
 *
 * Fallback: Dashboard Price IDs via /api/create-checkout-session.
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { authProvider, isBillingEnabled } from '../config/runtimeConfig';
import {
  buildPaymentLinkUrl,
  getStripePaymentLink,
  getStripePriceId,
  hasCheckoutOption,
  type BillableProduct,
  type BillableTier,
} from '../config/stripePrices';
import { redirectToCheckout } from '../services/stripeService';

export interface UseCheckoutResult {
  /** True when billing is on and this tier has a Payment Link or Price ID. */
  canCheckout: (tier: BillableTier) => boolean;
  /** Start payment for the tier. Resolves when the redirect begins or a guard stops it. */
  startCheckout: (tier: BillableTier) => Promise<void>;
  /** True while a checkout session is being created (API path only). */
  pending: boolean;
  /** Alias of `pending` for callers that read it as a redirect state. */
  isRedirecting: boolean;
}

export function useCheckout(product: BillableProduct): UseCheckoutResult {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  const canCheckout = useCallback(
    (tier: BillableTier) => isBillingEnabled && hasCheckoutOption(product, tier),
    [product]
  );

  const startCheckout = useCallback(
    async (tier: BillableTier) => {
      if (!isBillingEnabled) {
        return;
      }

      const paymentLink = getStripePaymentLink(product, tier);
      const priceId = getStripePriceId(product, tier);

      if (!paymentLink && !priceId) {
        showToast({
          type: 'info',
          title: t('pricing_common.checkout_unavailable'),
          message: t('pricing_common.checkout_unavailable_message'),
        });
        navigate('/contact');
        return;
      }

      // Payment Links work without sign-in; Checkout Sessions in Supabase mode
      // still prefer a signed-in user so webhooks can attach the subscription.
      if (!paymentLink && authProvider === 'supabase' && !user) {
        showToast({
          type: 'info',
          title: t('pricing_common.sign_in_required'),
          message: t('pricing_common.sign_in_required_checkout'),
        });
        navigate('/login');
        return;
      }

      // Preferred: Stripe Payment Link (no API round-trip).
      if (paymentLink) {
        setPending(true);
        window.location.assign(
          buildPaymentLinkUrl(paymentLink, {
            email: user?.email,
            clientReferenceId: user?.id,
          })
        );
        return;
      }

      setPending(true);
      const origin = window.location.origin;
      try {
        await redirectToCheckout({
          priceId: priceId!,
          successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/checkout/cancel`,
          customerEmail: user?.email,
          mode: 'subscription',
          metadata: {
            product,
            tier,
            ...(user?.id ? { user_id: user.id } : {}),
          },
        });
      } catch (error) {
        setPending(false);
        showToast({
          type: 'error',
          title: t('pricing_common.checkout_error'),
          message:
            error instanceof Error && error.message
              ? error.message
              : t('pricing_common.checkout_error_message'),
        });
      }
    },
    [product, user, showToast, t, navigate]
  );

  return { canCheckout, startCheckout, pending, isRedirecting: pending };
}
