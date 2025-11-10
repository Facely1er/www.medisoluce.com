// SEO and linking utilities for better search optimization

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  nofollow?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Best practices for link attributes
export const getLinkAttributes = (href: string, options: { external?: boolean; nofollow?: boolean; tracking?: boolean } = {}) => {
  const attributes: Record<string, string> = {};
  
  // External link handling
  if (options.external || href.startsWith('http') && !href.includes(window.location.hostname)) {
    attributes.target = '_blank';
    attributes.rel = 'noopener noreferrer';
    
    if (options.nofollow) {
      attributes.rel += ' nofollow';
    }
  }
  
  // Analytics tracking
  if (options.tracking) {
    attributes['data-analytics'] = 'internal-link';
    attributes['data-link-destination'] = href;
  }
  
  return attributes;
};

// Generate contextual anchor text based on current page and target
export const getContextualAnchorText = (currentPage: string, targetPage: string, context: 'navigation' | 'content' | 'cta' = 'content'): string => {
  const anchorTextMap: Record<string, Record<string, Record<string, string>>> = {
    '/hipaa-check': {
      '/training': {
        content: 'enhance your HIPAA knowledge with our training modules',
        navigation: 'Training Center',
        cta: 'Start HIPAA Training'
      },
      '/toolkit': {
        content: 'download our comprehensive HIPAA compliance toolkit',
        navigation: 'Resource Toolkit', 
        cta: 'Access Compliance Resources'
      },
      '/dependency-manager': {
        content: 'map your critical technology dependencies',
        navigation: 'Dependency Manager',
        cta: 'Evaluate System Dependencies'
      }
    },
    '/dependency-manager': {
      '/business-impact': {
        content: 'analyze the business impact of system failures',
        navigation: 'Business Impact Analysis',
        cta: 'Assess Business Impact'
      },
      '/continuity': {
        content: 'develop comprehensive business continuity plans',
        navigation: 'Business Continuity',
        cta: 'Create Continuity Plans'
      }
    },
    '/training': {
      '/hipaa-check': {
        content: 'test your knowledge with our HIPAA compliance assessment',
        navigation: 'HIPAA Assessment',
        cta: 'Take Assessment Now'
      },
      '/toolkit': {
        content: 'download training materials and implementation guides',
        navigation: 'Resource Toolkit',
        cta: 'Access Training Resources'
      }
    }
  };
  
  return anchorTextMap[currentPage]?.[targetPage]?.[context] || 
         anchorTextMap[currentPage]?.[targetPage]?.['content'] ||
         `Learn more about ${targetPage.replace('/', '').replace('-', ' ')}`;
};

// SEO-optimized internal link structure
export const seoLinkStructure = {
  // Hub pages (high authority pages that should link to many others)
  hubPages: ['/dashboard', '/', '/toolkit'],
  
  // Service pages (main offering pages)
  servicePages: ['/hipaa-check', '/dependency-manager', '/business-impact', '/continuity', '/ransomware', '/training'],
  
  // Support pages
  supportPages: ['/contact', '/privacy', '/terms'],
  
  // Conversion pages
  conversionPages: ['/thanks', '/dashboard'],
  
  // Link equity distribution strategy
  linkDistribution: {
    '/': ['all service pages', '/dashboard', '/toolkit'], // Homepage links to everything
    '/dashboard': ['all service pages', '/toolkit'], // Dashboard as hub
    '/toolkit': ['all service pages', '/contact'], // Toolkit links to services for context
    '/hipaa-check': ['/training', '/toolkit', '/dependency-manager'], // Assessment suggests next steps
    '/dependency-manager': ['/business-impact', '/continuity', '/ransomware'], // Technical progression
    '/business-impact': ['/continuity', '/dependency-manager'], // Analysis to planning
    '/continuity': ['/business-impact', '/toolkit', '/training'], // Planning to implementation
    '/ransomware': ['/training', '/toolkit', '/dependency-manager'], // Security focus
    '/training': ['/hipaa-check', '/toolkit', '/dashboard'] // Education to application
  }
};

// Priority keywords for anchor text optimization
export const priorityKeywords = {
  '/hipaa-check': ['HIPAA compliance', 'healthcare compliance assessment', 'privacy compliance', 'security assessment'],
  '/dependency-manager': ['technology dependency mapping', 'system dependency analysis', 'IT risk assessment'],
  '/business-impact': ['business impact analysis', 'operational risk assessment', 'system criticality'],
  '/continuity': ['business continuity planning', 'disaster recovery', 'emergency planning'],
  '/ransomware': ['ransomware protection', 'cybersecurity', 'incident response'],
  '/training': ['compliance training', 'healthcare education', 'HIPAA training'],
  '/toolkit': ['compliance resources', 'policy templates', 'healthcare toolkit']
};

// Generate sitemap data for better crawling
export const generateSitemapData = () => {
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'monthly' },
    { url: '/hipaa-check', priority: 0.9, changefreq: 'monthly' },
    { url: '/dependency-manager', priority: 0.8, changefreq: 'monthly' },
    { url: '/business-impact', priority: 0.8, changefreq: 'monthly' },
    { url: '/continuity', priority: 0.8, changefreq: 'monthly' },
    { url: '/ransomware', priority: 0.8, changefreq: 'monthly' },
    { url: '/training', priority: 0.7, changefreq: 'monthly' },
    { url: '/toolkit', priority: 0.7, changefreq: 'monthly' },
    { url: '/dashboard', priority: 0.6, changefreq: 'weekly' },
    { url: '/contact', priority: 0.5, changefreq: 'quarterly' },
    { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { url: '/terms', priority: 0.3, changefreq: 'yearly' }
  ];
  
  return pages;
};