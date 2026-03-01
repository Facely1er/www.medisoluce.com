/**
 * Hook to check tier limits before saving. Uses free tier when no paid/trial.
 */

import { useMemo } from 'react';
import { getLimit, getEffectiveTier, type TierId } from '../config/tierLimits';
import { useAuth } from '../context/AuthContext';
import { useTrial } from './useTrial';

type LimitKey = 'hipaaAssessments' | 'systemDependencies' | 'continuityPlans' | 'businessImpactAssessments';

interface UseTierLimitOptions {
  /** Product for trial check (e.g. 'hipaa', 'continuity') */
  productId?: 'hipaa' | 'ransomware' | 'continuity';
  /** Which limit to check */
  limitKey: LimitKey;
  /** Current count (e.g. assessments.length) */
  currentCount: number;
}

interface TierLimitResult {
  tier: TierId;
  limit: number | null;
  currentCount: number;
  canSave: boolean;
  atLimit: boolean;
  isUnlimited: boolean;
}

export function useTierLimit({
  productId,
  limitKey,
  currentCount
}: UseTierLimitOptions): TierLimitResult {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const { activeTrial } = useTrial(userId, productId);

  return useMemo(() => {
    const hasActiveTrial = !!activeTrial;
    const tier = getEffectiveTier({ hasActiveTrial, paidTier: null });
    const limit = getLimit(tier, limitKey);
    const atLimit = limit !== null && currentCount >= limit;
    const canSave = !atLimit;
    const isUnlimited = limit === null;

    return {
      tier,
      limit: limit ?? null,
      currentCount,
      canSave,
      atLimit,
      isUnlimited
    };
  }, [activeTrial, limitKey, currentCount]);
}
