import React from 'react';
  import { 
    AlertTriangle, 
    TrendingUp, 
    TrendingDown, 
    Activity,
    Shield,
    Building2,
    Clock
  } from 'lucide-react';
import Card from '../ui/Card';
import { ThreatTrend } from '../../utils/ransomwareAnalyzer';

interface ThreatStatsWidgetProps {
  stats: {
    totalThreats: number;
    healthcareBreaches: number;
    criticalThreats: number;
    highThreats: number;
    mediumThreats: number;
    lowThreats: number;
    last24Hours: number;
    last7Days: number;
  };
  trend?: ThreatTrend;
}

const ThreatStatsWidget: React.FC<ThreatStatsWidgetProps> = ({ stats, trend }) => {
  const trendIcon = trend?.trend === 'increasing' 
    ? <TrendingUp className="h-4 w-4 text-accent-500" />
    : <TrendingDown className="h-4 w-4 text-success-500" />;

  const trendColor = trend?.trend === 'increasing' ? 'text-accent-600 dark:text-accent-400' : 'text-success-600 dark:text-success-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Threats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Activity className="h-8 w-8 text-primary-500" />
          {trend && (
            <div className={`flex items-center space-x-1 ${trendColor}`}>
              {trendIcon}
              <span className="text-xs font-medium">{trend.trend}</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Total Threats
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.totalThreats}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          Last 7 days
        </p>
      </Card>

      {/* Healthcare Breaches */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
            <Building2 className="h-8 w-8 text-accent-500" />
          {stats.healthcareBreaches > 5 && (
            <AlertTriangle className="h-5 w-5 text-accent-600 dark:text-accent-400" />
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Healthcare Breaches
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.healthcareBreaches}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          Industry-specific
        </p>
      </Card>

      {/* Critical Threats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
            CRITICAL
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Critical Threats
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.criticalThreats}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          Immediate action
        </p>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Clock className="h-8 w-8 text-primary-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Last 24 Hours
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.last24Hours}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          New threats
        </p>
      </Card>

      {/* Threat Distribution */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Threat Severity Distribution
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-accent-500" />
              <span className="text-sm text-gray-900 dark:text-white">Critical</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {stats.criticalThreats}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-900 dark:text-white">High</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {stats.highThreats}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-900 dark:text-white">Medium</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {stats.mediumThreats}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">Low</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {stats.lowThreats}
            </span>
          </div>
        </div>
      </Card>

      {/* Trend Analysis */}
      {trend && (
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Threat Trend Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900 dark:text-white">Trend</span>
              <div className={`flex items-center space-x-1 ${trendColor}`}>
                {trendIcon}
                <span className="text-sm font-semibold capitalize">{trend.trend}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900 dark:text-white">Time Range</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {trend.timeRange}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900 dark:text-white">Total Threats</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {trend.totalThreats}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900 dark:text-white">Critical</span>
              <span className="text-sm font-semibold text-accent-600 dark:text-accent-400">
                {trend.criticalThreats}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900 dark:text-white">Healthcare</span>
              <span className="text-sm font-semibold text-accent-600 dark:text-accent-400">
                {trend.healthcareBreaches}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* High Priority Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <AlertTriangle className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          High Priority Threats
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.criticalThreats + stats.highThreats}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          Requires attention
        </p>
      </Card>

      {/* Medium Threats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Shield className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Medium Priority
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.mediumThreats}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          Monitor closely
        </p>
      </Card>
    </div>
  );
};

export default ThreatStatsWidget;

