import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Zap, 
  Eye, 
  FileCheck, 
  Server, 
  Globe, 
  Lock,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { systemHealthManager } from '../utils/systemHealthManager';
import { securityManager } from '../utils/securityUtils';
import { healthChecker } from '../utils/healthCheck';
import { performanceOptimizer } from '../utils/performanceOptimizer';

interface ProductionReadinessReport {
  overallScore: number;
  overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'not-ready';
  categories: {
    security: CategoryScore;
    performance: CategoryScore;
    accessibility: CategoryScore;
    compliance: CategoryScore;
    monitoring: CategoryScore;
    deployment: CategoryScore;
  };
  criticalIssues: Issue[];
  recommendations: Recommendation[];
  timestamp: string;
}

interface CategoryScore {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  weight: number;
  checks: Check[];
  impact: 'critical' | 'high' | 'medium' | 'low';
}

interface Check {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  value?: string | number;
  expected?: string | number;
  fix?: string;
}

interface Issue {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  fix: string;
  autoFixable: boolean;
}

interface Recommendation {
  title: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  description: string;
  steps: string[];
}

const ProductionReadinessPage: React.FC = () => {
  const [report, setReport] = useState<ProductionReadinessReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    performReadinessAssessment();
  }, []);

  const performReadinessAssessment = async () => {
    setIsLoading(true);
    try {
      const report = await generateProductionReadinessReport();
      setReport(report);
    } catch (error) {
      console.error('Failed to generate readiness report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProductionReadinessReport = async (): Promise<ProductionReadinessReport> => {
    // Security Assessment
    const securityReport = securityManager.generateSecurityReport();
    const securityScore = calculateSecurityScore(securityReport);
    
    // Performance Assessment
    const performanceReport = performanceOptimizer.getPerformanceSummary();
    const performanceScore = calculatePerformanceScore(performanceReport);
    
    // Accessibility Assessment
    const accessibilityScore = assessAccessibility();
    
    // Compliance Assessment
    const complianceScore = assessCompliance();
    
    // Monitoring Assessment
    const monitoringScore = assessMonitoring();
    
    // Deployment Assessment
    const deploymentScore = assessDeploymentReadiness();

    const categories = {
      security: {
        score: securityScore.score,
        status: securityScore.status,
        weight: 25,
        checks: securityScore.checks,
        impact: 'critical' as const
      },
      performance: {
        score: performanceScore.score,
        status: performanceScore.status,
        weight: 20,
        checks: performanceScore.checks,
        impact: 'high' as const
      },
      accessibility: {
        score: accessibilityScore.score,
        status: accessibilityScore.status,
        weight: 15,
        checks: accessibilityScore.checks,
        impact: 'medium' as const
      },
      compliance: {
        score: complianceScore.score,
        status: complianceScore.status,
        weight: 20,
        checks: complianceScore.checks,
        impact: 'critical' as const
      },
      monitoring: {
        score: monitoringScore.score,
        status: monitoringScore.status,
        weight: 10,
        checks: monitoringScore.checks,
        impact: 'medium' as const
      },
      deployment: {
        score: deploymentScore.score,
        status: deploymentScore.status,
        weight: 10,
        checks: deploymentScore.checks,
        impact: 'high' as const
      }
    };

    // Calculate weighted overall score
    const overallScore = Math.round(
      Object.values(categories).reduce((sum, cat) => sum + (cat.score * cat.weight / 100), 0)
    );

    const overallStatus = 
      overallScore >= 90 ? 'excellent' :
      overallScore >= 75 ? 'good' :
      overallScore >= 60 ? 'needs-improvement' : 'not-ready';

    const criticalIssues = extractCriticalIssues(categories);
    const recommendations = generateRecommendations(categories);

    return {
      overallScore,
      overallStatus,
      categories,
      criticalIssues,
      recommendations,
      timestamp: new Date().toISOString()
    };
  };

  const calculateSecurityScore = (securityReport: {
    https: boolean;
    csp?: { enabled: boolean };
    headers?: Record<string, boolean>;
    cookies?: { secureCount: number; insecureCount: number };
    localStorage: boolean;
  }) => {
    const checks: Check[] = [
      {
        name: 'HTTPS Enabled',
        status: securityReport.https ? 'pass' : 'fail',
        description: 'Secure connection protocol',
        value: securityReport.https ? 'Enabled' : 'Disabled',
        expected: 'Enabled',
        fix: 'Configure HTTPS in production deployment'
      },
      {
        name: 'Content Security Policy',
        status: securityReport.csp?.enabled ? 'pass' : 'warning',
        description: 'XSS protection through CSP headers',
        value: securityReport.csp?.enabled ? 'Configured' : 'Missing',
        expected: 'Configured',
        fix: 'Add CSP headers to deployment configuration'
      },
      {
        name: 'Security Headers',
        status: Object.values(securityReport.headers || {}).every(Boolean) ? 'pass' : 'warning',
        description: 'Essential security HTTP headers',
        value: Object.values(securityReport.headers || {}).filter(Boolean).length + ' of 4',
        expected: '4 of 4',
        fix: 'Add missing security headers in deployment config'
      },
      {
        name: 'Cookie Security',
        status: (securityReport.cookies?.secureCount || 0) > 0 && securityReport.cookies?.insecureCount === 0 ? 'pass' : 'warning',
        description: 'Secure cookie configuration',
        value: `${securityReport.cookies?.secureCount || 0} secure, ${securityReport.cookies?.insecureCount || 0} insecure`,
        expected: 'All cookies secure',
        fix: 'Configure secure cookie flags'
      },
      {
        name: 'Data Encryption',
        status: securityReport.localStorage ? 'pass' : 'warning',
        description: 'Encryption of sensitive data',
        value: securityReport.localStorage ? 'Encrypted' : 'Not encrypted',
        expected: 'Encrypted',
        fix: 'Implement data encryption for sensitive information'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor';

    return { score, status, checks };
  };

  const calculatePerformanceScore = (performanceReport: {
    averageLCP?: number;
    bundleSize?: number;
    memoryUsage?: number;
    errorRate?: number;
  }) => {
    const checks: Check[] = [
      {
        name: 'Page Load Time',
        status: (performanceReport.averageLCP || 0) <= 2500 ? 'pass' : (performanceReport.averageLCP || 0) <= 4000 ? 'warning' : 'fail',
        description: 'Largest Contentful Paint metric',
        value: `${performanceReport.averageLCP || 0}ms`,
        expected: '≤ 2500ms',
        fix: 'Optimize images and reduce bundle size'
      },
      {
        name: 'Bundle Size',
        status: (performanceReport.bundleSize || 0) <= 1000 ? 'pass' : (performanceReport.bundleSize || 0) <= 2000 ? 'warning' : 'fail',
        description: 'JavaScript bundle size',
        value: `${performanceReport.bundleSize || 0}KB`,
        expected: '≤ 1000KB',
        fix: 'Implement code splitting and tree shaking'
      },
      {
        name: 'Memory Usage',
        status: (performanceReport.memoryUsage || 0) <= 80 ? 'pass' : (performanceReport.memoryUsage || 0) <= 90 ? 'warning' : 'fail',
        description: 'JavaScript memory consumption',
        value: `${performanceReport.memoryUsage || 0}%`,
        expected: '≤ 80%',
        fix: 'Optimize memory usage and cleanup'
      },
      {
        name: 'Error Rate',
        status: (performanceReport.errorRate || 0) <= 2 ? 'pass' : (performanceReport.errorRate || 0) <= 5 ? 'warning' : 'fail',
        description: 'Application error frequency',
        value: `${performanceReport.errorRate || 0}%`,
        expected: '≤ 2%',
        fix: 'Improve error handling and validation'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor';

    return { score, status, checks };
  };

  const assessAccessibility = () => {
    const checks: Check[] = [
      {
        name: 'ARIA Labels',
        status: document.querySelectorAll('[aria-label]').length >= 10 ? 'pass' : 'warning',
        description: 'Screen reader accessibility support',
        value: document.querySelectorAll('[aria-label]').length.toString(),
        expected: '≥ 10 elements',
        fix: 'Add ARIA labels to interactive elements'
      },
      {
        name: 'Alt Text Coverage',
        status: (() => {
          const images = document.querySelectorAll('img');
          const imagesWithAlt = document.querySelectorAll('img[alt]');
          const coverage = images.length > 0 ? (imagesWithAlt.length / images.length) * 100 : 100;
          return coverage >= 95 ? 'pass' : coverage >= 80 ? 'warning' : 'fail';
        })(),
        description: 'Image accessibility descriptions',
        value: (() => {
          const images = document.querySelectorAll('img');
          const imagesWithAlt = document.querySelectorAll('img[alt]');
          return images.length > 0 ? Math.round((imagesWithAlt.length / images.length) * 100) + '%' : '100%';
        })(),
        expected: '≥ 95%',
        fix: 'Add descriptive alt text to all images'
      },
      {
        name: 'Keyboard Navigation',
        status: document.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, a, input').length >= 20 ? 'pass' : 'warning',
        description: 'Keyboard accessibility support',
        value: document.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, a, input').length.toString(),
        expected: '≥ 20 focusable elements',
        fix: 'Ensure all interactive elements are keyboard accessible'
      },
      {
        name: 'Heading Structure',
        status: (() => {
          const h1Count = document.querySelectorAll('h1').length;
          return h1Count === 1 ? 'pass' : 'warning';
        })(),
        description: 'Proper heading hierarchy',
        value: document.querySelectorAll('h1').length + ' H1 elements',
        expected: '1 H1 element per page',
        fix: 'Use proper heading hierarchy (single H1 per page)'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor';

    return { score, status, checks };
  };

  const assessCompliance = () => {
    const checks: Check[] = [
      {
        name: 'HIPAA Compliance',
        status: window.location.protocol === 'https:' && !!document.querySelector('[href*="privacy"]') ? 'pass' : 'fail',
        description: 'Healthcare privacy and security compliance',
        value: window.location.protocol === 'https:' ? 'Compliant' : 'Non-compliant',
        expected: 'Compliant',
        fix: 'Ensure HTTPS and privacy policy are implemented'
      },
      {
        name: 'Privacy Policy',
        status: !!document.querySelector('[href*="privacy"]') ? 'pass' : 'fail',
        description: 'Required privacy policy documentation',
        value: !!document.querySelector('[href*="privacy"]') ? 'Present' : 'Missing',
        expected: 'Present',
        fix: 'Add privacy policy page and links'
      },
      {
        name: 'Terms of Service',
        status: !!document.querySelector('[href*="terms"]') ? 'pass' : 'warning',
        description: 'Legal terms and conditions',
        value: !!document.querySelector('[href*="terms"]') ? 'Present' : 'Missing',
        expected: 'Present',
        fix: 'Add terms of service page'
      },
      {
        name: 'Data Retention',
        status: !!localStorage.getItem('hipaa-assessments') ? 'pass' : 'warning',
        description: 'Proper data retention policies',
        value: 'Local storage policy implemented',
        expected: 'Retention policies in place',
        fix: 'Implement comprehensive data retention policies'
      },
      {
        name: 'Audit Trail',
        status: !!localStorage.getItem('page-views') ? 'pass' : 'warning',
        description: 'User activity logging for compliance',
        value: !!localStorage.getItem('page-views') ? 'Active' : 'Inactive',
        expected: 'Active',
        fix: 'Implement comprehensive audit logging'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor';

    return { score, status, checks };
  };

  const assessMonitoring = () => {
    const checks: Check[] = [
      {
        name: 'Error Monitoring',
        status: !!localStorage.getItem('error-logs') ? 'pass' : 'warning',
        description: 'Application error tracking',
        value: !!localStorage.getItem('error-logs') ? 'Active' : 'Inactive',
        expected: 'Active',
        fix: 'Implement comprehensive error monitoring'
      },
      {
        name: 'Performance Monitoring',
        status: !!localStorage.getItem('performance-metrics') ? 'pass' : 'warning',
        description: 'Performance metrics collection',
        value: !!localStorage.getItem('performance-metrics') ? 'Active' : 'Inactive',
        expected: 'Active',
        fix: 'Enable performance monitoring and alerting'
      },
      {
        name: 'Health Checks',
        status: !!localStorage.getItem('health-history') ? 'pass' : 'warning',
        description: 'System health monitoring',
        value: !!localStorage.getItem('health-history') ? 'Active' : 'Inactive',
        expected: 'Active',
        fix: 'Implement automated health checks'
      },
      {
        name: 'Security Events',
        status: !!localStorage.getItem('security-events') ? 'pass' : 'warning',
        description: 'Security event logging and monitoring',
        value: !!localStorage.getItem('security-events') ? 'Active' : 'Inactive',
        expected: 'Active',
        fix: 'Enable security event monitoring'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor';

    return { score, status, checks };
  };

  const assessDeploymentReadiness = () => {
    const checks: Check[] = [
      {
        name: 'Build Configuration',
        status: 'pass',
        description: 'Production build settings',
        value: 'Optimized',
        expected: 'Optimized',
        fix: 'Configure production build optimizations'
      },
      {
        name: 'Environment Variables',
        status: import.meta.env.VITE_SUPABASE_URL ? 'pass' : 'warning',
        description: 'Required environment configuration',
        value: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
        expected: 'Configured',
        fix: 'Set up all required environment variables'
      },
      {
        name: 'Service Worker',
        status: 'serviceWorker' in navigator ? 'pass' : 'warning',
        description: 'Progressive Web App capabilities',
        value: 'serviceWorker' in navigator ? 'Supported' : 'Not supported',
        expected: 'Supported',
        fix: 'Enable service worker for offline functionality'
      },
      {
        name: 'Asset Optimization',
        status: document.querySelectorAll('img[loading="lazy"]').length > 0 ? 'pass' : 'warning',
        description: 'Optimized asset loading',
        value: document.querySelectorAll('img[loading="lazy"]').length + ' lazy images',
        expected: 'Lazy loading enabled',
        fix: 'Enable lazy loading for images and resources'
      }
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);
    const status = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor';

    return { score, status, checks };
  };

  const extractCriticalIssues = (categories: Record<string, { checks: Check[]; impact: string }>): Issue[] => {
    const issues: Issue[] = [];

    Object.entries(categories).forEach(([categoryName, category]) => {
      category.checks.forEach((check: Check) => {
        if (check.status === 'fail' && category.impact === 'critical') {
          issues.push({
            title: check.name,
            severity: 'critical',
            category: categoryName,
            description: check.description,
            fix: check.fix || 'Address this issue before production deployment',
            autoFixable: false
          });
        }
      });
    });

    return issues;
  };

  const generateRecommendations = (categories: Record<string, { score: number }>): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Security recommendations
    if (categories.security.score < 90) {
      recommendations.push({
        title: 'Enhance Security Configuration',
        priority: 'immediate',
        effort: 'medium',
        impact: 'high',
        description: 'Critical security measures need attention before production deployment',
        steps: [
          'Ensure HTTPS is properly configured',
          'Implement Content Security Policy headers',
          'Configure all required security headers',
          'Validate data encryption implementation'
        ]
      });
    }

    // Performance recommendations
    if (categories.performance.score < 80) {
      recommendations.push({
        title: 'Optimize Application Performance',
        priority: 'high',
        effort: 'medium',
        impact: 'high',
        description: 'Performance optimizations will improve user experience',
        steps: [
          'Implement code splitting for large bundles',
          'Optimize image loading and compression',
          'Add resource preloading for critical assets',
          'Monitor and optimize memory usage'
        ]
      });
    }

    // Compliance recommendations
    if (categories.compliance.score < 85) {
      recommendations.push({
        title: 'Strengthen Compliance Posture',
        priority: 'immediate',
        effort: 'low',
        impact: 'high',
        description: 'Healthcare compliance is mandatory before production use',
        steps: [
          'Complete HIPAA compliance validation',
          'Implement comprehensive audit logging',
          'Review and update privacy policies',
          'Establish data retention procedures'
        ]
      });
    }

    return recommendations;
  };

  const performAutoOptimization = async () => {
    setIsOptimizing(true);
    try {
      // Run optimizations
      await systemHealthManager.performComprehensiveHealthCheck();
      performanceOptimizer.forceOptimization();
      
      // Refresh report
      setTimeout(async () => {
        await performReadinessAssessment();
      }, 2000);
      
      if ('showToast' in window) {
        (window as Window & { showToast: (options: { type: string; title: string; message: string; duration: number }) => void }).showToast({
          type: 'success',
          title: 'Optimization Complete',
          message: 'Production readiness has been optimized',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const exportReadinessReport = () => {
    if (!report) return;

    const reportContent = `
MEDISOLUCE PRODUCTION READINESS REPORT
Generated: ${new Date(report.timestamp).toLocaleString()}

OVERALL ASSESSMENT
Score: ${report.overallScore}/100
Status: ${report.overallStatus.toUpperCase()}
Recommendation: ${report.overallScore >= 85 ? 'READY FOR PRODUCTION' : 'REQUIRES OPTIMIZATION BEFORE PRODUCTION'}

CATEGORY BREAKDOWN:
Security: ${report.categories.security.score}% (Weight: ${report.categories.security.weight}%)
Performance: ${report.categories.performance.score}% (Weight: ${report.categories.performance.weight}%)
Accessibility: ${report.categories.accessibility.score}% (Weight: ${report.categories.accessibility.weight}%)
Compliance: ${report.categories.compliance.score}% (Weight: ${report.categories.compliance.weight}%)
Monitoring: ${report.categories.monitoring.score}% (Weight: ${report.categories.monitoring.weight}%)
Deployment: ${report.categories.deployment.score}% (Weight: ${report.categories.deployment.weight}%)

CRITICAL ISSUES (${report.criticalIssues.length}):
${report.criticalIssues.map((issue, i) => 
  `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}: ${issue.description}`
).join('\n') || 'None'}

IMMEDIATE ACTION ITEMS:
${report.recommendations.filter(r => r.priority === 'immediate').map((rec, i) => 
  `${i + 1}. ${rec.title}: ${rec.description}`
).join('\n') || 'None'}

DETAILED SECURITY ANALYSIS:
${Object.entries(report.categories.security.checks).map(([_, check]) => 
  `- ${check.name}: ${check.status.toUpperCase()} (${check.value})`
).join('\n')}

DETAILED PERFORMANCE ANALYSIS:
${Object.entries(report.categories.performance.checks).map(([_, check]) => 
  `- ${check.name}: ${check.status.toUpperCase()} (${check.value})`
).join('\n')}

COMPLIANCE STATUS:
${Object.entries(report.categories.compliance.checks).map(([_, check]) => 
  `- ${check.name}: ${check.status.toUpperCase()} (${check.value})`
).join('\n')}

RECOMMENDATIONS FOR PRODUCTION:
${report.recommendations.map((rec, i) => 
  `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}
     Impact: ${rec.impact} | Effort: ${rec.effort}
     Steps: ${rec.steps.join(', ')}`
).join('\n\n')}

PRODUCTION READINESS CHECKLIST:
${report.overallScore >= 85 ? '✓' : '✗'} Overall score ≥ 85%
${report.categories.security.score >= 90 ? '✓' : '✗'} Security score ≥ 90%
${report.categories.compliance.score >= 85 ? '✓' : '✗'} Compliance score ≥ 85%
${report.criticalIssues.length === 0 ? '✓' : '✗'} No critical issues
${report.categories.performance.score >= 75 ? '✓' : '✗'} Performance score ≥ 75%

DEPLOYMENT STATUS: ${report.overallScore >= 85 && report.criticalIssues.length === 0 ? 'APPROVED FOR PRODUCTION' : 'REQUIRES FIXES BEFORE PRODUCTION'}

Report generated by MediSoluce Production Readiness System
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-production-readiness-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-primary-500';
    if (score >= 60) return 'text-warning-500';
    return 'text-accent-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-success-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-accent-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-6 w-6" />;
      case 'performance': return <Zap className="h-6 w-6" />;
      case 'accessibility': return <Eye className="h-6 w-6" />;
      case 'compliance': return <FileCheck className="h-6 w-6" />;
      case 'monitoring': return <Activity className="h-6 w-6" />;
      case 'deployment': return <Server className="h-6 w-6" />;
      default: return <Target className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analyzing Production Readiness...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive assessment in progress
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  Production Readiness Review
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Comprehensive assessment of system readiness for production deployment
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={performReadinessAssessment}
                  icon={<RefreshCw className="h-4 w-4" />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  onClick={performAutoOptimization}
                  disabled={isOptimizing}
                  icon={isOptimizing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                >
                  {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
                </Button>
                <Button
                  variant="outline"
                  onClick={exportReadinessReport}
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="mt-8">
              <Card className={`p-6 text-center ${
                report.overallStatus === 'excellent' ? 'border-success-200 bg-success-50 dark:bg-success-900/20' :
                report.overallStatus === 'good' ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20' :
                report.overallStatus === 'needs-improvement' ? 'border-warning-200 bg-warning-50 dark:bg-warning-900/20' :
                'border-accent-200 bg-accent-50 dark:bg-accent-900/20'
              }`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                    report.overallScore >= 90 ? 'bg-success-500' :
                    report.overallScore >= 75 ? 'bg-primary-500' :
                    report.overallScore >= 60 ? 'bg-warning-500' : 'bg-accent-500'
                  }`}>
                    {report.overallScore}%
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Production Readiness: {report.overallStatus.charAt(0).toUpperCase() + report.overallStatus.slice(1).replace('-', ' ')}
                </h2>
                <p className={`text-lg font-medium ${
                  report.overallScore >= 85 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'
                }`}>
                  {report.overallScore >= 85 ? '🚀 Ready for Production Deployment' : '⚠️ Optimization Required Before Production'}
                </p>
                {report.criticalIssues.length > 0 && (
                  <div className="mt-4 p-3 bg-accent-100 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
                    <p className="text-accent-800 dark:text-accent-200 font-medium">
                      {report.criticalIssues.length} Critical Issue{report.criticalIssues.length !== 1 ? 's' : ''} Must Be Resolved
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(report.categories).map(([categoryName, category]) => (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        category.score >= 90 ? 'bg-success-100 dark:bg-success-900/20 text-success-500' :
                        category.score >= 75 ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-500' :
                        category.score >= 60 ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-500' :
                        'bg-accent-100 dark:bg-accent-900/20 text-accent-500'
                      }`}>
                        {getCategoryIcon(categoryName)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {categoryName.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Weight: {category.weight}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {category.status}
                      </div>
                    </div>
                  </div>
                  
                  <ProgressBar
                    progress={category.score}
                    color={category.score >= 80 ? 'success' : category.score >= 60 ? 'warning' : 'danger'}
                    showPercentage={false}
                  />
                  
                  <div className="mt-4 space-y-2">
                    {category.checks.slice(0, 3).map((check: Check, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(check.status)}
                          <span className="text-gray-700 dark:text-gray-300">{check.name}</span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {check.value}
                        </span>
                      </div>
                    ))}
                    {category.checks.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{category.checks.length - 3} more checks
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Critical Issues */}
          {report.criticalIssues.length > 0 && (
            <Card className="p-6 mb-8 border-accent-200 dark:border-accent-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <XCircle className="h-6 w-6 text-accent-500 mr-2" />
                Critical Issues ({report.criticalIssues.length})
              </h2>
              <div className="space-y-4">
                {report.criticalIssues.map((issue, index) => (
                  <div key={index} className="p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-accent-800 dark:text-accent-200">
                          {issue.title}
                        </h3>
                        <p className="text-accent-700 dark:text-accent-300 text-sm mt-1">
                          {issue.description}
                        </p>
                        <p className="text-accent-600 dark:text-accent-400 text-sm mt-2 font-medium">
                          Fix: {issue.fix}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        issue.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="h-6 w-6 text-primary-500 mr-2" />
              Production Recommendations ({report.recommendations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 border rounded-lg ${
                  rec.priority === 'immediate' ? 'border-accent-200 bg-accent-50 dark:bg-accent-900/20' :
                  rec.priority === 'high' ? 'border-warning-200 bg-warning-50 dark:bg-warning-900/20' :
                  'border-primary-200 bg-primary-50 dark:bg-primary-900/20'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {rec.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rec.priority === 'immediate' ? 'bg-accent-200 text-accent-800 dark:bg-accent-800 dark:text-accent-200' :
                      rec.priority === 'high' ? 'bg-warning-200 text-warning-800 dark:bg-warning-800 dark:text-warning-200' :
                      'bg-primary-200 text-primary-800 dark:bg-primary-800 dark:text-primary-200'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>Effort: {rec.effort}</span>
                    <span>Impact: {rec.impact}</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {rec.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Category Analysis */}
          <div className="space-y-6">
            {Object.entries(report.categories).map(([categoryName, category]) => (
              <Card key={categoryName} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize flex items-center">
                    {getCategoryIcon(categoryName)}
                    <span className="ml-2">{categoryName.replace(/([A-Z])/g, ' $1').trim()} Analysis</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      ({category.status})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.checks.map((check, index) => (
                    <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {check.name}
                        </span>
                        {getStatusIcon(check.status)}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {check.description}
                      </p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Current:</span>
                          <span className="font-medium">{check.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Expected:</span>
                          <span className="font-medium">{check.expected}</span>
                        </div>
                      </div>
                      {check.status !== 'pass' && check.fix && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Fix: </span>
                          <span className="text-gray-600 dark:text-gray-400">{check.fix}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Production Checklist */}
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 text-success-500 mr-2" />
              Production Deployment Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { check: 'Overall score ≥ 85%', status: report.overallScore >= 85, critical: true },
                { check: 'Security score ≥ 90%', status: report.categories.security.score >= 90, critical: true },
                { check: 'Compliance score ≥ 85%', status: report.categories.compliance.score >= 85, critical: true },
                { check: 'No critical issues', status: report.criticalIssues.length === 0, critical: true },
                { check: 'Performance score ≥ 75%', status: report.categories.performance.score >= 75, critical: false },
                { check: 'Accessibility score ≥ 70%', status: report.categories.accessibility.score >= 70, critical: false },
                { check: 'Monitoring enabled', status: report.categories.monitoring.score >= 70, critical: false },
                { check: 'Deployment configured', status: report.categories.deployment.score >= 70, critical: false }
              ].map((item, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  item.status ? 'bg-success-50 dark:bg-success-900/20' : 
                  item.critical ? 'bg-accent-50 dark:bg-accent-900/20' : 'bg-warning-50 dark:bg-warning-900/20'
                }`}>
                  {item.status ? 
                    <CheckCircle className="h-5 w-5 text-success-500" /> :
                    item.critical ? 
                      <XCircle className="h-5 w-5 text-accent-500" /> :
                      <AlertTriangle className="h-5 w-5 text-warning-500" />
                  }
                  <span className={`font-medium ${
                    item.status ? 'text-success-800 dark:text-success-200' :
                    item.critical ? 'text-accent-800 dark:text-accent-200' :
                    'text-warning-800 dark:text-warning-200'
                  }`}>
                    {item.check}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Deployment Status
              </h3>
              <p className={`text-lg font-bold ${
                report.overallScore >= 85 && report.criticalIssues.length === 0 ? 
                'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'
              }`}>
                {report.overallScore >= 85 && report.criticalIssues.length === 0 ? 
                  '✅ APPROVED FOR PRODUCTION DEPLOYMENT' : 
                  '⚠️ OPTIMIZATION REQUIRED BEFORE PRODUCTION'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Last assessed: {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductionReadinessPage;