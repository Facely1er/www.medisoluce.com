import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateDynamicPricing,
  estimateOrganizationSize,
  calculateRiskLevel,
  getPricingFactorsFromStorage,
  savePricingFactors,
  type PricingFactors,
} from '../pricingCalculator';

describe('pricingCalculator', () => {
  describe('calculateDynamicPricing', () => {
    it('returns base prices for empty factors (bundle)', () => {
      const result = calculateDynamicPricing({}, 'bundle');
      expect(result.essential).toBeGreaterThanOrEqual(49);
      expect(result.professional).toBeGreaterThanOrEqual(149);
      expect(result.enterprise).toBeGreaterThanOrEqual(499);
      expect(result.recommendations).toBeDefined();
      expect(result.bundle).toBeDefined();
      expect(result.savings).toBeDefined();
    });

    it('returns base prices for hipaa suite', () => {
      const result = calculateDynamicPricing({}, 'hipaa');
      expect(result.essential).toBe(49);
      expect(result.professional).toBe(149);
      expect(result.enterprise).toBe(499);
    });

    it('adjusts prices for organization size enterprise', () => {
      const result = calculateDynamicPricing({ organizationSize: 'enterprise' }, 'hipaa');
      expect(result.essential).toBeGreaterThan(49);
      expect(result.professional).toBeGreaterThan(149);
      expect(result.enterprise).toBeGreaterThan(499);
    });

    it('adjusts prices for risk level critical', () => {
      const result = calculateDynamicPricing({ riskLevel: 'critical' }, 'hipaa');
      expect(result.essential).toBeGreaterThan(49);
      expect(result.recommendations.some((r) => r.toLowerCase().includes('critical'))).toBe(true);
    });

    it('adjusts prices for low HIPAA score', () => {
      const result = calculateDynamicPricing({ hipaaScore: 30 }, 'hipaa');
      expect(result.essential).toBeGreaterThan(49);
      expect(result.recommendations.some((r) => r.toLowerCase().includes('hipaa'))).toBe(true);
    });

    it('includes bundle and savings', () => {
      const result = calculateDynamicPricing({}, 'bundle');
      expect(result.bundle.essential).toBeDefined();
      expect(result.bundle.professional).toBeDefined();
      expect(result.bundle.enterprise).toBeDefined();
      expect(result.savings.essential).toBeGreaterThanOrEqual(0);
      expect(result.savings.professional).toBeGreaterThanOrEqual(0);
      expect(result.savings.enterprise).toBeGreaterThanOrEqual(0);
    });
  });

  describe('estimateOrganizationSize', () => {
    it('returns undefined for no input', () => {
      expect(estimateOrganizationSize(undefined)).toBeUndefined();
    });

    it('returns small for < 50 employees', () => {
      expect(estimateOrganizationSize(10)).toBe('small');
      expect(estimateOrganizationSize(49)).toBe('small');
    });

    it('returns medium for 50–199', () => {
      expect(estimateOrganizationSize(50)).toBe('medium');
      expect(estimateOrganizationSize(199)).toBe('medium');
    });

    it('returns large for 200–999', () => {
      expect(estimateOrganizationSize(200)).toBe('large');
      expect(estimateOrganizationSize(999)).toBe('large');
    });

    it('returns enterprise for 1000+', () => {
      expect(estimateOrganizationSize(1000)).toBe('enterprise');
      expect(estimateOrganizationSize(5000)).toBe('enterprise');
    });
  });

  describe('calculateRiskLevel', () => {
    it('returns critical when average score < 40', () => {
      expect(calculateRiskLevel({ hipaa: 30, ransomware: 30, continuity: 30 })).toBe('critical');
      expect(calculateRiskLevel({ hipaa: 20, ransomware: 20, continuity: 20 })).toBe('critical');
    });

    it('returns high when average 40–59', () => {
      expect(calculateRiskLevel({ hipaa: 50, ransomware: 50, continuity: 50 })).toBe('high');
    });

    it('returns medium when average 60–79', () => {
      expect(calculateRiskLevel({ hipaa: 70, ransomware: 70, continuity: 70 })).toBe('medium');
    });

    it('returns low when average >= 80', () => {
      expect(calculateRiskLevel({ hipaa: 90, ransomware: 90, continuity: 90 })).toBe('low');
      expect(calculateRiskLevel({})).toBe('low'); // defaults 100
    });
  });

  describe('getPricingFactorsFromStorage', () => {
    it('returns object (from empty or populated storage) without throwing', () => {
      const result = getPricingFactorsFromStorage();
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('savePricingFactors', () => {
    it('does not throw for valid factors', () => {
      expect(() => savePricingFactors({ organizationSize: 'small' })).not.toThrow();
    });
  });
});
