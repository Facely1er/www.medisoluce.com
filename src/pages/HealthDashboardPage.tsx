import React, { useState, useEffect, Suspense } from 'react';
import { 
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { HealthOverview } from '../components/health/HealthIndicators';
// Dynamic imports will be used instead of static imports
const HealthOptimizer = React.lazy(() => import('../components/health/HealthOptimizer'));
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const HealthDashboardPage: React.FC = () => {
  const [healthData, setHealthData] = useState<{
    overall: { score: number; status: string };
    categories: {
      performance: { score: number; status: string; details: string };
      security: { score: number; status: string; details: string };
      accessibility: { score: number; status: string; details: string };
      compliance: { score: number; status: string; details: string };
      userExperience: { score: number; status: string; details: string };
      dataIntegrity: { score: number; status: string; details: string };
    };
    metrics: {
      uptime: number;
      responseTime: number;
      errorRate: number;
      complianceScore: number;
    };
    recommendations: Array<{
      priority: string;
      title: string;
      description: string;
      estimatedImpact: number;
      autoImplementable: boolean;
    }>;
    autoHealingActions: Array<{
      action: string;
      impact: string;
      success: boolean;
      category: string;
      timestamp: number;
    }>;
    predictiveInsights: Array<{
      metric: string;
      prediction: number;
      timeframe: string;
      recommendation: string;
      confidence: number;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<{
    time: string;
    overall: number;
    performance: number;
    security: number;
    accessibility: number;
    compliance: number;
  }[]>([]);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadHealthData();
    loadHistoricalData();
  }, []);

  const loadHealthData = async () => {
    setIsLoading(true);
    try {
      const { comprehensiveHealthManager } = await import('../utils/comprehensiveHealthManager');
      const health = await comprehensiveHealthManager.getHealthReport();
      setHealthData(health);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoricalData = () => {
    try {
      const history = JSON.parse(localStorage.getItem('comprehensive-health-reports') || '[]');
      const chartData = history.slice(-10).map((report: Record<string, unknown>) => ({
        time: new Date(report.overall.timestamp || Date.now()).toLocaleTimeString(),
        overall: report.overall.score,
        performance: report.categories.performance.score,
        security: report.categories.security.score,
        accessibility: report.categories.accessibility.score,
        compliance: report.categories.compliance.score
      }));
      setHistoricalData(chartData);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const { comprehensiveHealthManager } = await import('../utils/comprehensiveHealthManager');
      await comprehensiveHealthManager.performEmergencyOptimization();
      await loadHealthData(); // Refresh data after optimization
      
      if ((window as Window & { showToast?: (toast: { type: string; title: string; description: string }) => void }).showToast) {
        (window as Window & { showToast: (toast: { type: string; title: string; description: string }) => void }).showToast({
          type: 'success',
          title: 'Optimization Complete',
          description: 'System health has been optimized successfully'
        });
      }
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const handleExport = async () => {
    try {
      const { comprehensiveHealthManager } = await import('../utils/comprehensiveHealthManager');
      const report = comprehensiveHealthManager.exportComprehensiveReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medisoluce-comprehensive-health-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };


  // Pie chart data for category distribution
  const categoryData = healthData ? [
    { name: 'Performance', value: healthData.categories.performance.score, fill: '#0073e6' },
    { name: 'Security', value: healthData.categories.security.score, fill: '#00b8c4' },
    { name: 'Accessibility', value: healthData.categories.accessibility.score, fill: '#dc3545' },
    { name: 'Compliance', value: healthData.categories.compliance.score, fill: '#198754' },
    { name: 'UX', value: healthData.categories.userExperience.score, fill: '#ffc107' },
    { name: 'Data', value: healthData.categories.dataIntegrity.score, fill: '#6c757d' }
  ] : [];

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Loading Health Dashboard...
              </h1>
            </div>
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
                <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  System Health Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive monitoring and optimization of system health
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={loadHealthData}
                  icon={<RefreshCw className="h-4 w-4" />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  onClick={handleOptimize}
                  disabled={optimizing || (healthData?.overall.score > 85)}
                  icon={optimizing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                >
                  {optimizing ? 'Optimizing...' : 'Optimize'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Health Alert Banner */}
            {healthData && healthData.overall.status === 'critical' && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                  <div>
                    <h3 className="text-red-800 dark:text-red-200 font-medium">
                      Critical Health Issues Detected
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Immediate optimization recommended to restore system health.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {healthData && (
            <>
              {/* Overall Health Overview */}
              <div className="mb-8">
                <HealthOverview
                  healthData={healthData}
                  showActions={false}
                />
              </div>

              {/* Health Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-8 w-8 text-primary-500" />
                    <TrendingUp className="h-5 w-5 text-success-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    System Uptime
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData.metrics.uptime}m
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Since last restart
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="h-8 w-8 text-warning-500" />
                    <span className={healthData.metrics.responseTime < 1000 ? 'text-success-500' : 'text-warning-500'}>
                      {healthData.metrics.responseTime < 1000 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Response Time
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData.metrics.responseTime}ms
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Average load time
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="h-8 w-8 text-accent-500" />
                    <span className={healthData.metrics.errorRate < 2 ? 'text-success-500' : 'text-accent-500'}>
                      {healthData.metrics.errorRate < 2 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Error Rate
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData.metrics.errorRate}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Last hour
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="h-8 w-8 text-success-500" />
                    <TrendingUp className="h-5 w-5 text-success-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Compliance Score
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData.metrics.complianceScore}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    HIPAA & Privacy
                  </p>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Health Trend Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Health Trend Analysis
                  </h3>
                  {historicalData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="overall" stroke="#0073e6" strokeWidth={2} name="Overall" />
                          <Line type="monotone" dataKey="performance" stroke="#00b8c4" strokeWidth={1} name="Performance" />
                          <Line type="monotone" dataKey="security" stroke="#dc3545" strokeWidth={1} name="Security" />
                          <Line type="monotone" dataKey="accessibility" stroke="#198754" strokeWidth={1} name="Accessibility" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Collecting health trend data...</p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Category Distribution */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Health Category Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Critical Issues and Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Critical Issues */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-accent-500" />
                    Critical Issues
                  </h3>
                  {healthData.recommendations.filter((r: Record<string, unknown>) => r.priority === 'critical').length > 0 ? (
                    <div className="space-y-3">
                      {healthData.recommendations
                        .filter((r: Record<string, unknown>) => r.priority === 'critical')
                        .map((rec: Record<string, unknown>, index: number) => (
                          <div key={index} className="p-3 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
                            <h4 className="font-medium text-accent-800 dark:text-accent-200 mb-1">
                              {rec.title}
                            </h4>
                            <p className="text-sm text-accent-700 dark:text-accent-300 mb-2">
                              {rec.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-accent-600 dark:text-accent-400">
                                Impact: +{rec.estimatedImpact}% health
                              </span>
                              {rec.autoImplementable && (
                                <span className="text-xs text-success-600 dark:text-success-400 flex items-center">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Auto-fixable
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No critical issues detected</p>
                    </div>
                  )}
                </Card>

                {/* Auto-Healing Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary-500" />
                    Auto-Healing Actions
                  </h3>
                  {healthData.autoHealingActions.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {healthData.autoHealingActions.slice(-10).map((action: Record<string, unknown>, index: number) => (
                        <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {action.action}
                            </span>
                            <span className={action.success ? 'text-success-500' : 'text-accent-500'}>
                              {action.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                            {action.impact}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {action.category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(action.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No auto-healing actions yet</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Predictive Insights */}
              {healthData.predictiveInsights.length > 0 && (
                <Card className="p-6 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary-500" />
                    Predictive Health Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {healthData.predictiveInsights.map((insight: Record<string, unknown>, index: number) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          {insight.metric}
                        </h4>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {insight.prediction}%
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          likelihood in {insight.timeframe}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {insight.recommendation}
                        </p>
                        <div className="mt-2">
                          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full" 
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                            {insight.confidence}% confidence
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Health Optimizer Component */}
              <div className="mb-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Real-time Health Monitor
                  </h3>
                  <Suspense fallback={<div className="text-center py-4">Loading health optimizer...</div>}>
                    <HealthOptimizer
                      showInProduction={true}
                      autoOptimize={true}
                      position="embedded"
                    />
                  </Suspense>
                </Card>
              </div>

              {/* Detailed Category Analysis */}
              <div className="space-y-6">
                {Object.entries(healthData.categories).map(([category, data]: [string, { score: number; status: string; details: string }]) => (
                  <Card key={category} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()} Health
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xl font-bold ${
                          data.score >= 90 ? 'text-success-500' :
                          data.score >= 75 ? 'text-primary-500' :
                          data.score >= 50 ? 'text-warning-500' : 'text-accent-500'
                        }`}>
                          {data.score}%
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          ({data.status})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.checks.map((check: Record<string, unknown>, index: number) => (
                        <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {check.name}
                            </span>
                            <span className={
                              check.status === 'pass' ? 'text-success-500' :
                              check.status === 'warning' ? 'text-warning-500' : 'text-accent-500'
                            }>
                              {check.status === 'pass' ? <CheckCircle className="h-4 w-4" /> :
                               check.status === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                               <AlertTriangle className="h-4 w-4" />}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                            {check.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Current: {Math.round(check.value)}
                              {check.name.includes('Rate') || check.name.includes('Coverage') || check.name.includes('Usage') ? '%' : 
                               check.name.includes('Time') ? 'ms' : ''}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Target: {check.threshold}
                              {check.name.includes('Rate') || check.name.includes('Coverage') || check.name.includes('Usage') ? '%' : 
                               check.name.includes('Time') ? 'ms' : ''}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                            <div 
                              className={`h-1 rounded-full ${
                                check.status === 'pass' ? 'bg-success-500' :
                                check.status === 'warning' ? 'bg-warning-500' : 'bg-accent-500'
                              }`}
                              style={{ width: `${Math.min(100, (check.value / check.threshold) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {data.lastOptimized !== 'Never' && (
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        Last optimized: {data.lastOptimized}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDashboardPage;