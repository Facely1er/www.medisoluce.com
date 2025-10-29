export interface PricingFactors {
  organizationSize?: 'small' | 'medium' | 'large';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  hasHadBreach?: boolean;
  complianceStatus?: 'compliant' | 'partial' | 'non-compliant';
  budget?: 'limited' | 'moderate' | 'flexible';
}

export interface CalculatedPricing {
  bundle: {
    essential: number;
    professional: number;
    enterprise: number;
  };
  savings: {
    essential: number;
    professional: number;
    enterprise: number;
  };
  essential: number;
  recommendations: string[];
  rationale: string;
}

const BASE_PRICING = {
  hipaa: {
    essential: 49,
    professional: 149,
    enterprise: 499
  },
  ransomware: {
    essential: 49,
    professional: 149,
    enterprise: 499
  },
  continuity: {
    essential: 49,
    professional: 149,
    enterprise: 499
  },
  bundle: {
    essential: 99,
    professional: 299,
    enterprise: 999
  }
};

export function getPricingFactorsFromStorage(): PricingFactors {
  try {
    const stored = localStorage.getItem('pricingFactors');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading pricing factors:', error);
  }
  
  // Return default factors
  return {
    organizationSize: 'small',
    riskLevel: 'medium',
    hasHadBreach: false,
    complianceStatus: 'partial',
    budget: 'moderate'
  };
}

export function calculateDynamicPricing(
  factors: PricingFactors,
  productType: 'hipaa' | 'ransomware' | 'continuity' | 'bundle'
): CalculatedPricing {
  const basePrices = BASE_PRICING[productType];
  
  // Calculate multiplier based on factors
  let multiplier = 1.0;
  const recommendations: string[] = [];
  
  // Organization size factor
  if (factors.organizationSize === 'medium') {
    multiplier *= 0.95;
  } else if (factors.organizationSize === 'large') {
    multiplier *= 0.9;
    recommendations.push('Large organization discount applied');
  }
  
  // Risk level factor
  if (factors.riskLevel === 'high' || factors.riskLevel === 'critical') {
    recommendations.push('High risk detected - comprehensive protection recommended');
  }
  
  // Previous breach factor
  if (factors.hasHadBreach) {
    recommendations.push('Previous breach history - enhanced security features recommended');
  }
  
  // Compliance status factor
  if (factors.complianceStatus === 'non-compliant') {
    multiplier *= 0.85;
    recommendations.push('Non-compliant status - special pricing to help you get started');
  } else if (factors.complianceStatus === 'partial') {
    multiplier *= 0.9;
    recommendations.push('Partial compliance - discounted pricing to complete your requirements');
  }
  
  // Budget factor
  if (factors.budget === 'limited') {
    multiplier *= 0.8;
    recommendations.push('Budget-conscious pricing applied');
  }
  
  // Apply multiplier to prices
  const adjustedPrices = {
    essential: Math.round(basePrices.essential * multiplier),
    professional: Math.round(basePrices.professional * multiplier),
    enterprise: Math.round(basePrices.enterprise * multiplier)
  };
  
  // Calculate savings compared to base prices
  const savings = {
    essential: basePrices.essential - adjustedPrices.essential,
    professional: basePrices.professional - adjustedPrices.professional,
    enterprise: basePrices.enterprise - adjustedPrices.enterprise
  };
  
  // Generate rationale
  let rationale = 'Based on your assessment, we\'ve customized pricing for your organization. ';
  if (multiplier < 1.0) {
    const discount = Math.round((1 - multiplier) * 100);
    rationale += `You qualify for a ${discount}% discount.`;
  } else {
    rationale += 'Standard pricing applies.';
  }
  
  return {
    bundle: adjustedPrices,
    savings,
    essential: adjustedPrices.essential,
    recommendations: recommendations.length > 0 ? recommendations : ['Standard pricing based on your needs'],
    rationale
  };
}

export function savePricingFactors(factors: PricingFactors): void {
  try {
    localStorage.setItem('pricingFactors', JSON.stringify(factors));
  } catch (error) {
    console.error('Error saving pricing factors:', error);
  }
}
