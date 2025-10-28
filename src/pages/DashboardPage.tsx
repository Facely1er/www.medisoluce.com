import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, FileText, Server, Users, ArrowRight, User } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import DataTable from '../components/ui/DataTable';
import ExportManager from '../components/export/ExportManager';
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
  Cell,
  BarChart,
} from 'recharts';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [showCharts, setShowCharts] = React.useState(false);
  
  // Privacy-by-design: Load data from localStorage
  const [savedAssessments] = useLocalStorage('hipaa-assessments', []);
  const [dependencies] = useLocalStorage('system-dependencies', []);
  const [impactAssessments] = useLocalStorage('business-impact-assessments', []);
  const [trainingProgress] = useLocalStorage('training-progress', []);
  
  // Calculate real metrics from stored data
  const latestAssessment = savedAssessments[savedAssessments.length - 1];
  const complianceScore = latestAssessment?.result?.percentage || 87;
  const openIssues = latestAssessment?.result?.recommendations?.filter(r => r.priority === 'high').length || 3;
  const totalSystems = 24; // This would be calculated from actual dependency mapping
  const staffTrained = 95; // This would come from training completion data
  
  // Recent activities for quick access
  const recentActivities = [
    ...savedAssessments.slice(-3).map((a: { date: string; result: { percentage: number } }) => ({
      type: 'Assessment',
      title: 'HIPAA Compliance Assessment',
      date: new Date(a.date).toLocaleDateString(),
      score: a.result?.percentage || 0,
      status: 'Completed'
    })),
    ...dependencies.slice(-3).map((d: { name: string; status: string; lastUpdated: string }) => ({
      type: 'System Mapping',
      title: d.name,
      date: 'Recently added',
      criticality: d.criticality,
      status: 'Active'
    })),
    ...trainingProgress.slice(-3).map((t: { module: string; completed: boolean; completedAt: string }) => ({
      type: 'Training',
      title: t.moduleId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      date: new Date(t.completedAt).toLocaleDateString(),
      score: t.score,
      status: 'Completed'
    }))
  ].slice(0, 5);

  const tableColumns = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { 
      key: 'score', 
      label: 'Score/Level', 
      render: (value: unknown, row: { type: string; title: string; date: string; score?: number; status: string }) => {
        if (row.type === 'Assessment' || row.type === 'Training') {
          return `${value}%`;
        } else if (row.type === 'System Mapping') {
          return row.criticality;
        }
        return '-';
      }
    }
  ];

  // Generate trend data based on assessments
  const complianceData = [
    { name: 'Jan', score: Math.max(complianceScore - 12, 0) },
    { name: 'Feb', score: Math.max(complianceScore - 9, 0) },
    { name: 'Mar', score: Math.max(complianceScore - 5, 0) },
    { name: 'Apr', score: Math.max(complianceScore - 2, 0) },
    { name: 'May', score: Math.max(complianceScore - 4, 0) },
    { name: 'Jun', score: complianceScore },
  ];

  const riskData = [
    { name: 'High', value: 3 },
    { name: 'Medium', value: 8 },
    { name: 'Low', value: 15 },
  ];

  const COLORS = ['#dc3545', '#ffc107', '#198754'];

  const metrics = [
    {
      title: t('dashboard.compliance_score'),
      value: `${complianceScore}%`,
      change: '+2%',
      icon: <Shield className="h-6 w-6 text-primary-500" />,
    },
    {
      title: t('dashboard.open_issues'),
      value: openIssues.toString(),
      change: openIssues <= 3 ? '-3' : '+' + (openIssues - 3),
      icon: <AlertTriangle className="h-6 w-6 text-warning-500" />,
    },
    {
      title: t('dashboard.systems_monitored'),
      value: totalSystems.toString(),
      change: '+2',
      icon: <Server className="h-6 w-6 text-secondary-500" />,
    },
    {
      title: t('dashboard.staff_trained'),
      value: `${staffTrained}%`,
      change: '+5%',
      icon: <Users className="h-6 w-6 text-success-500" />,
    },
  ];

  const tasks = [
    {
      title: 'Complete Risk Assessment',
      dueDate: '2024-03-25',
      priority: 'High',
      type: 'Assessment',
    },
    {
      title: 'Review Access Controls',
      dueDate: '2024-03-28',
      priority: 'Medium',
      type: 'Security',
    },
    {
      title: 'Update Privacy Policies',
      dueDate: '2024-04-01',
      priority: 'Medium',
      type: 'Policy',
    },
    {
      title: 'Staff Training Review',
      dueDate: '2024-04-05',
      priority: 'Low',
      type: 'Training',
    },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('dashboard.subtitle')}
          </p>
          {savedAssessments.length === 0 && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                💾 Your data is stored locally. <a href="/login" className="underline hover:text-blue-600">Create an account</a> to sync across devices.
              </p>
            </div>
          )}
          
          {/* Quick Actions - Only show if user has no data yet */}
          {(savedAssessments.length === 0 || dependencies.length === 0 || trainingProgress.length === 0) && (
            <div className="mt-6">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                Get Started
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {savedAssessments.length === 0 && (
                  <Link 
                    to="/hipaa-check"
                    className="group p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600">
                        Start Assessment
                      </span>
                    </div>
                  </Link>
                )}
                
                {dependencies.length === 0 && (
                  <Link 
                    to="/dependency-manager"
                    className="group p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600">
                        Map Systems
                      </span>
                    </div>
                  </Link>
                )}
                
                {trainingProgress.length === 0 && (
                  <Link 
                    to="/business-impact"
                    className="group p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-accent-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600">
                        Impact Analysis
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Analytics Overview - Collapsible */}
        {(savedAssessments.length > 0 || dependencies.length > 0) && (
          <div className="mb-6">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                Analytics Overview
              </h2>
              <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform ${showAnalytics ? 'rotate-90' : ''}`} />
            </button>
            {showAnalytics && <AnalyticsDashboard />}
          </div>
        )}

        {/* Key Metrics - Simplified to 3 most important */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metrics.slice(0, 3).map((metric) => (
            <Card key={metric.title} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {metric.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {metric.title}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${
                  metric.change.startsWith('+') ? 'text-success-500' : 'text-accent-500'
                }`}>
                  {metric.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section - Collapsible */}
        {savedAssessments.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                Detailed Charts
              </h2>
              <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform ${showCharts ? 'rotate-90' : ''}`} />
            </button>
            {showCharts && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    {t('dashboard.compliance_trend')}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={complianceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#0073e6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    {t('dashboard.risk_distribution')}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Recent Activities - More Compact */}
        {recentActivities.length > 0 && (
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Recent Activities
                </h3>
                <ExportManager 
                  data={recentActivities}
                  filename="recent-activities"
                  title="Recent Activities Report"
                />
              </div>
              <DataTable
                data={recentActivities}
                columns={tableColumns}
                pageSize={3}
                searchable={false}
                exportable={false}
              />
            </div>
          </Card>
        )}

        {/* Upcoming Tasks - Simplified */}
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
              {t('dashboard.upcoming_tasks')}
            </h3>
            <div className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.title} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === 'High'
                          ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/20 dark:text-accent-300'
                          : task.priority === 'Medium'
                          ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                          : 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Due: {task.dueDate}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/hipaa-check'}>
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-primary-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('dashboard.run_assessment')}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Start new assessment
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
            const reportData = {
              assessments: savedAssessments,
              dependencies,
              impactAssessments,
              trainingProgress,
              generatedAt: new Date().toISOString()
            };
            const content = JSON.stringify(reportData, null, 2);
            const blob = new Blob([content], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }}>
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-secondary-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('dashboard.generate_report')}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Export compliance data
                </p>
              </div>
            </div>
          </Card>

          <a href="https://toolkit.medisoluce.com" target="_blank" rel="noopener noreferrer">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-accent-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('dashboard.schedule_training')}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Plan staff training
                  </p>
                </div>
              </div>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;