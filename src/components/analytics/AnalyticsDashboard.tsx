import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import useLocalStorage from '../../hooks/useLocalStorage';

const AnalyticsDashboard: React.FC = () => {
  const [assessments] = useLocalStorage('hipaa-assessments', []);
  const [dependencies] = useLocalStorage('system-dependencies', []);
  const [impactAssessments] = useLocalStorage('business-impact-assessments', []);
  const [trainingProgress] = useLocalStorage('training-progress', []);
  const [contactSubmissions] = useLocalStorage('contact-submissions', []);

  // Calculate metrics
  const totalAssessments = assessments.length;
  const avgComplianceScore = assessments.length > 0 
    ? Math.round(assessments.reduce((sum: number, a: any) => sum + (a.result?.percentage || 0), 0) / assessments.length)
    : 0;
  const criticalSystems = dependencies.filter((d: any) => d.criticality === 'Critical').length;
  const completedTraining = trainingProgress.filter((t: any) => t.completed).length;

  // Compliance trend data
  const complianceTrend = assessments.slice(-6).map((assessment: any, index: number) => ({
    month: `Month ${index + 1}`,
    score: assessment.result?.percentage || 0
  }));

  // Risk distribution data
  const riskData = [
    { name: 'High Risk', value: dependencies.filter((d: any) => d.riskLevel === 'High').length },
    { name: 'Medium Risk', value: dependencies.filter((d: any) => d.riskLevel === 'Medium').length },
    { name: 'Low Risk', value: dependencies.filter((d: any) => d.riskLevel === 'Low').length },
  ];

  const COLORS = ['#dc3545', '#ffc107', '#198754'];

  const metrics = [
    {
      title: 'Total Assessments',
      value: totalAssessments,
      change: totalAssessments > 0 ? '+100%' : '0%',
      trend: 'up',
      icon: <FileText className="h-6 w-6 text-primary-500" />
    },
    {
      title: 'Avg Compliance Score',
      value: `${avgComplianceScore}%`,
      change: avgComplianceScore >= 80 ? '+5%' : '-2%',
      trend: avgComplianceScore >= 80 ? 'up' : 'down',
      icon: <CheckCircle className="h-6 w-6 text-success-500" />
    },
    {
      title: 'Critical Systems',
      value: criticalSystems,
      change: '+2',
      trend: 'up',
      icon: <AlertTriangle className="h-6 w-6 text-warning-500" />
    },
    {
      title: 'Training Completed',
      value: completedTraining,
      change: completedTraining > 0 ? `+${completedTraining}` : '0',
      trend: 'up',
      icon: <Users className="h-6 w-6 text-secondary-500" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {metric.icon}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-success-500' : 'text-accent-500'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Compliance Trend
          </h3>
          {complianceTrend.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0073e6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Complete assessments to see trend data
            </div>
          )}
        </Card>

        {/* Risk Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Risk Distribution
          </h3>
          {riskData.some(d => d.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Map system dependencies to see risk data
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;