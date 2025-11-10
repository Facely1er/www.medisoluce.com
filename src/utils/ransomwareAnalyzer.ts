/**
 * Ransomware Threat Intelligence Analyzer
 * 
 * Provides analysis, categorization, and insights for ransomware threats
 */

import { RSSItem } from '../services/rssFeedService';

export interface ThreatInsight {
  category: 'ransomware' | 'data-breach' | 'vulnerability' | 'advisory' | 'general';
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  affectedIndustries: string[];
  geographicalImpact: string[];
  recommendedActions: string[];
}

export interface ThreatTrend {
  timeRange: string;
  totalThreats: number;
  criticalThreats: number;
  healthcareBreaches: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Analyze a threat item for ransomware indicators
 */
export function analyzeRansomwareThreat(item: RSSItem): ThreatInsight {
  const content = `${item.title} ${item.description}`.toLowerCase();
  
  // Category detection
  const category = detectCategory(content);
  
  // Confidence scoring
  const confidence = calculateConfidence(content, category);
  
  // Urgency determination
  const urgency = determineUrgency(item.severity, content);
  
  // Affected industries
  const affectedIndustries = detectAffectedIndustries(content);
  
  // Geographical impact
  const geographicalImpact = detectGeographicalImpact(content);
  
  // Recommended actions
  const recommendedActions = generateRecommendations(category, urgency, content);
  
  return {
    category,
    confidence,
    urgency,
    affectedIndustries,
    geographicalImpact,
    recommendedActions
  };
}

/**
 * Detect threat category
 */
function detectCategory(content: string): ThreatInsight['category'] {
  if (content.includes('ransomware')) {
    return 'ransomware';
  }
  
  if (content.includes('data breach') || content.includes('breach') || content.includes('compromised')) {
    return 'data-breach';
  }
  
  if (content.includes('cve-') || content.includes('vulnerability') || content.includes('exploit')) {
    return 'vulnerability';
  }
  
  if (content.includes('advisory') || content.includes('alert') || content.includes('bulletin')) {
    return 'advisory';
  }
  
  return 'general';
}

/**
 * Calculate confidence score
 */
function calculateConfidence(content: string, category: string): number {
  let score = 0;
  
  // Specific keywords increase confidence
  const highConfidenceKeywords = [
    'confirmed', 'verified', 'actively exploiting', 'in the wild',
    'patch available', 'proof of concept'
  ];
  
  highConfidenceKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      score += 15;
    }
  });
  
  // Category-specific confidence boost
  if (category === 'ransomware') {
    score += 20;
  }
  
  // Penalize vague or speculative language
  const vagueKeywords = ['possibly', 'potentially', 'suspected', 'unconfirmed'];
  vagueKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      score -= 10;
    }
  });
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Determine urgency level
 */
function determineUrgency(severity: string | undefined, content: string): 'low' | 'medium' | 'high' | 'critical' {
  if (severity === 'critical') {
    return 'critical';
  }
  
  if (severity === 'high') {
    return 'high';
  }
  
  // Check for urgent keywords
  if (content.includes('critical') || content.includes('emergency') || content.includes('immediate')) {
    return 'high';
  }
  
  if (content.includes('0-day') || content.includes('zero-day') || content.includes('actively exploit')) {
    return 'critical';
  }
  
  return severity === 'medium' ? 'medium' : 'low';
}

/**
 * Detect affected industries
 */
function detectAffectedIndustries(content: string): string[] {
  const industries: string[] = [];
  
  const industryKeywords = {
    'Healthcare': ['healthcare', 'hospital', 'medical', 'hipaa', 'patient', 'health system'],
    'Finance': ['financial', 'banking', 'credit union', 'fintech'],
    'Education': ['education', 'university', 'school', 'college'],
    'Government': ['government', 'federal', 'municipal', 'public sector'],
    'Energy': ['energy', 'power', 'utilities', 'grid'],
    'Manufacturing': ['manufacturing', 'production', 'industrial'],
    'Technology': ['tech', 'software', 'cloud', 'saas'],
    'Retail': ['retail', 'e-commerce', 'point of sale', 'pos']
  };
  
  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      industries.push(industry);
    }
  });
  
  return industries.length > 0 ? industries : ['Multiple'];
}

/**
 * Detect geographical impact
 */
function detectGeographicalImpact(content: string): string[] {
  const regions: string[] = [];
  
  const regionKeywords = {
    'United States': ['us', 'usa', 'united states', 'america'],
    'Europe': ['europe', 'uk', 'france', 'germany', 'eu'],
    'Asia': ['asia', 'china', 'japan', 'india', 'singapore'],
    'Global': ['global', 'worldwide', 'multi-country', 'international']
  };
  
  Object.entries(regionKeywords).forEach(([region, keywords]) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      regions.push(region);
    }
  });
  
  return regions.length > 0 ? regions : ['Global'];
}

/**
 * Generate security recommendations
 */
