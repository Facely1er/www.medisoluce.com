import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, XCircle, Activity, Download } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { healthChecker } from '../../utils/healthCheck';
import { securityManager } from '../../utils/securityUtils';

interface ProductionReadinessIndicatorProps {
  showInProduction?: boolean;
}

const ProductionReadinessIndicator: React.FC<ProductionReadinessIndicatorProps> = ({
  showInProduction = false
}) => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [securityReport, setSecurityReport] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development unless explicitly enabled in production
    if (import.meta.env.DEV || showInProduction) {
      setIsVisible(true);
      checkSystemStatus();
    }
  }, [showInProduction]);

  const checkSystemStatus = async () => {
    try {
      const health = await healthChecker.performHealthCheck();
      const security = securityManager.generateSecurityReport();
      
      setHealthStatus(health);
      setSecurityReport(security);
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'unhealthy': return <XCircle className="h-5 w-5 text-accent-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-success-200 bg-success-50 dark:bg-success-900/20';
      case 'degraded': return 'border-warning-200 bg-warning-50 dark:bg-warning-900/20';
      case 'unhealthy': return 'border-accent-200 bg-accent-50 dark:bg-accent-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-700';
    }
  };

  const exportDiagnosticData = () => {
    const diagnosticData = {
      healthStatus,
      securityReport,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      version: import.meta.env.VITE_APP_VERSION,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const content = JSON.stringify(diagnosticData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!isVisible || !healthStatus) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 left-4 z-40"
    >
      <Card className={`p-4 w-72 border ${getStatusColor(healthStatus.status)}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              System Status
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Overall Health:</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(healthStatus.status)}
              <div className="flex items-center">
                <span className="text-white font-medium capitalize">
                  {healthStatus.status}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Local Storage:</span>
              <span className={healthStatus.checks.localStorage ? 'text-success-500' : 'text-accent-500'}>
                {healthStatus.checks.localStorage ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className={healthStatus.checks.networkConnectivity ? 'text-success-500' : 'text-accent-500'}>
                {healthStatus.checks.networkConnectivity ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span className={healthStatus.checks.serviceWorker ? 'text-success-500' : 'text-accent-500'}>
                {healthStatus.checks.serviceWorker ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>HTTPS:</span>
              <span className={securityReport?.https ? 'text-success-500' : 'text-accent-500'}>
                {securityReport?.https ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CSP:</span>
              <span className={securityReport?.csp?.enabled ? 'text-success-500' : 'text-accent-500'}>
                {securityReport?.csp?.enabled ? '✓' : '✗'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>Load Time: {(healthStatus.performance.loadTime / 1000).toFixed(2)}s</div>
              <div>Error Rate: {(healthStatus.performance.errorRate * 100).toFixed(1)}%</div>
              <div>Version: {healthStatus.version}</div>
            </div>
          </div>

          {!import.meta.env.PROD && (
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={exportDiagnosticData}
                icon={<Download className="h-3 w-3" />}
                fullWidth
              >
                Export Diagnostics
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductionReadinessIndicator;