/**
 * Tier limits – single source of truth for plan limits and offering description.
 * Used for: i18n interpolation, in-app enforcement, and pricing copy.
 */

export type TierId = 'free' | 'essential' | 'professional' | 'enterprise';
export type ProductId = 'hipaa' | 'ransomware' | 'continuity';

export interface TierLimitConfig {
  hipaaAssessments: number | null; // null = unlimited
  systemDependencies: number | null;
  continuityPlans: number | null;
  businessImpactAssessments: number | null;
  users: number | null;
  cloudSync: boolean;
  exportsPerMonth: number | null;
  localStorageMB: number;
}

export const TIER_LIMITS: Record<TierId, TierLimitConfig> = {
  free: {
    hipaaAssessments: 3,
    systemDependencies: 10,
    continuityPlans: 2,
    businessImpactAssessments: 5,
    users: 1,
    cloudSync: false,
    exportsPerMonth: 3,
    localStorageMB: 5
  },
  essential: {
    hipaaAssessments: 10,
    systemDependencies: 25,
    continuityPlans: 5,
    businessImpactAssessments: 15,
    users: 1,
    cloudSync: false,
    exportsPerMonth: 10,
    localStorageMB: 5
  },
  professional: {
    hipaaAssessments: 50,
    systemDependencies: 100,
    continuityPlans: 20,
    businessImpactAssessments: 50,
    users: 5,
    cloudSync: true,
    exportsPerMonth: 50,
    localStorageMB: 5
  },
  enterprise: {
    hipaaAssessments: null,
    systemDependencies: null,
    continuityPlans: null,
    businessImpactAssessments: null,
    users: null,
    cloudSync: true,
    exportsPerMonth: null,
    localStorageMB: 5
  }
};

/** Get limit for a given tier and key; returns null for unlimited. */
export function getLimit(tier: TierId, key: keyof TierLimitConfig): number | null {
  return TIER_LIMITS[tier]?.[key] ?? null;
}

/** Format limit for display (e.g. "10" or "Unlimited"). */
export function formatLimit(value: number | null): string {
  return value === null ? 'Unlimited' : String(value);
}

/** Check if current count is at or over limit for tier. */
export function isAtLimit(tier: TierId, key: keyof TierLimitConfig, currentCount: number): boolean {
  const limit = getLimit(tier, key);
  if (limit === null) return false;
  return currentCount >= limit;
}

/** Resolve effective tier for the current user (no backend = free; with trial/paid = from subscription). */
export function getEffectiveTier(opts: { hasActiveTrial?: boolean; paidTier?: TierId | null }): TierId {
  if (opts.paidTier) return opts.paidTier;
  if (opts.hasActiveTrial) return 'professional'; // trial grants professional limits
  return 'free';
}
