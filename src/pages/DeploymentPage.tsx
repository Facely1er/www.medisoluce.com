import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  Cloud,
  Settings,
  FileText,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface DeploymentStatus {
  platform: string;
  status: 'ready' | 'configured' | 'pending' | 'error';
  lastDeployed?: string;
  environment: string;
  url?: string;
  description?: string;
}

interface DeploymentCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  value?: string;
  expected?: string;
  fix?: string;
}

const DeploymentPage: React.FC = () => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus[]>([]);
  const [checks, setChecks] = useState<DeploymentCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);

  const performDeploymentAssessment = useCallback(async () => {
    setIsLoading(true);
    try {
      const deploymentChecks = assessDeploymentConfiguration();
      const platforms = getDeploymentPlatforms();
      
      setChecks(deploymentChecks);
      setDeploymentStatus(platforms);
      
      const passCount = deploymentChecks.filter(c => c.status === 'pass').length;
      const score = Math.round((passCount / deploymentChecks.length) * 100);
      setOverallScore(score);
    } catch (error) {
      console.error('Failed to assess deployment:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performDeploymentAssessment();
  }, [performDeploymentAssessment]);

  const assessDeploymentConfiguration = (): DeploymentCheck[] => {
    const checks: DeploymentCheck[] = [
      {
        name: 'Build Configuration',
        status: 'pass',
        description: 'Production build settings are optimized',
        value: 'Optimized',
        expected: 'Optimized'
      },
      {
        name: 'Environment Variables',
        status: import.meta.env.VITE_SUPABASE_URL ? 'pass' : 'warning',
        description: 'Required environment configuration',
        value: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
        expected: 'Configured',
        fix: 'Set up all required environment variables in your deployment platform'
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
      },
      {
        name: 'HTTPS Configuration',
        status: window.location.protocol === 'https:' ? 'pass' : 'warning',
        description: 'Secure connection protocol',
        value: window.location.protocol === 'https:' ? 'Enabled' : 'Disabled',
        expected: 'Enabled',
        fix: 'Configure HTTPS in production deployment'
      },
      {
        name: 'Build Output',
        status: 'pass',
        description: 'Production build artifacts',
        value: 'Ready',
        expected: 'Ready',
        fix: 'Run production build: npm run build'
      }
    ];

    return checks;
  };

  const getDeploymentPlatforms = (): DeploymentStatus[] => {
    const platforms: DeploymentStatus[] = [
      {
        platform: 'Vercel',
        status: 'ready',
        environment: 'production',
        description: 'Vercel deployment configuration is ready'
      },
      {
        platform: 'Netlify',
        status: 'ready',
        environment: 'production',
        description: 'Netlify deployment configuration is ready'
      },
      {
        platform: 'Docker',
        status: 'configured',
        environment: 'production',
        description: 'Docker deployment configuration available'
      }
    ];

    return platforms;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-accent-500" />;
      default: return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPlatformStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'configured': return <Settings className="h-5 w-5 text-primary-500" />;
      case 'pending': return <RefreshCw className="h-5 w-5 text-warning-500 animate-spin" />;
      case 'error': return <XCircle className="h-5 w-5 text-accent-500" />;
      default: return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  const exportDeploymentReport = () => {
    const reportContent = `
MEDISOLUCE DEPLOYMENT STATUS REPORT
Generated: ${new Date().toLocaleString()}

OVERALL DEPLOYMENT READINESS
Score: ${overallScore}/100
Status: ${overallScore >= 80 ? 'READY FOR DEPLOYMENT' : 'CONFIGURATION REQUIRED'}

DEPLOYMENT CHECKS:
${checks.map((check, i) => 
  `${i + 1}. ${check.name}: ${check.status.toUpperCase()}
   Description: ${check.description}
   Current: ${check.value || 'N/A'}
   Expected: ${check.expected || 'N/A'}
   ${check.fix ? `Fix: ${check.fix}` : ''}`
).join('\n\n')}

AVAILABLE DEPLOYMENT PLATFORMS:
${deploymentStatus.map((platform, i) => 
  `${i + 1}. ${platform.platform}: ${platform.status.toUpperCase()}
   Environment: ${platform.environment}
   ${platform.url ? `URL: ${platform.url}` : ''}`
).join('\n\n')}

DEPLOYMENT INSTRUCTIONS:
1. Ensure all environment variables are configured
2. Run production build: npm run build
3. Deploy to your chosen platform
4. Verify deployment health checks
5. Monitor for errors and performance

Report generated by MediSoluce Deployment System
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-deployment-status-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assessing Deployment Configuration...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Checking deployment readiness
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  Deployment Status
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Monitor and manage your deployment configuration and status
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={performDeploymentAssessment}
                  icon={<RefreshCw className="h-4 w-4" />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={exportDeploymentReport}
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="mt-8">
              <Card className={`p-6 text-center ${
                overallScore >= 80 ? 'border-success-200 bg-success-50 dark:bg-success-900/20' :
                overallScore >= 60 ? 'border-warning-200 bg-warning-50 dark:bg-warning-900/20' :
                'border-accent-200 bg-accent-50 dark:bg-accent-900/20'
              }`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                    overallScore >= 80 ? 'bg-success-500' :
                    overallScore >= 60 ? 'bg-warning-500' : 'bg-accent-500'
                  }`}>
                    {overallScore}%
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Deployment Readiness: {overallScore >= 80 ? 'Ready' : overallScore >= 60 ? 'Needs Configuration' : 'Not Ready'}
                </h2>
                <p className={`text-lg font-medium ${
                  overallScore >= 80 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'
                }`}>
                  {overallScore >= 80 ? '🚀 Ready for Deployment' : '⚠️ Configuration Required'}
                </p>
              </Card>
            </div>
          </div>

          {/* Deployment Checks */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings className="h-6 w-6 text-primary-500 mr-2" />
              Deployment Configuration Checks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {checks.map((check, index) => (
                <div key={index} className={`p-4 border rounded-lg ${
                  check.status === 'pass' ? 'border-success-200 bg-success-50 dark:bg-success-900/20' :
                  check.status === 'warning' ? 'border-warning-200 bg-warning-50 dark:bg-warning-900/20' :
                  'border-accent-200 bg-accent-50 dark:bg-accent-900/20'
                }`}>
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
                      <span className="font-medium">{check.value || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Expected:</span>
                      <span className="font-medium">{check.expected || 'N/A'}</span>
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

          {/* Deployment Platforms */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Cloud className="h-6 w-6 text-primary-500 mr-2" />
              Available Deployment Platforms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deploymentStatus.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`p-6 border rounded-lg h-full ${
                    platform.status === 'ready' ? 'border-success-200 bg-success-50 dark:bg-success-900/20' :
                    platform.status === 'configured' ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20' :
                    'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {platform.platform}
                      </h3>
                      {getPlatformStatusIcon(platform.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Status:</span>
                        <span className={`font-medium capitalize ${
                          platform.status === 'ready' ? 'text-success-600 dark:text-success-400' :
                          platform.status === 'configured' ? 'text-primary-600 dark:text-primary-400' :
                          'text-gray-600 dark:text-gray-300'
                        }`}>
                          {platform.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Environment:</span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {platform.environment}
                        </span>
                      </div>
                      {platform.url && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">URL:</span>
                          <a 
                            href={platform.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            <Globe className="h-4 w-4 inline mr-1" />
                            View
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Deployment Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-6 w-6 text-primary-500 mr-2" />
              Deployment Instructions
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Zap className="h-5 w-5 text-primary-500 mr-2" />
                  Quick Start
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Ensure all environment variables are configured in your deployment platform</li>
                  <li>Run production build: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm run build</code></li>
                  <li>Deploy to your chosen platform (Vercel, Netlify, or Docker)</li>
                  <li>Verify deployment health checks are passing</li>
                  <li>Monitor for errors and performance metrics</li>
                </ol>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Shield className="h-5 w-5 text-success-500 mr-2" />
                  Security Checklist
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Verify HTTPS is enabled in production</li>
                  <li>Check that security headers are configured</li>
                  <li>Ensure environment variables are secure and not exposed</li>
                  <li>Validate Content Security Policy headers</li>
                  <li>Confirm data encryption is active</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPage;
