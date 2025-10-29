/**
 * Dynamic Pricing Calculator
 * Calculates personalized pricing based on user's assessment data
 */

export interface PricingFactors {
  organizationSize?: 'small' | 'medium' | 'large';
  complianceMaturity?: 'low' | 'medium' | 'high';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  industry?: string;
  hasExistingTools?: boolean;
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
  professional: number;
  enterprise: number;
  rationale: string;
  recommendations: string[];
}

// Standard pricing as baseline
const STANDARD_PRICING = {
  bundle: {
    essential: 99,
    professional: 299,
    enterprise: 999
  },
  individual: {
    essential: 49,
    professional: 149,
    enterprise: 499
  }
};

/**
 * Get pricing factors from localStorage (from assessment data)
 */
export function getPricingFactorsFromStorage(): PricingFactors {
  try {
    const assessmentData = localStorage.getItem('hipaa-assessment-data');
    const ransomwareData = localStorage.getItem('ransomware-assessment-data');
    const continuityData = localStorage.getItem('continuity-assessment-data');
    
    const factors: PricingFactors = {};
    
    // Parse assessment data to determine factors
    if (assessmentData) {
      const data = JSON.parse(assessmentData);
      // Analyze the assessment data to determine risk level, size, etc.
      // This is a simplified implementation
      factors.complianceMaturity = data.progress > 80 ? 'high' : data.progress > 40 ? 'medium' : 'low';
    }
    
    if (ransomwareData) {
      const data = JSON.parse(ransomwareData);
      factors.riskLevel = data.criticalCount > 5 ? 'critical' : data.criticalCount > 2 ? 'high' : 'medium';
    }
    
    return factors;
  } catch (error) {
    console.warn('Could not load pricing factors from storage:', error);
    return {};
  }
}

/**
 * Calculate dynamic pricing based on user's profile and needs
 */
export function calculateDynamicPricing(
  factors: PricingFactors, 
  productType: 'bundle' | 'hipaa' | 'ransomware' | 'continuity'
): CalculatedPricing {
  // Start with standard pricing
  let essentialPrice = productType === 'bundle' 
    ? STANDARD_PRICING.bundle.essential 
    : STANDARD_PRICING.individual.essential;
  let professionalPrice = productType === 'bundle' 
    ? STANDARD_PRICING.bundle.professional 
    : STANDARD_PRICING.individual.professional;
  let enterprisePrice = productType === 'bundle' 
    ? STANDARD_PRICING.bundle.enterprise 
    : STANDARD_PRICING.individual.enterprise;
  
  const recommendations: string[] = [];
  let rationale = 'Based on our assessment, we recommend the following pricing:';
  
  // Adjust pricing based on factors
  let discount = 1.0; // No discount by default
  
  // Apply discounts for low maturity (need more help) or high risk (urgent need)
  if (factors.complianceMaturity === 'low') {
    discount = 0.85; // 15% discount for those starting their compliance journey
    recommendations.push('Starter discount applied: You\'re early in your compliance journey');
    rationale = 'We\'re offering you a special rate to help you get started with compliance.';
  } else if (factors.complianceMaturity === 'high') {
    recommendations.push('Your organization shows strong compliance maturity');
  }
  
  if (factors.riskLevel === 'critical' || factors.riskLevel === 'high') {
    discount = Math.min(discount, 0.80); // Up to 20% discount for high risk (they need it urgently)
    recommendations.push('Priority support recommended due to identified risks');
    if (factors.riskLevel === 'critical') {
      rationale = 'Your assessment revealed critical vulnerabilities. We\'re offering priority pricing to help you address these issues immediately.';
    }
  }
  
  if (factors.organizationSize === 'small') {
    discount = Math.min(discount, 0.85); // 15% discount for small practices
    recommendations.push('Small practice discount applied');
    rationale = 'We understand the challenges small practices face and want to make compliance affordable.';
  }
  
  if (factors.hasExistingTools === false) {
    recommendations.push('No existing tools detected - we can help you build from scratch');
  }
  
  // Apply discounts
  essentialPrice = Math.round(essentialPrice * discount);
  professionalPrice = Math.round(professionalPrice * discount);
  enterprisePrice = Math.round(enterprisePrice * discount);
  
  // Calculate savings vs standard pricing
  const standardEssential = productType === 'bundle' 
    ? STANDARD_PRICING.bundle.essential 
    : STANDARD_PRICING.individual.essential;
  const standardProfessional = productType === 'bundle' 
    ? STANDARD_PRICING.bundle.professional 
    : STANDARD_PRICING.individual.professional;
  const standardEnterprise = productType === 'bundle' 
    ? STANDARD_PRICING.bundle.enterprise 
    : STANDARD_PRICING.individual.enterprise;
  
  // Calculate savings for bundle (compared to buying 3 individual suites)
  const individualSuiteCost = STANDARD_PRICING.individual;
  const bundleSavings = {
    essential: (individualSuiteCost.essential * 3) - essentialPrice,
    professional: (individualSuiteCost.professional * 3) - professionalPrice,
    enterprise: (individualSuiteCost.enterprise * 3) - enterprisePrice
  };
  
  if (recommendations.length === 0) {
    recommendations.push('Standard pricing applies');
  }
  
  return {
    bundle: {
      essential: essentialPrice,
      professional: professionalPrice,
      enterprise: enterprisePrice
    },
    savings: bundleSavings,
    essential: essentialPrice,
    professional: professionalPrice,
    enterprise: enterprisePrice,
    rationale,
    recommendations
  };
}

/**
 * Calculate ROI based on pricing and potential losses
 */
export function calculateROI(monthlyPrice: number, potentialLosses: number): {
  monthlyROI: number;
  annualROI: number;
  breakEvenMonths: number;
} {
  const annualPrice = monthlyPrice * 12;
  const monthlyROI = ((potentialLosses - monthlyPrice) / monthlyPrice) * 100;
  const annualROI = ((potentialLosses - annualPrice) / annualPrice) * 100;
  const breakEvenMonths = annualPrice / monthlyPrice;
  
  return {
    monthlyROI,
    annualROI,
    breakEvenMonths
  };
}

/**
 * Get recommended tier based on factors
 */
export function getRecommendedTier(factors: PricingFactors): 'essential' | 'professional' | 'enterprise' {
  if (factors.organizationSize === 'large' || factors.riskLevel === 'critical') {
    return 'enterprise';
  }
  
  if (factors.organizationSize === 'medium' || 
      factors.riskLevel === 'high' || 
      factors.complianceMaturity === 'medium') {
    return 'professional';
  }
  
  return 'essential';
}
