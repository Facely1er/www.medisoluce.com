/**
 * Public marketing URLs (tools, pricing, company, legal).
 * Omit dashboard/auth/checkout/health/profile and other app internals.
 */
export const MARKETING_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/hipaa-check', priority: '0.9', changefreq: 'monthly' },
  { path: '/dependency-manager', priority: '0.8', changefreq: 'monthly' },
  { path: '/business-impact', priority: '0.8', changefreq: 'monthly' },
  { path: '/continuity', priority: '0.8', changefreq: 'monthly' },
  { path: '/ransomware', priority: '0.8', changefreq: 'monthly' },
  { path: '/training', priority: '0.7', changefreq: 'monthly' },
  { path: '/toolkit', priority: '0.7', changefreq: 'monthly' },
  { path: '/comprehensive-assessment', priority: '0.7', changefreq: 'monthly' },
  { path: '/security', priority: '0.6', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing/hipaa', priority: '0.6', changefreq: 'monthly' },
  { path: '/pricing/ransomware', priority: '0.6', changefreq: 'monthly' },
  { path: '/pricing/continuity', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' },
  { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/ecommerce-policy', priority: '0.3', changefreq: 'yearly' },
];
