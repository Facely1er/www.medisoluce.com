import { describe, it, expect } from 'vitest';
import {
  TIER_LIMITS,
  getLimit,
  formatLimit,
  isAtLimit,
  getEffectiveTier,
  type TierId,
} from '../tierLimits';

describe('tierLimits', () => {
  describe('TIER_LIMITS', () => {
    it('defines free tier with expected limits', () => {
      expect(TIER_LIMITS.free.hipaaAssessments).toBe(3);
      expect(TIER_LIMITS.free.systemDependencies).toBe(10);
      expect(TIER_LIMITS.free.continuityPlans).toBe(2);
      expect(TIER_LIMITS.free.cloudSync).toBe(false);
    });

    it('defines enterprise tier with unlimited for numeric limits', () => {
      expect(TIER_LIMITS.enterprise.hipaaAssessments).toBeNull();
      expect(TIER_LIMITS.enterprise.systemDependencies).toBeNull();
      expect(TIER_LIMITS.enterprise.exportsPerMonth).toBeNull();
      expect(TIER_LIMITS.enterprise.cloudSync).toBe(true);
    });
  });

  describe('getLimit', () => {
    it('returns limit for tier and key', () => {
      expect(getLimit('free', 'hipaaAssessments')).toBe(3);
      expect(getLimit('essential', 'systemDependencies')).toBe(25);
      expect(getLimit('professional', 'continuityPlans')).toBe(20);
    });

    it('returns null for unlimited tier keys', () => {
      expect(getLimit('enterprise', 'hipaaAssessments')).toBeNull();
      expect(getLimit('enterprise', 'exportsPerMonth')).toBeNull();
    });

  });

  describe('formatLimit', () => {
    it('returns "Unlimited" for null', () => {
      expect(formatLimit(null)).toBe('Unlimited');
    });

    it('returns string of number for numeric value', () => {
      expect(formatLimit(10)).toBe('10');
      expect(formatLimit(0)).toBe('0');
    });
  });

  describe('isAtLimit', () => {
    it('returns true when currentCount >= limit', () => {
      expect(isAtLimit('free', 'hipaaAssessments', 3)).toBe(true);
      expect(isAtLimit('free', 'hipaaAssessments', 5)).toBe(true);
      expect(isAtLimit('essential', 'systemDependencies', 25)).toBe(true);
    });

    it('returns false when currentCount < limit', () => {
      expect(isAtLimit('free', 'hipaaAssessments', 0)).toBe(false);
      expect(isAtLimit('free', 'hipaaAssessments', 2)).toBe(false);
      expect(isAtLimit('professional', 'continuityPlans', 10)).toBe(false);
    });

    it('returns false for unlimited (null) limit', () => {
      expect(isAtLimit('enterprise', 'hipaaAssessments', 100)).toBe(false);
      expect(isAtLimit('enterprise', 'systemDependencies', 1000)).toBe(false);
    });
  });

  describe('getEffectiveTier', () => {
    it('returns paidTier when provided', () => {
      expect(getEffectiveTier({ paidTier: 'professional' })).toBe('professional');
      expect(getEffectiveTier({ paidTier: 'enterprise', hasActiveTrial: true })).toBe('enterprise');
    });

    it('returns professional when hasActiveTrial and no paidTier', () => {
      expect(getEffectiveTier({ hasActiveTrial: true })).toBe('professional');
      expect(getEffectiveTier({ hasActiveTrial: true, paidTier: null })).toBe('professional');
    });

    it('returns free when no trial and no paid tier', () => {
      expect(getEffectiveTier({})).toBe('free');
      expect(getEffectiveTier({ hasActiveTrial: false, paidTier: null })).toBe('free');
    });
  });
});
