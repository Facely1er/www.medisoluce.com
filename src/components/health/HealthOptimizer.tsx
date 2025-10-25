import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RefreshCw,
  Download,
  Settings,
  Wrench,
  BarChart3,
  Target,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
// Dynamic imports will be used instead of static imports

interface HealthOptimizerProps {
  showInProduction?: boolean;
  autoOptimize?: boolean;
  position?: 'floating' | 'embedded';
}

const HealthOptimizer: React.FC<HealthOptimizerProps> = ({
  showInProduction = false,
  autoOptimize = true,
  position = 'floating'
}) => {
  const [healthData, setHealthData] = useState<{
    overall: {
      score: number;
      status: string;
      trend: string;
      confidence: number;
    };
    categories: Record<string, {
      score: number;
      status: string;
      trend: number;
      checks: Array<{
        name: string;
        status: 'pass' | 'warning' | 'fail' | 'pending';
        message?: string;
        timestamp?: string;
      }>;
    }>;
    recommendations: Array<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      autoImplementable: boolean;
    }>;
    autoHealingActions: Array<{
      action: string;
      success: boolean;
      timestamp: string;
    }>;
    predictiveInsights: Array<{
      insight: string;
      confidence: number;
      impact: string;
    }>;
    metrics: {
      uptime: number;
      responseTime: number;
      errorRate: number;
      satisfaction: number;
    };
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(autoOptimize);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const shouldShow = !import.meta.env.PROD || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    const performHealthCheck = async () => {
      try {
        const { comprehensiveHealthManager } = await import('../../utils/comprehensiveHealthManager');
        const health = await comprehensiveHealthManager.getHealthReport();
        setHealthData(health);
        
        // Auto-optimize if enabled and health is poor
        if (autoOptimize && health.overall.score < 70 && !isOptimizing) {
          await performOptimization();
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    performHealthCheck();

    if (isMonitoring) {
      const interval = setInterval(performHealthCheck, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [shouldShow, autoOptimize, isMonitoring, isOptimizing]);

  const performOptimization = async () => {
    setIsOptimizing(true);
    try {
      const { comprehensiveHealthManager } = await import('../../utils/comprehensiveHealthManager');
      await comprehensiveHealthManager.performEmergencyOptimization();
      setLastOptimization(new Date());
      
      // Refresh health data after optimization
      setTimeout(async () => {
        const { comprehensiveHealthManager: manager } = await import('../../utils/comprehensiveHealthManager');
        const health = await manager.getHealthReport();
        setHealthData(health);
      }, 2000);
      
      if ('showToast' in window) {
        // Only show notifications in development mode
        if (!import.meta.env.PROD) {
          (window as Window & { showToast: (options: { type: string; title: string; message: string; duration: number }) => void }).showToast({
            type: 'success',
            title: 'Optimization Complete',
            message: 'System health has been optimized',
            duration: 5000
          });
        }
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      if ('showToast' in window) {
        (window as Window & { showToast: (options: { type: string; title: string; message: string; duration: number }) => void }).showToast({
          type: 'error',
          title: 'Optimization Failed',
          message: 'Unable to complete system optimization',
          duration: 5000
        });
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const exportHealthReport = async () => {
    try {
      const { comprehensiveHealthManager } = await import('../../utils/comprehensiveHealthManager');
      const report = comprehensiveHealthManager.exportComprehensiveReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medisoluce-health-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-primary-500';
    if (score >= 50) return 'text-warning-500';
    return 'text-accent-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-primary-500" />;
      case 'fair': return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'poor': return <AlertTriangle className="h-5 w-5 text-accent-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-success-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-accent-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!shouldShow || !healthData) return null;

  const containerClasses = position === 'floating' 
    ? `fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-auto' : 'w-80'}` 
    : 'w-full';

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={containerClasses}
    >
      <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                Health Optimizer
              </span>
              {isOptimizing && <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />}
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(healthData.overall.status)}
              <span className={`text-lg font-bold ${getScoreColor(healthData.overall.score)}`}>
                {healthData.overall.score}%
              </span>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className="capitalize font-medium">{healthData.overall.status}</span>
                {getTrendIcon(healthData.overall.trend)}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title={isMonitoring ? 'Pause monitoring' : 'Resume monitoring'}
                >
                  {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Close Health Optimizer"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {!isMinimized && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className={`text-lg font-bold ${getScoreColor(healthData.categories.performance.score)}`}>
                  {healthData.categories.performance.score}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Performance</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className={`text-lg font-bold ${getScoreColor(healthData.categories.security.score)}`}>
                  {healthData.categories.security.score}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Security</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className={`text-lg font-bold ${getScoreColor(healthData.categories.accessibility.score)}`}>
                  {healthData.categories.accessibility.score}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Accessibility</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className={`text-lg font-bold ${getScoreColor(healthData.categories.compliance.score)}`}>
                  {healthData.categories.compliance.score}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Compliance</div>
              </div>
            </div>

            {/* Optimization Button */}
            <Button
              onClick={performOptimization}
              disabled={isOptimizing || healthData.overall.score > 85}
              icon={isOptimizing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              fullWidth
              variant={healthData.overall.score < 60 ? 'primary' : 'outline'}
            >
              {isOptimizing ? 'Optimizing...' : 
               healthData.overall.score > 85 ? 'System Optimized' : 'Optimize Health'}
            </Button>

            {lastOptimization && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Last optimized: {lastOptimization.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Expanded Details */}
        {!isMinimized && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {/* Detailed Health Scores */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Detailed Health Analysis
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(healthData.categories).map(([category, data]) => (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs capitalize text-gray-600 dark:text-gray-300">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`text-xs font-medium ${getScoreColor(data.score)}`}>
                              {data.score}%
                            </span>
                          </div>
                          <ProgressBar
                            progress={data.score}
                            size="sm"
                            color={data.score >= 80 ? 'success' : data.score >= 60 ? 'warning' : 'danger'}
                            showPercentage={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Recommendations */}
                  {healthData.recommendations.filter((r) => r.priority === 'critical').length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-accent-500" />
                        Critical Issues
                      </h4>
                      <div className="space-y-2">
                        {healthData.recommendations
                          .filter((r) => r.priority === 'critical')
                          .slice(0, 3)
                          .map((rec, index: number) => (
                            <div key={index} className="text-xs p-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded">
                              <div className="font-medium text-accent-800 dark:text-accent-200">
                                {rec.title}
                              </div>
                              <div className="text-accent-700 dark:text-accent-300">
                                {rec.description}
                              </div>
                              {rec.autoImplementable && (
                                <div className="text-accent-600 dark:text-accent-400 mt-1">
                                  ⚡ Auto-fixable
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Auto-Healing History */}
                  {healthData.autoHealingActions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recent Optimizations
                      </h4>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {healthData.autoHealingActions.slice(-5).map((action, index: number) => (
                          <div key={index} className="text-xs flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {action.action}
                            </span>
                            <span className={action.success ? 'text-success-500' : 'text-accent-500'}>
                              {action.success ? '✓' : '✗'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Key Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span>{healthData.metrics.uptime}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response:</span>
                        <span>{healthData.metrics.responseTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Errors:</span>
                        <span className={healthData.metrics.errorRate > 5 ? 'text-accent-500' : 'text-success-500'}>
                          {healthData.metrics.errorRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction:</span>
                        <span className={getScoreColor(healthData.metrics.userSatisfaction)}>
                          {healthData.metrics.userSatisfaction}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Predictive Insights */}
                  {healthData.predictiveInsights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1 text-primary-500" />
                        Predictive Insights
                      </h4>
                      <div className="space-y-1">
                        {healthData.predictiveInsights.slice(0, 2).map((insight, index: number) => (
                          <div key={index} className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                            <div className="font-medium text-blue-800 dark:text-blue-200">
                              {insight.metric}
                            </div>
                            <div className="text-blue-700 dark:text-blue-300">
                              {insight.prediction}% likelihood in {insight.timeframe}
                            </div>
                            <div className="text-blue-600 dark:text-blue-400">
                              {insight.recommendation}
                            </div>
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
                      onClick={() => setIsMonitoring(!isMonitoring)}
                      icon={isMonitoring ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    >
                      {isMonitoring ? 'Pause' : 'Monitor'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={exportHealthReport}
                      icon={<Download className="h-3 w-3" />}
                    >
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const { comprehensiveHealthManager } = await import('../../utils/comprehensiveHealthManager');
                        const health = await comprehensiveHealthManager.getHealthReport();
                        setHealthData(health);
                      }}
                      icon={<RefreshCw className="h-3 w-3" />}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Card>
    </motion.div>
  );
};

export default HealthOptimizer;