import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Zap, Shield, CheckCircle, AlertTriangle, XCircle, Play, Pause, Download, RefreshCw, Wrench, Clock, Eye, Bug } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { projectHealthEnhancer } from '../../utils/healthEnhancer';
import { performanceEnhancer } from '../../utils/performanceEnhancer';
import { robustErrorHandler } from '../../utils/robustErrorHandler';

interface HealthEnhancementDashboardProps {
  autoEnhance?: boolean;
  showInProduction?: boolean;
  position?: 'full' | 'compact' | 'minimal';
}

const HealthEnhancementDashboard: React.FC<HealthEnhancementDashboardProps> = ({
  autoEnhance = true,
  showInProduction = false,
  position = 'full'
}) => {
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    score: number;
    issues: Array<{ severity: string; message: string }>;
    performance: Record<string, unknown>;
    errorRecovery: Record<string, unknown>;
  } | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(autoEnhance);
  const [lastEnhancement, setLastEnhancement] = useState<Date | null>(null);
  const [enhancementHistory, setEnhancementHistory] = useState<Array<{
    health: unknown;
    performance: unknown;
    timestamp: Date;
  }>>([]);

  const shouldShow = !import.meta.env.PROD || showInProduction;

  const loadHealthStatus = useCallback(async () => {
    try {
      const status = projectHealthEnhancer.getHealthStatus();
      const issues = await projectHealthEnhancer.runHealthAudit();
      const performanceReport = performanceEnhancer.getPerformanceReport();
      const errorStats = robustErrorHandler.getErrorRecoveryStats();

      setHealthStatus({
        ...status,
        issues,
        performance: performanceReport,
        errorRecovery: errorStats
      });

      // Auto-enhance if issues detected and auto-enhance is enabled
      if (autoEnhance && issues.length > 0 && !isEnhancing) {
        const criticalIssues = issues.filter((issue) => issue.severity === 'critical');
        if (criticalIssues.length > 0) {
          await performEnhancement();
        }
      }
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  }, [autoEnhance, isEnhancing, performEnhancement]);

  useEffect(() => {
    if (!shouldShow) return;

    loadHealthStatus();

    if (isMonitoring) {
      const interval = setInterval(loadHealthStatus, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [shouldShow, isMonitoring, loadHealthStatus]);

  const performEnhancement = useCallback(async () => {
    setIsEnhancing(true);
    try {
      if (!import.meta.env.PROD) {
        console.log('Starting health enhancement...');
      }
      
      // Run all enhancements
      const [healthResult, performanceResult] = await Promise.allSettled([
        projectHealthEnhancer.enhanceProjectHealth(),
        performanceEnhancer.enhancePerformance()
      ]);

      const results = {
        health: healthResult.status === 'fulfilled' ? healthResult.value : null,
        performance: performanceResult.status === 'fulfilled' ? performanceResult.value : null,
        timestamp: new Date()
      };

      setEnhancementHistory(prev => [...prev, results].slice(-10));
      setLastEnhancement(new Date());
      
      // Refresh health status
      await loadHealthStatus();
      
      if (typeof window !== 'undefined' && (window as Window & { showToast?: (toast: { type: string; title: string; message: string }) => void }).showToast) {
        (window as Window & { showToast: (toast: { type: string; title: string; message: string }) => void }).showToast({
          type: 'success',
          title: 'Health Enhancement Complete',
          message: 'Project health has been optimized successfully',
          duration: 8000
        });
      }
    } catch (error) {
      console.error('Health enhancement failed:', error);
      
      if (typeof window !== 'undefined' && (window as Window & { showToast?: (toast: { type: string; title: string; message: string; duration: number }) => void }).showToast) {
        (window as Window & { showToast: (toast: { type: string; title: string; message: string; duration: number }) => void }).showToast({
          type: 'error',
          title: 'Enhancement Failed',
          message: 'Unable to complete health enhancement',
          duration: 5000
        });
      }
    } finally {
      setIsEnhancing(false);
    }
  }, [loadHealthStatus]);

  const exportHealthReport = () => {
    const report = `
MEDISOLUCE PROJECT HEALTH REPORT
Generated: ${new Date().toLocaleString()}

CURRENT HEALTH STATUS:
${healthStatus ? `
- Performance: ${healthStatus.currentHealth.performance}
- Security: ${healthStatus.currentHealth.security}  
- Accessibility: ${healthStatus.currentHealth.accessibility}
- Issues Found: ${healthStatus.issues.length}
- Error Recovery Rate: ${healthStatus.errorRecovery.recoveryRate}%
` : 'No data available'}

PERFORMANCE METRICS:
${healthStatus?.performance ? `
- Current Load Time: ${healthStatus.performance.currentMetrics.loadTime}ms
- Memory Usage: ${healthStatus.performance.currentMetrics.memoryUsage}%
- Bundle Size: ${healthStatus.performance.currentMetrics.bundleSize}KB
- Optimizations Applied: ${healthStatus.performance.optimizationsApplied.join(', ')}
` : 'No performance data'}

ERROR RECOVERY STATISTICS:
${healthStatus?.errorRecovery ? `
- Total Errors: ${healthStatus.errorRecovery.totalErrors}
- Recovered Errors: ${healthStatus.errorRecovery.recoveredErrors}
- Recovery Rate: ${healthStatus.errorRecovery.recoveryRate}%
- Active Graceful Modes: ${healthStatus.errorRecovery.gracefulModes.join(', ') || 'None'}
` : 'No error recovery data'}

RECENT ENHANCEMENTS:
${enhancementHistory.slice(-3).map(result => 
  `- ${result.timestamp.toLocaleString()}: Health improved, Performance optimized`
).join('\n') || 'No recent enhancements'}

Generated by MediSoluce Health Enhancement Dashboard
`;

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

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'needs-attention': return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-accent-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'border-success-200 bg-success-50 dark:bg-success-900/20';
      case 'needs-attention': return 'border-warning-200 bg-warning-50 dark:bg-warning-900/20';
      case 'critical': return 'border-accent-200 bg-accent-50 dark:bg-accent-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-700';
    }
  };

  if (!shouldShow) return null;

  if (position === 'minimal') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Wrench className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Health: {healthStatus?.issues?.length || 0} issues
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={performEnhancement}
              disabled={isEnhancing}
              icon={isEnhancing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            >
              {isEnhancing ? 'Fixing...' : 'Fix'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (position === 'compact') {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary-500" />
            Project Health
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMonitoring(!isMonitoring)}
              icon={isMonitoring ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            >
              {isMonitoring ? 'Pause' : 'Monitor'}
            </Button>
            <Button
              size="sm"
              onClick={performEnhancement}
              disabled={isEnhancing}
              icon={isEnhancing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            >
              Enhance
            </Button>
          </div>
        </div>

        {healthStatus && (
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded border ${getHealthColor(healthStatus.currentHealth.performance)}`}>
              <div className="flex items-center justify-between">
                <Zap className="h-4 w-4 text-primary-500" />
                {getHealthIcon(healthStatus.currentHealth.performance)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Performance</div>
            </div>

            <div className={`p-3 rounded border ${getHealthColor(healthStatus.currentHealth.security)}`}>
              <div className="flex items-center justify-between">
                <Shield className="h-4 w-4 text-primary-500" />
                {getHealthIcon(healthStatus.currentHealth.security)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Security</div>
            </div>

            <div className={`p-3 rounded border ${getHealthColor(healthStatus.currentHealth.accessibility)}`}>
              <div className="flex items-center justify-between">
                <Eye className="h-4 w-4 text-primary-500" />
                {getHealthIcon(healthStatus.currentHealth.accessibility)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Accessibility</div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Full dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Project Health Enhancement
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive health monitoring and automatic optimization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadHealthStatus}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          <Button
            onClick={performEnhancement}
            disabled={isEnhancing}
            icon={isEnhancing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
          >
            {isEnhancing ? 'Enhancing...' : 'Enhance Health'}
          </Button>
          <Button
            variant="outline"
            onClick={exportHealthReport}
            icon={<Download className="h-4 w-4" />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Health Overview */}
      {healthStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-8 w-8 text-primary-500" />
              {getHealthIcon(healthStatus.currentHealth.performance)}
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Performance Health
            </h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {healthStatus.currentHealth.performance}
            </p>
            {healthStatus.performance?.currentMetrics && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Load: {healthStatus.performance.currentMetrics.loadTime}ms
              </p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-8 w-8 text-secondary-500" />
              {getHealthIcon(healthStatus.currentHealth.security)}
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Security Health
            </h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {healthStatus.currentHealth.security}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Recovery: {healthStatus.errorRecovery?.recoveryRate || 0}%
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-accent-500" />
              {getHealthIcon(healthStatus.currentHealth.accessibility)}
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Accessibility Health
            </h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {healthStatus.currentHealth.accessibility}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Compliance ready
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Bug className="h-8 w-8 text-warning-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {healthStatus.issues?.length || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Issues Detected
            </h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {healthStatus.issues?.filter((i: { autoFixable?: boolean }) => i.autoFixable).length || 0} Auto-fixable
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {healthStatus.issues?.filter((i: { severity: string }) => i.severity === 'critical').length || 0} Critical
            </p>
          </Card>
        </div>
      )}

      {/* Issues and Fixes */}
      {healthStatus?.issues && healthStatus.issues.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-warning-500" />
            Detected Issues ({healthStatus.issues.length})
          </h3>
          <div className="space-y-3">
            {healthStatus.issues.map((issue: { id: string; message: string; severity: string; autoFixable?: boolean }) => (
              <div key={issue.id} className={`p-4 border rounded-lg ${
                issue.severity === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                issue.severity === 'high' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20' :
                issue.severity === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        issue.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                        issue.severity === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {issue.category}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {issue.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {issue.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Impact: {issue.impact}
                    </p>
                  </div>
                  {issue.autoFixable && (
                    <div className="flex-shrink-0 ml-4">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto-fixable
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Enhancement History */}
      {enhancementHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-500" />
            Enhancement History
          </h3>
          <div className="space-y-3">
            {enhancementHistory.slice(-5).map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Enhancement completed
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {result.timestamp.toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-xs">
                  {result.health && (
                    <div className="text-success-600 dark:text-success-400">
                      Fixed {result.health.issuesFixed}/{result.health.issuesFound} issues
                    </div>
                  )}
                  {result.performance && (
                    <div className="text-primary-600 dark:text-primary-400">
                      Performance improved
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Health Enhancement Controls
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Auto-monitoring:</span>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  isMonitoring ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isMonitoring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {lastEnhancement && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last enhanced: {lastEnhancement.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportHealthReport}
              icon={<Download className="h-3 w-3" />}
            >
              Export
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HealthEnhancementDashboard;