import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  Zap,
  Shield,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  FileCheck,
  Target
} from 'lucide-react';

interface HealthIndicatorProps {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  trend: number;
  checks: any[];
  compact?: boolean;
  showTrend?: boolean;
  showDetails?: boolean;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({
  category,
  score,
  status,
  trend,
  checks,
  compact = false,
  showTrend = true,
  showDetails = false
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'accessibility': return <Eye className="h-5 w-5" />;
      case 'compliance': return <FileCheck className="h-5 w-5" />;
      case 'userExperience': return <Users className="h-5 w-5" />;
      case 'dataIntegrity': return <Activity className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success-500 bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800';
      case 'good': return 'text-primary-500 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800';
      case 'fair': return 'text-warning-500 bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800';
      case 'poor': return 'text-accent-500 bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800';
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 75) return 'text-primary-500';
    if (score >= 50) return 'text-warning-500';
    return 'text-accent-500';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 2) return <TrendingUp className="h-3 w-3 text-success-500" />;
    if (trend < -2) return <TrendingDown className="h-3 w-3 text-accent-500" />;
    return <Target className="h-3 w-3 text-gray-500" />;
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-3 w-3 text-success-500" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 text-warning-500" />;
      case 'fail': return <XCircle className="h-3 w-3 text-accent-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon(category)}
            <span className="text-sm font-medium capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-lg font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
            {showTrend && getTrendIcon(trend)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${getStatusColor(status)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getIcon(category)}
          <h3 className="text-base font-medium capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
          {showTrend && (
            <div className="flex items-center space-x-1">
              {getTrendIcon(trend)}
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium capitalize">{status}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {checks.filter(c => c.status === 'pass').length}/{checks.length} checks passed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-2 rounded-full ${
            score >= 90 ? 'bg-success-500' :
            score >= 75 ? 'bg-primary-500' :
            score >= 50 ? 'bg-warning-500' : 'bg-accent-500'
          }`}
        />
      </div>

      {/* Detailed Checks */}
      {showDetails && (
        <div className="space-y-1">
          {checks.slice(0, 3).map((check, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {getCheckIcon(check.status)}
                <span className="text-gray-700 dark:text-gray-300">{check.name}</span>
              </div>
              <span className={`font-medium ${
                check.status === 'pass' ? 'text-success-500' :
                check.status === 'warning' ? 'text-warning-500' : 'text-accent-500'
              }`}>
                {Math.round(check.value)}
                {check.name.includes('Rate') || check.name.includes('Coverage') || check.name.includes('Usage') ? '%' : 
                 check.name.includes('Time') ? 'ms' : ''}
              </span>
            </div>
          ))}
          {checks.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
              +{checks.length - 3} more checks
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

interface HealthOverviewProps {
  healthData: any;
  showActions?: boolean;
  onOptimize?: () => void;
  onExport?: () => void;
}

export const HealthOverview: React.FC<HealthOverviewProps> = ({
  healthData,
  showActions = true,
  onOptimize,
  onExport
}) => {
  if (!healthData) return null;

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <div className="flex justify-center mb-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            healthData.overall.score >= 90 ? 'bg-success-500' :
            healthData.overall.score >= 75 ? 'bg-primary-500' :
            healthData.overall.score >= 50 ? 'bg-warning-500' : 'bg-accent-500'
          }`}>
            <span className="text-2xl font-bold text-white">
              {healthData.overall.score}%
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Overall Health: {healthData.overall.status.charAt(0).toUpperCase() + healthData.overall.status.slice(1)}
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <span>Trend:</span>
          <div className="flex items-center space-x-1">
            {healthData.overall.trend === 'improving' ? 
              <TrendingUp className="h-4 w-4 text-success-500" /> :
              healthData.overall.trend === 'declining' ?
              <TrendingDown className="h-4 w-4 text-accent-500" /> :
              <Target className="h-4 w-4 text-gray-500" />
            }
            <span className="capitalize">{healthData.overall.trend}</span>
            <span className="text-gray-500">({healthData.overall.confidence}%)</span>
          </div>
        </div>
      </div>

      {/* Category Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(healthData.categories).map(([category, data]: [string, any]) => (
          <HealthIndicator
            key={category}
            category={category}
            score={data.score}
            status={data.status}
            trend={data.trend}
            checks={data.checks}
            showDetails={true}
          />
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-center space-x-4">
          {onOptimize && (
            <Button
              onClick={onOptimize}
              icon={<Zap className="h-4 w-4" />}
              disabled={healthData.overall.score > 85}
            >
              Optimize Health
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
              icon={<Download className="h-4 w-4" />}
            >
              Export Report
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthIndicator;