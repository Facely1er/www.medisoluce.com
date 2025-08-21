import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  BarChart3
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { systemHealthManager } from '../../utils/systemHealthManager';

interface HealthDashboardProps {
  showInProduction?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({
  showInProduction = false,
  autoRefresh = true,
  refreshInterval = 60000
}) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const shouldShow = !import.meta.env.PROD || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    performHealthCheck();

    if (autoRefresh) {
      const interval = setInterval(performHealthCheck, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [shouldShow, autoRefresh, refreshInterval]);

  const performHealthCheck = async () => {
    setIsLoading(true);
    try {
      const health = await systemHealthManager.performHealthCheck();
      setHealthData(health);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-primary-500" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-accent-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-success-200 bg-success-50 dark:bg-success-900/20';
      case 'good': return 'border-primary-200 bg-primary-50 dark:bg-primary-900/20';
      case 'degraded': return 'border-warning-200 bg-warning-50 dark:bg-warning-900/20';
      case 'critical': return 'border-accent-200 bg-accent-50 dark:bg-accent-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-primary-500';
    if (score >= 50) return 'text-warning-500';
    return 'text-accent-500';
  };

  const exportHealthReport = () => {
    const report = systemHealthManager.exportHealthReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medisoluce-health-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!shouldShow || !healthData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 z-40 w-80"
    >
      <Card className={`border-2 ${getStatusColor(healthData.overall)}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                System Health
              </span>
              {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(healthData.overall)}
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {healthData.overall}
              </span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(healthData.score)}`}>
              {healthData.score}%
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Performance:</span>
              <span className={getScoreColor(healthData.checks.performance.score)}>
                {healthData.checks.performance.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Security:</span>
              <span className={getScoreColor(healthData.checks.security.score)}>
                {healthData.checks.security.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Accessibility:</span>
              <span className={getScoreColor(healthData.checks.accessibility.score)}>
                {healthData.checks.accessibility.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Compliance:</span>
              <span className={getScoreColor(healthData.checks.compliance.score)}>
                {healthData.checks.compliance.score}%
              </span>
            </div>
          </div>

          {lastRefresh && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last check: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Performance Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-primary-500" />
                  Performance Metrics
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Memory Usage:</span>
                    <span className={healthData.checks.performance.memoryUsage > 80 ? 'text-accent-500' : 'text-success-500'}>
                      {healthData.checks.performance.memoryUsage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Load Time:</span>
                    <span className={healthData.checks.performance.loadTime > 3000 ? 'text-warning-500' : 'text-success-500'}>
                      {healthData.checks.performance.loadTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bundle Size:</span>
                    <span className={healthData.checks.performance.bundleSize > 1000 ? 'text-warning-500' : 'text-success-500'}>
                      {healthData.checks.performance.bundleSize}KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span className={healthData.checks.performance.errorRate > 5 ? 'text-accent-500' : 'text-success-500'}>
                      {healthData.checks.performance.errorRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-primary-500" />
                  Security Status
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>HTTPS:</span>
                    <span className={healthData.checks.security.https ? 'text-success-500' : 'text-accent-500'}>
                      {healthData.checks.security.https ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CSP:</span>
                    <span className={healthData.checks.security.csp ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.checks.security.csp ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secure Storage:</span>
                    <span className={healthData.checks.security.localStorage ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.checks.security.localStorage ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerabilities:</span>
                    <span className={healthData.checks.security.vulnerabilities === 0 ? 'text-success-500' : 'text-accent-500'}>
                      {healthData.checks.security.vulnerabilities}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              {healthData.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Top Recommendations
                  </h4>
                  <div className="space-y-2">
                    {healthData.recommendations.slice(0, 3).map((rec: any, index: number) => (
                      <div key={index} className={`text-xs p-2 rounded border-l-2 ${
                        rec.priority === 'critical' ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' :
                        rec.priority === 'high' ? 'border-warning-500 bg-warning-50 dark:bg-warning-900/20' :
                        'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      }`}>
                        <div className="font-medium">{rec.title}</div>
                        <div className="text-gray-600 dark:text-gray-300">{rec.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto-fixes Applied */}
              {healthData.autoFixesApplied.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Auto-fixes Applied
                  </h4>
                  <div className="space-y-1">
                    {healthData.autoFixesApplied.map((fix: string, index: number) => (
                      <div key={index} className="text-xs text-success-600 dark:text-success-400 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {fix}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={performHealthCheck}
                  disabled={isLoading}
                  icon={<RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />}
                >
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportHealthReport}
                  icon={<Download className="h-3 w-3" />}
                >
                  Export
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default HealthDashboard;