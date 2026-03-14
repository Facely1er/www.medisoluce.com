// SEO-focused linking utilities for improved search optimization

export interface LinkAnalytics {
  fromPage: string;
  toPage: string;
  anchorText: string;
  position: string;
  context: string;
  timestamp: string;
}

export interface PageMetrics {
  inboundLinks: number;
  outboundLinks: number;
  linkEquityScore: number;
  semanticRelevance: number;
}

// Calculate semantic relevance between pages
export const calculateSemanticRelevance = (fromPage: string, toPage: string): number => {
  const pageTopics: Record<string, string[]> = {
    '/': ['healthcare', 'compliance', 'hipaa', 'security', 'management'],
    '/hipaa-check': ['hipaa', 'compliance', 'assessment', 'privacy', 'security', 'audit'],
    '/dependency-manager': ['technology', 'systems', 'dependencies', 'infrastructure', 'security'],
    '/business-impact': ['analysis', 'impact', 'business', 'operations', 'risk', 'assessment'],
    '/continuity': ['planning', 'continuity', 'disaster', 'recovery', 'emergency', 'business'],
    '/ransomware': ['security', 'ransomware', 'cyber', 'threats', 'protection', 'incident'],
    '/training': ['education', 'training', 'compliance', 'staff', 'learning', 'certification'],
    '/toolkit': ['resources', 'templates', 'tools', 'guides', 'documentation', 'implementation']
  };

  const fromTopics = pageTopics[fromPage] || [];
  const toTopics = pageTopics[toPage] || [];
  
  const commonTopics = fromTopics.filter(topic => toTopics.includes(topic));
  const totalTopics = new Set([...fromTopics, ...toTopics]).size;
  
  return totalTopics > 0 ? (commonTopics.length / totalTopics) * 100 : 0;
};

// Generate diverse anchor text based on target page and context
export const generateAnchorText = (targetPage: string, context: string, previousTexts: string[] = []): string => {
  const anchorTemplates: Record<string, Record<string, string[]>> = {
    '/hipaa-check': {
      'benefit': [
        'evaluate your HIPAA compliance status',
        'identify compliance gaps and risks',
        'assess your privacy and security readiness',
        'determine your regulatory compliance level'
      ],
      'action': [
        'start your HIPAA assessment',
        'begin compliance evaluation',
        'conduct security assessment',
        'run privacy compliance check'
      ],
      'descriptive': [
        'comprehensive HIPAA compliance assessment',
        'healthcare privacy evaluation tool',
        'security and compliance audit',
        'regulatory readiness assessment'
      ]
    },
    '/training': {
      'benefit': [
        'strengthen your compliance knowledge',
        'enhance your team\'s expertise',
        'improve staff compliance understanding',
        'build regulatory competency'
      ],
      'action': [
        'access compliance training modules',
        'start your education journey',
        'begin staff training program',
        'enroll in certification courses'
      ],
      'descriptive': [
        'comprehensive compliance training platform',
        'healthcare education and certification',
        'staff training and development resources',
        'regulatory compliance education'
      ]
    },
    '/toolkit': {
      'benefit': [
        'access proven compliance templates',
        'download implementation resources',
        'get expert-designed tools',
        'obtain regulatory templates'
      ],
      'action': [
        'explore our resource library',
        'download compliance templates',
        'access implementation guides',
        'browse available resources'
      ],
      'descriptive': [
        'comprehensive compliance resource toolkit',
        'healthcare templates and implementation guides',
        'regulatory documentation library',
        'compliance implementation resources'
      ]
    }
  };

  const pageTemplates = anchorTemplates[targetPage];
  if (!pageTemplates) {
    return `learn more about ${targetPage.replace('/', '').replace('-', ' ')}`;
  }

  const _contextTemplates = pageTemplates[context] || pageTemplates['descriptive'];
  
  // Filter out previously used anchor texts to ensure variety
  const availableTexts = contextTemplates.filter(text => !previousTexts.includes(text));
  const textPool = availableTexts.length > 0 ? availableTexts : contextTemplates;
  
  return textPool[Math.floor(Math.random() * textPool.length)];
};

// Optimize link placement based on page performance
export const optimizeLinkPlacement = (pageMetrics: Record<string, PageMetrics>) => {
  const recommendations: string[] = [];
  
  Object.entries(pageMetrics).forEach(([page, metrics]) => {
    // Pages with low inbound links need more internal linking
    if (metrics.inboundLinks < 3) {
      recommendations.push(`Increase internal links to ${page} (currently ${metrics.inboundLinks})`);
    }
    
    // Pages with too many outbound links may dilute link equity
    if (metrics.outboundLinks > 8) {
      recommendations.push(`Consider reducing outbound links from ${page} (currently ${metrics.outboundLinks})`);
    }
    
    // Low semantic relevance indicates poor link targeting
    if (metrics.semanticRelevance < 50) {
      recommendations.push(`Improve semantic relevance of links from ${page}`);
    }
  });
  
  return recommendations;
};

