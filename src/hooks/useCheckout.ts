/**
 * useCheckout — the single UI entry point into Stripe Checkout.
 *
 * Encapsulates the guards that every pricing page needs before redirecting:
 * billing must be enabled for the deployment, a Stripe Price must be
 * configured for the product/tier, and (in Supabase mode) the user must be
 * signed in so the webhook can link the subscription to their profile.
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { authProvider, isBillingEnabled } from '../config/runtimeConfig';
import { getStripePriceId, hasStripePrice, type BillableProduct, type BillableTier } from '../config/stripePrices';
import { redirectToCheckout } from '../services/stripeService';

export interface UseCheckoutResult {
  /** True when billing is on and this tier has a configured Stripe Price. */
  canCheckout: (tier: BillableTier) => boolean;
  /** Start a Stripe Checkout for the tier. Resolves when the redirect begins or a guard stops it. */
  startCheckout: (tier: BillableTier) => Promise<void>;
  /** True while a checkout session is being created. */
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
    (tier: BillableTier) => isBillingEnabled && hasStripePrice(product, tier),
    [product]
  );

  const startCheckout = useCallback(
    async (tier: BillableTier) => {
      if (!isBillingEnabled) {
        return;
      }

      const priceId = getStripePriceId(product, tier);
      if (!priceId) {
        showToast({
          type: 'info',
          title: t('pricing_common.checkout_unavailable'),
          message: t('pricing_common.checkout_unavailable_message'),
        });
        navigate('/contact');
        return;
      }

      if (authProvider === 'supabase' && !user) {
        showToast({
          type: 'info',
          title: t('pricing_common.sign_in_required'),
          message: t('pricing_common.sign_in_required_checkout'),
        });
        navigate('/login');
        return;
      }

      setPending(true);
      const origin = window.location.origin;
      try {
        await redirectToCheckout({
          priceId,
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
        // redirectToCheckout sets window.location; keep the button disabled
        // until the navigation actually happens.
      } catch (error) {
        setPending(false);
        showToast({
          type: 'error',
          title: t('pricing_common.checkout_error'),
          message: error instanceof Error && error.message
            ? error.message
            : t('pricing_common.checkout_error_message'),
        });
      }
    },
    [product, user, showToast, t, navigate]
  );

  return { canCheckout, startCheckout, pending, isRedirecting: pending };
}