function generateRecommendations(
  category: string,
  urgency: string,
  content: string
): string[] {
  const recommendations: string[] = [];
  
  // Category-specific recommendations
  if (category === 'ransomware') {
    recommendations.push('Review and test backup systems immediately');
    recommendations.push('Ensure network segmentation is in place');
    recommendations.push('Update endpoint protection and EDR solutions');
    recommendations.push('Review incident response plan');
  }
  
  if (category === 'data-breach') {
    recommendations.push('Review data access logs for suspicious activity');
    recommendations.push('Implement data loss prevention (DLP) solutions');
    recommendations.push('Enhance monitoring and detection capabilities');
  }
  
  if (category === 'vulnerability') {
    recommendations.push('Review affected systems and applications');
    recommendations.push('Apply security patches immediately');
    recommendations.push('Implement compensating controls if patching not immediately possible');
  }
  
  // Urgency-specific recommendations
  if (urgency === 'critical') {
    recommendations.unshift('Take immediate action - threat is actively being exploited');
    recommendations.unshift('Alert security team and management immediately');
  }
  
  if (urgency === 'high') {
    recommendations.unshift('Prioritize this threat - implement countermeasures within 24-48 hours');
  }
  
  // Content-specific recommendations
  if (content.includes('phishing')) {
    recommendations.push('Enhance email security and user awareness training');
  }
  
  if (content.includes('remote')) {
    recommendations.push('Review and secure remote access mechanisms');
    recommendations.push('Implement zero-trust network architecture');
  }
  
  if (content.includes('supply chain')) {
    recommendations.push('Conduct vendor security assessment');
    recommendations.push('Implement third-party risk management');
  }
  
  // Healthcare-specific recommendations
  if (content.includes('healthcare') || content.includes('hipaa')) {
    recommendations.push('Verify HIPAA compliance measures are up to date');
    recommendations.push('Review business associate agreements (BAAs)');
    recommendations.push('Conduct staff training on incident response procedures');
  }
  
  return recommendations;
}

/**
 * Analyze threat trends over time
 */
export function analyzeThreatTrends(items: RSSItem[]): ThreatTrend {
  const now = Date.now();
  const last24h = now - (24 * 60 * 60 * 1000);
  const last7d = now - (7 * 24 * 60 * 60 * 1000);
  const last30d = now - (30 * 24 * 60 * 60 * 1000);
  
  const recentItems = items.filter(item => {
    const pubDate = new Date(item.pubDate).getTime();
    return pubDate > last30d;
  });
  
  const last7dItems = items.filter(item => {
    const pubDate = new Date(item.pubDate).getTime();
    return pubDate > last7d;
  });
  
  const last24hItems = items.filter(item => {
    const pubDate = new Date(item.pubDate).getTime();
    return pubDate > last24h;
  });
  
  const critical = last7dItems.filter(item => item.severity === 'critical' || item.severity === 'high').length;
  const healthcare = last7dItems.filter(item => item.relevance === 'healthcare').length;
  
  // Determine trend
  const weeklyAverage = recentItems.length / 4;
  const currentWeek = last7dItems.length;
  
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (currentWeek > weeklyAverage * 1.2) {
    trend = 'increasing';
  } else if (currentWeek < weeklyAverage * 0.8) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }
  
  return {
    timeRange: 'Last 7 days',
    totalThreats: last7dItems.length,
    criticalThreats: critical,
    healthcareBreaches: healthcare,
    trend
  };
}

/**
 * Group threats by type
 */
export function groupThreatsByType(items: RSSItem[]): Record<string, RSSItem[]> {
  const grouped: Record<string, RSSItem[]> = {
    ransomware: [],
    'data-breach': [],
    vulnerability: [],
    advisory: [],
    general: []
  };
  
  items.forEach(item => {
    const insight = analyzeRansomwareThreat(item);
    grouped[insight.category].push(item);
  });
  
  return grouped;
}

/**
 * Get risk score for organization
 */
export function calculateOrganizationRiskScore(items: RSSItem[]): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: Array<{ factor: string; severity: string; contribution: number }>;
} {
  let totalScore = 0;
  const factors: Array<{ factor: string; severity: string; contribution: number }> = [];
  
  // Healthcare relevance
  const healthcareThreats = items.filter(item => item.relevance === 'healthcare').length;
  if (healthcareThreats > 0) {
    const contribution = Math.min(30, healthcareThreats * 5);
    totalScore += contribution;
    factors.push({
      factor: 'Healthcare-specific threats',
      severity: healthcareThreats > 5 ? 'high' : 'medium',
      contribution
    });
  }
  
  // Critical threats
  const criticalThreats = items.filter(item => item.severity === 'critical').length;
  if (criticalThreats > 0) {
    const contribution = criticalThreats * 10;
    totalScore += Math.min(40, contribution);
    factors.push({
      factor: 'Critical severity threats',
      severity: 'critical',
      contribution: Math.min(40, contribution)
    });
  }
  
  // Active exploitation
  const activeExploits = items.filter(item => 
    item.title.toLowerCase().includes('active') && 
    item.title.toLowerCase().includes('exploit')
  ).length;
  if (activeExploits > 0) {
    const contribution = activeExploits * 8;
    totalScore += Math.min(30, contribution);
    factors.push({
      factor: 'Actively exploited vulnerabilities',
      severity: 'high',
      contribution: Math.min(30, contribution)
    });
  }
  
  // Data breaches
  const dataBreaches = items.filter(item => 
    item.title.toLowerCase().includes('breach') ||
    item.title.toLowerCase().includes('compromise')
  ).length;
  if (dataBreaches > 0) {
    const contribution = dataBreaches * 7;
    totalScore += Math.min(25, contribution);
    factors.push({
      factor: 'Recent data breaches',
      severity: dataBreaches > 3 ? 'high' : 'medium',
      contribution: Math.min(25, contribution)
    });
  }
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'critical';
  if (totalScore >= 80) {
    level = 'critical';
  } else if (totalScore >= 50) {
    level = 'high';
  } else if (totalScore >= 25) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  return {
    score: Math.min(100, totalScore),
    level,
    factors
  };
}

export default {
  analyzeRansomwareThreat,
  analyzeThreatTrends,
  groupThreatsByType,
  calculateOrganizationRiskScore
};