// Track link performance for analytics
export const trackLinkClick = (analytics: LinkAnalytics) => {
  // Store link analytics locally for privacy
  const linkClicks = JSON.parse(localStorage.getItem('link-analytics') || '[]');
  linkClicks.push(analytics);
  
  // Keep only last 1000 clicks to prevent storage bloat
  if (linkClicks.length > 1000) {
    linkClicks.splice(0, linkClicks.length - 1000);
  }
  
  localStorage.setItem('link-analytics', JSON.stringify(linkClicks));
  
  // Send to external analytics if configured
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'internal_link_click', {
      event_category: 'Navigation',
      event_label: `${analytics.fromPage} → ${analytics.toPage}`,
      custom_parameter: analytics.context
    });
  }
};

// Generate link performance report
export const generateLinkReport = () => {
  const linkClicks = JSON.parse(localStorage.getItem('link-analytics') || '[]');
  
  // Analyze click patterns
  const linkPerformance = linkClicks.reduce((acc: unknown, click: LinkAnalytics) => {
    const linkKey = `${click.fromPage} → ${click.toPage}`;
    
    if (!acc[linkKey]) {
      acc[linkKey] = {
        clicks: 0,
        contexts: new Set(),
        anchorTexts: new Set(),
        lastClick: click.timestamp
      };
    }
    
    acc[linkKey].clicks++;
    acc[linkKey].contexts.add(click.context);
    acc[linkKey].anchorTexts.add(click.anchorText);
    acc[linkKey].lastClick = click.timestamp;
    
    return acc;
  }, {});
  
  // Sort by performance
  const sortedLinks = Object.entries(linkPerformance)
    .map(([link, data]: [string, any]) => ({
      link,
      clicks: data.clicks,
      contexts: Array.from(data.contexts),
      anchorTexts: Array.from(data.anchorTexts),
      lastClick: data.lastClick
    }))
    .sort((a, b) => b.clicks - a.clicks);
  
  return {
    totalClicks: linkClicks.length,
    uniqueLinks: Object.keys(linkPerformance).length,
    topPerformingLinks: sortedLinks.slice(0, 10),
    underperformingLinks: sortedLinks.filter(link => link.clicks < 2),
    clicksByContext: linkClicks.reduce((acc: unknown, click: LinkAnalytics) => {
      acc[click.context] = (acc[click.context] || 0) + 1;
      return acc;
    }, {})
  };
};

// Best practices for healthcare compliance linking
export const healthcareLinkingBestPractices = {
  compliance: {
    // Links to regulatory resources should be clearly marked
    regulatoryLinks: 'Use descriptive anchor text and mark as authoritative sources',
    // HIPAA-related links need special handling
    hipaaLinks: 'Always link to official HHS/OCR resources for regulatory guidance',
    // Privacy policy links are legally required
    privacyLinks: 'Include privacy policy links in footer and data collection forms'
  },
  
  accessibility: {
    // Screen reader optimization
    ariaLabels: 'Provide descriptive aria-labels for complex navigation',
    // Keyboard navigation
    focusManagement: 'Ensure logical tab order for all internal links',
    // Visual indicators
    linkIndicators: 'Use consistent styling to identify different link types'
  },
  
  performance: {
    // Preloading critical pages
    preloadHints: 'Add rel="preload" for critical user journey pages',
    // Lazy loading for secondary content
    lazyLoading: 'Implement lazy loading for sidebar and footer links',
    // Caching strategies
    cacheOptimization: 'Use appropriate cache headers for linked resources'
  }
};

// URL structure validation and recommendations
export const validateUrlStructure = (url: string): { valid: boolean; issues: string[]; suggestions: string[] } => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check URL length
  if (url.length > 100) {
    issues.push('URL too long (>100 characters)');
    suggestions.push('Shorten URL while maintaining descriptive keywords');
  }
  
  // Check for underscores
  if (url.includes('_')) {
    issues.push('URL contains underscores');
    suggestions.push('Replace underscores with hyphens for better SEO');
  }
  
  // Check for uppercase letters
  if (url !== url.toLowerCase()) {
    issues.push('URL contains uppercase letters');
    suggestions.push('Use lowercase letters for consistency');
  }
  
  // Check for keywords
  const healthcareKeywords = ['hipaa', 'compliance', 'healthcare', 'medical', 'security', 'training'];
  const hasRelevantKeywords = healthcareKeywords.some(keyword => url.includes(keyword));
  
  if (!hasRelevantKeywords) {
    suggestions.push('Consider including relevant healthcare/compliance keywords');
  }
  
  // Check URL structure depth
  const depth = url.split('/').length - 1;
  if (depth > 3) {
    issues.push('URL structure too deep');
    suggestions.push('Flatten URL hierarchy for better crawlability');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    suggestions
  };
};

// Export utility functions
export {
  linkAttributes,
  getOptimizedAnchorText
} from './linkingStrategy';