// Dynamic Pricing Calculator for MediSoluce
// Calculates personalized pricing based on organization size, risk level, and assessment results

export interface PricingFactors {
  organizationSize?: 'small' | 'medium' | 'large' | 'enterprise';
  numberOfEmployees?: number;
  numberOfSystems?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  hipaaScore?: number; // 0-100
  ransomwareScore?: number; // 0-100
  continuityScore?: number; // 0-100
  currentComplianceLevel?: 'compliant' | 'partial' | 'non-compliant';
  industry?: string;
  annualRevenue?: number;
}

export interface CalculatedPricing {
  essential: number;
  professional: number;
  enterprise: number;
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
  recommendations: string[];
  rationale: string;
}

const BASE_PRICES = {
  hipaa: { essential: 49, professional: 149, enterprise: 499 },
  ransomware: { essential: 49, professional: 149, enterprise: 499 },
  continuity: { essential: 49, professional: 149, enterprise: 499 },
};

/**
 * Calculate dynamic pricing based on organization profile and assessment results
 */
export function calculateDynamicPricing(
  factors: PricingFactors,
  suite: 'hipaa' | 'ransomware' | 'continuity' | 'bundle' = 'bundle'
): CalculatedPricing {
  const basePrices = BASE_PRICES[suite === 'bundle' ? 'hipaa' : suite];
  
  // Start with base prices
  let essential = basePrices.essential;
  let professional = basePrices.professional;
  let enterprise = basePrices.enterprise;

  const recommendations: string[] = [];
  const rationale: string[] = [];

  // Factor 1: Organization Size
  if (factors.organizationSize) {
    switch (factors.organizationSize) {
      case 'enterprise':
        essential = Math.max(essential * 1.5, 75);
        professional = Math.max(professional * 1.3, 194);
        enterprise = Math.max(enterprise * 1.2, 599);
        rationale.push('Enterprise organizations receive premium features');
        break;
      case 'large':
        essential = Math.max(essential * 1.2, 59);
        professional = Math.max(professional * 1.1, 164);
        enterprise = Math.max(enterprise * 1.1, 549);
        rationale.push('Large organizations need enhanced support');
        break;
      case 'small':
        essential = Math.max(essential * 0.9, 44);
        professional = Math.max(professional * 0.95, 142);
        enterprise = enterprise;
        recommendations.push('Consider Essential plan for small organizations');
        break;
      default:
        recommendations.push('Professional plan recommended for medium organizations');
    }
  }

  // Factor 2: Number of Employees
  if (factors.numberOfEmployees) {
    if (factors.numberOfEmployees > 500) {
      professional = Math.max(professional * 1.15, 171);
      enterprise = Math.max(enterprise * 1.15, 574);
      rationale.push('Organizations with 500+ employees require team features');
    } else if (factors.numberOfEmployees < 50) {
      essential = Math.max(essential * 0.85, 42);
      recommendations.push('Essential plan ideal for organizations under 50 employees');
    }
  }

  // Factor 3: Risk Level (Most Important Factor)
  if (factors.riskLevel) {
    switch (factors.riskLevel) {
      case 'critical':
        essential = Math.max(essential * 1.4, 69);
        professional = Math.max(professional * 1.4, 209);
        enterprise = Math.max(enterprise * 1.3, 649);
        recommendations.push('CRITICAL: Immediate upgrade to Enterprise recommended');
        recommendations.push('Your organization is at high risk - comprehensive protection required');
        rationale.push('Critical risk level requires enterprise-grade solutions');
        break;
      case 'high':
        essential = Math.max(essential * 1.2, 59);
        professional = Math.max(professional * 1.2, 179);
        enterprise = Math.max(enterprise * 1.15, 574);
        recommendations.push('High risk detected - Professional or Enterprise plan recommended');
        rationale.push('High risk requires advanced security measures');
        break;
      case 'medium':
        professional = professional;
        recommendations.push('Medium risk - Standard Professional plan sufficient');
        break;
      case 'low':
        essential = Math.max(essential * 0.9, 44);
        professional = Math.max(professional * 0.95, 142);
        recommendations.push('Low risk detected - Essential plan may be sufficient');
        rationale.push('Low risk organizations can use basic tier');
        break;
    }
  }

  // Factor 4: Assessment Scores
  if (factors.hipaaScore !== undefined) {
    if (factors.hipaaScore < 40) {
      essential = Math.max(essential * 1.3, 64);
      professional = Math.max(professional * 1.2, 179);
      recommendations.push('HIPAA score below 40% - urgent compliance upgrades needed');
    } else if (factors.hipaaScore > 80) {
      essential = Math.max(essential * 0.95, 47);
      rationale.push('Strong HIPAA compliance - pricing adjusted');
    }
  }

  if (factors.ransomwareScore !== undefined) {
    if (factors.ransomwareScore < 40) {
      essential = Math.max(essential * 1.4, 69);
      professional = Math.max(professional * 1.3, 194);
      recommendations.push('Ransomware preparedness low - upgrade to Professional required');
    }
  }

  if (factors.continuityScore !== undefined && factors.continuityScore < 40) {
    professional = Math.max(professional * 1.15, 171);
    recommendations.push('Business continuity planning needs improvement');
  }

  // Factor 5: Number of Critical Systems
  if (factors.numberOfSystems !== undefined) {
    if (factors.numberOfSystems > 20) {
      enterprise = Math.max(enterprise * 1.25, 624);
      recommendations.push('20+ systems require Enterprise tier for management');
    } else if (factors.numberOfSystems > 10) {
      professional = Math.max(professional * 1.1, 164);
      recommendations.push('10+ systems benefit from Professional features');
    }
  }

  // Factor 6: Current Compliance Level
  if (factors.currentComplianceLevel === 'non-compliant') {
    essential = Math.max(essential * 1.3, 64);
    professional = Math.max(professional * 1.25, 186);
    enterprise = Math.max(enterprise * 1.2, 599);
    recommendations.push('Non-compliant organizations need immediate assistance');
    rationale.push('Non-compliance requires comprehensive remediation');
  }

  // Calculate bundle pricing (if requested)
  const bundleEssential = Math.max(
    Math.round((essential * 3) * 0.7), // 30% discount
    essential + 50
  );
  const bundleProfessional = Math.max(
    Math.round((professional * 3) * 0.75), // 25% discount
    professional + 100
  );
  const bundleEnterprise = Math.max(
    Math.round((enterprise * 3) * 0.8), // 20% discount
    enterprise + 200
  );

  // Calculate savings
  const essentialSavings = (essential * 3) - bundleEssential;
  const professionalSavings = (professional * 3) - bundleProfessional;
  const enterpriseSavings = (enterprise * 3) - bundleEnterprise;

  // Round to whole numbers
  essential = Math.round(essential);
  professional = Math.round(professional);
  enterprise = Math.round(enterprise);

  return {
    essential,
    professional,
    enterprise,
    bundle: {
      essential: bundleEssential,
      professional: bundleProfessional,
      enterprise: bundleEnterprise,
    },
    savings: {
      essential: essentialSavings,
      professional: professionalSavings,
      enterprise: enterpriseSavings,
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Standard pricing applied'],
    rationale: rationale.length > 0 ? rationale.join('. ') : 'Standard pricing based on your organization profile',
  };
}

/**
 * Estimate organization size based on employee count
 */
export function estimateOrganizationSize(employeeCount?: number): 'small' | 'medium' | 'large' | 'enterprise' | undefined {
  if (!employeeCount) return undefined;
  
  if (employeeCount < 50) return 'small';
  if (employeeCount < 200) return 'medium';
  if (employeeCount < 1000) return 'large';
  return 'enterprise';
}

/**
 * Determine risk level based on assessment scores
 */
export function calculateRiskLevel(scores: {
  hipaa?: number;
  ransomware?: number;
  continuity?: number;
}): 'low' | 'medium' | 'high' | 'critical' {
  const avgScore = [
    scores.hipaa ?? 100,
    scores.ransomware ?? 100,
    scores.continuity ?? 100,
  ].reduce((a, b) => a + b, 0) / 3;

  if (avgScore < 40) return 'critical';
  if (avgScore < 60) return 'high';
  if (avgScore < 80) return 'medium';
  return 'low';
}

/**
 * Get pricing factors from local storage
 */
export function getPricingFactorsFromStorage(): PricingFactors {
  try {
    const assessments = JSON.parse(localStorage.getItem('hipaa-assessments') || '[]');
    const impactAssessments = JSON.parse(localStorage.getItem('business-impact-assessments') || '[]');
    const dependencies = JSON.parse(localStorage.getItem('system-dependencies') || '[]');
    const userProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');

    const latestAssessment = assessments[assessments.length - 1];
    const hipaaScore = latestAssessment?.result?.percentage;

    // Calculate ransomware score from impact assessments
    let ransomwareScore: number | undefined;
    if (impactAssessments.length > 0) {
      const avgRisk = impactAssessments.reduce((sum: number, a: any) => {
        const overallRisk = (a.patientImpact + a.operationalImpact + a.financialImpact + a.complianceImpact) / 4;
        return sum + overallRisk;
      }, 0) / impactAssessments.length;
      ransomwareScore = (avgRisk / 5) * 100; // Convert 1-5 scale to percentage
    }

    // Count critical systems
    const numberOfSystems = dependencies.length;
    const criticalSystems = dependencies.filter((d: any) => d.criticality === 'Critical').length;

    // Get organization size from profile or estimate
    const organizationSize = userProfile.organizationSize || 
      estimateOrganizationSize(userProfile.numberOfEmployees);

    const hipaaRiskScore = hipaaScore ? (100 - hipaaScore) / 10 : undefined;
    const ransomwareRiskScore = ransomwareScore ? (100 - ransomwareScore) / 10 : undefined;
    const riskLevel = calculateRiskLevel({ hipaa: hipaaScore, ransomware: ransomwareScore });

    return {
      organizationSize,
      numberOfEmployees: userProfile.numberOfEmployees || dependencies.length * 5,
      numberOfSystems,
      riskLevel,
      hipaaScore,
      ransomwareScore,
      currentComplianceLevel: hipaaScore && hipaaScore > 80 ? 'compliant' : 
                            hipaaScore && hipaaScore > 50 ? 'partial' : 'non-compliant',
      industry: userProfile.industry,
    };
  } catch (error) {
    console.error('Error reading pricing factors from storage:', error);
    return {};
  }
}

