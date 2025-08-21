import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Shield,
  Eye,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { systemHealthManager } from '../../utils/systemHealthManager';

interface SystemStatusIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showInProduction?: boolean;
  autoHide?: boolean;
  hideAfter?: number;
}

const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  position = 'top-right',
  showInProduction = false,
  autoHide = false,
  hideAfter = 10000
}) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [trend, setTrend] = useState<any>(null);

  const shouldShow = !import.meta.env.PROD || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    const checkHealth = async () => {
      try {
        const health = await systemHealthManager.performHealthCheck();
        const healthTrend = systemHealthManager.getHealthTrend();
        setHealthData(health);
        setTrend(healthTrend);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute

    if (autoHide) {
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, hideAfter);
      return () => {
        clearInterval(interval);
        clearTimeout(hideTimeout);
      };
    }

    return () => clearInterval(interval);
  }, [shouldShow, autoHide, hideAfter]);

  const getPositionClasses = () => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };
    return positions[position];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-success-500" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-primary-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-warning-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-accent-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trendType: string) => {
    switch (trendType) {
      case 'improving': return <TrendingUp className="h-3 w-3 text-success-500" />;
      case 'declining': return <TrendingDown className="h-3 w-3 text-accent-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-success-500';
      case 'good': return 'bg-primary-500';
      case 'degraded': return 'bg-warning-500';
      case 'critical': return 'bg-accent-500';
      default: return 'bg-gray-500';
    }
  };

  if (!shouldShow || !isVisible || !healthData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed ${getPositionClasses()} z-50`}
      >
        <div className="group relative">
          {/* Status Indicator */}
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all">
            <div className="flex items-center space-x-2">
              {getStatusIcon(healthData.overall)}
              <div className={`w-2 h-2 rounded-full ${getStatusColor(healthData.overall)} animate-pulse`} />
              {trend && getTrendIcon(trend.trend)}
            </div>
          </div>

          {/* Tooltip on Hover */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
              <div className="font-medium">System Health: {healthData.score}%</div>
              <div className="text-gray-300">Status: {healthData.overall}</div>
              {trend && (
                <div className="text-gray-300">
                  Trend: {trend.trend} ({trend.confidence}%)
                </div>
              )}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>

          {/* Detailed Status on Click */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    System Status
                  </h4>
                  <span className={`text-lg font-bold ${
                    healthData.score >= 90 ? 'text-success-500' :
                    healthData.score >= 75 ? 'text-primary-500' :
                    healthData.score >= 50 ? 'text-warning-500' : 'text-accent-500'
                  }`}>
                    {healthData.score}%
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-primary-500" />
                      Performance
                    </span>
                    <span className={healthData.checks.performance.score >= 80 ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.checks.performance.score}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="h-3 w-3 mr-1 text-primary-500" />
                      Security
                    </span>
                    <span className={healthData.checks.security.score >= 80 ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.checks.security.score}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1 text-primary-500" />
                      Accessibility
                    </span>
                    <span className={healthData.checks.accessibility.score >= 80 ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.checks.accessibility.score}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Settings className="h-3 w-3 mr-1 text-primary-500" />
                      Compliance
                    </span>
                    <span className={healthData.checks.compliance.score >= 80 ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.checks.compliance.score}%
                    </span>
                  </div>
                </div>

                {/* Critical Issues */}
                {healthData.recommendations.filter((r: any) => r.priority === 'critical').length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-accent-600 dark:text-accent-400 mb-1">
                      Critical Issues ({healthData.recommendations.filter((r: any) => r.priority === 'critical').length})
                    </div>
                    <div className="space-y-1">
                      {healthData.recommendations
                        .filter((r: any) => r.priority === 'critical')
                        .slice(0, 2)
                        .map((rec: any, index: number) => (
                          <div key={index} className="text-xs text-gray-600 dark:text-gray-300">
                            • {rec.title}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(healthData.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SystemStatusIndicator;