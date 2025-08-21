import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, FileText, Server, Users, ArrowRight, User, Download } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RelatedLinks from '../components/ui/RelatedLinks';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import DataTable from '../components/ui/DataTable';
import ExportManager from '../components/export/ExportManager';
import { relatedPages } from '../utils/linkingStrategy';
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
  
  // Privacy-by-design: Load data from localStorage
  const [savedAssessments] = useLocalStorage('hipaa-assessments', []);
  const [contactSubmissions] = useLocalStorage('contact-submissions', []);
  const [downloadHistory] = useLocalStorage('download-history', []);
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
    ...savedAssessments.slice(-3).map((a: any) => ({
      type: 'Assessment',
      title: 'HIPAA Compliance Assessment',
      date: new Date(a.date).toLocaleDateString(),
      score: a.result?.percentage || 0,
      status: 'Completed'
    })),
    ...dependencies.slice(-3).map((d: any) => ({
      type: 'System Mapping',
      title: d.name,
      date: 'Recently added',
      criticality: d.criticality,
      status: 'Active'
    })),
    ...trainingProgress.slice(-3).map((t: any) => ({
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
      render: (value: any, row: any) => {
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
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                  Privacy-First Design
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Your data is stored locally on your device. No account required. 
                  Optionally <a href="/login" className="underline hover:text-blue-600">create an account</a> to sync across devices and access additional features.
                </p>
                {savedAssessments.length > 0 && (
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                    📊 {savedAssessments.length} assessment{savedAssessments.length !== 1 ? 's' : ''} saved locally
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Strategic Internal Links for Dashboard */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recommended Actions Based on Your Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedAssessments.length === 0 && (
                <Link 
                  to="/hipaa-check"
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  data-analytics="dashboard-recommendation"
                  data-action="first-assessment"
                  aria-label="Complete your first HIPAA compliance assessment to establish baseline"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-5 w-5 text-primary-500" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      Start Your Compliance Assessment
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Establish your compliance baseline with our comprehensive HIPAA evaluation
                  </p>
                </Link>
              )}
              
              {dependencies.length === 0 && (
                <Link 
                  to="/dependency-manager"
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  data-analytics="dashboard-recommendation"
                  data-action="system-mapping"
                  aria-label="Map your critical healthcare technology systems and dependencies"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Server className="h-5 w-5 text-secondary-500" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      Map Critical Systems
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Identify vulnerabilities and secure your healthcare technology infrastructure
                  </p>
                </Link>
              )}
              
              {trainingProgress.length === 0 && (
                <a
                  href="https://training.medisoluce.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                  data-analytics="dashboard-recommendation"
                  data-action="staff-training"
                  aria-label="Begin compliance training to strengthen your team's expertise"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="h-5 w-5 text-accent-500" />
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      Start Staff Training
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Build your team's compliance expertise with interactive training modules
                  </p>
                </a>
              )}
              
              {/* Always show advanced options */}
              <Link 
                to="/business-impact"
                className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                data-analytics="dashboard-advanced-action"
                data-action="impact-analysis"
                aria-label="Conduct business impact analysis to understand system criticality"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart className="h-5 w-5 text-warning-500" />
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    Business Impact Analysis
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Understand how system failures affect your operations and patient care
                </p>
              </Link>
              
              <Link 
                to="/business-impact"
                className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                data-analytics="dashboard-advanced-action"
                data-action="impact-analysis"
                aria-label="Conduct business impact analysis to understand operational risks"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart className="h-5 w-5 text-accent-500" />
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    Impact Analysis
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Understand how system failures affect your operations and patient care
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Analytics Overview
          </h2>
          <AnalyticsDashboard />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {metric.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.change.startsWith('+') ? 'text-success-500' : 'text-accent-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              {t('dashboard.compliance_trend')}
            </h3>
            <div className="h-80">
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

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              {t('dashboard.risk_distribution')}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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

        {/* Recent Activities */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Activities
              </h3>
              <ExportManager 
                data={recentActivities}
                filename="recent-activities"
                title="Recent Activities Report"
              />
            </div>
            {recentActivities.length > 0 ? (
              <DataTable
                data={recentActivities}
                columns={tableColumns}
                pageSize={5}
                searchable={true}
                exportable={false}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activities. Start by completing an assessment or mapping your systems.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Tasks Section */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('dashboard.upcoming_tasks')}
              </h3>
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                {t('dashboard.view_all')}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    <th className="pb-4">{t('dashboard.task')}</th>
                    <th className="pb-4">{t('dashboard.type')}</th>
                    <th className="pb-4">{t('dashboard.priority')}</th>
                    <th className="pb-4">{t('dashboard.due_date')}</th>
                    <th className="pb-4">{t('dashboard.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map((task) => (
                    <tr key={task.title}>
                      <td className="py-4">
                        <span className="text-gray-900 dark:text-white">
                          {task.title}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-600 dark:text-gray-300">
                          {task.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'High'
                            ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/20 dark:text-accent-300'
                            : task.priority === 'Medium'
                            ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                            : 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-600 dark:text-gray-300">
                          {task.dueDate}
                        </span>
                      </td>
                      <td className="py-4">
                        <Button size="sm">Start</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <Activity className="h-8 w-8 text-primary-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('dashboard.run_assessment')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start a new compliance assessment for your organization.
            </p>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => window.location.href = '/hipaa-check'}
            >
              {t('dashboard.run_assessment')}
            </Button>
          </Card>

          <Card className="p-6">
            <FileText className="h-8 w-8 text-secondary-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('dashboard.generate_report')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create a comprehensive compliance status report.
            </p>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => {
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
              }}
            >
              {t('dashboard.generate_report')}
            </Button>
          </Card>

          <Card className="p-6">
            <Users className="h-8 w-8 text-accent-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('dashboard.schedule_training')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Plan your next staff compliance training session.
            </p>
            <a href="https://toolkit.medisoluce.com" target="_blank" rel="noopener noreferrer">
              <Button 
              variant="outline" 
              fullWidth
            >
              {t('dashboard.schedule_training')}
            </Button>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;