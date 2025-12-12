import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart2, Clock, Activity, FileText, ArrowRight, Plus, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import JourneyProgress from '../components/journey/JourneyProgress';
import ContextualCTA from '../components/ui/ContextualCTA';
import useLocalStorage from '../hooks/useLocalStorage';

interface ImpactAssessment {
  id: string;
  systemName: string;
  patientImpact: number; // 1-5 scale
  operationalImpact: number; // 1-5 scale  
  financialImpact: number; // 1-5 scale
  complianceImpact: number; // 1-5 scale
  maxDowntime: string;
  revenueAtRisk: number;
  recoveryTime: string;
  notes: string;
  timestamp: string;
}

const BusinessImpactPage: React.FC = () => {
  const { t } = useTranslation();
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [assessments, setAssessments] = useLocalStorage<ImpactAssessment[]>('business-impact-assessments', []);
  const [completedSteps, setCompletedSteps] = useLocalStorage<number[]>('journey-completed-steps', []);
  const [dependencies] = useLocalStorage<any[]>('system-dependencies', []);

  // Mark Step 3 as completed when assessments are added
  useEffect(() => {
    if (assessments.length > 0 && !completedSteps.includes(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
  }, [assessments.length, completedSteps, setCompletedSteps]);
  const [formData, setFormData] = useState({
    systemName: '',
    patientImpact: 3,
    operationalImpact: 3,
    financialImpact: 3,
    complianceImpact: 3,
    maxDowntime: '',
    revenueAtRisk: 0,
    recoveryTime: '',
    notes: ''
  });

  const impactAreas = [
    {
      title: t('impact.impact_areas.patient_care.title'),
      description: t('impact.impact_areas.patient_care.description'),
      icon: <Activity className="h-6 w-6 text-white" />,
      metrics: [
        t('impact.impact_areas.patient_care.metrics.delays'),
        t('impact.impact_areas.patient_care.metrics.safety'),
        t('impact.impact_areas.patient_care.metrics.quality')
      ],
      color: 'bg-primary-500',
    },
    {
      title: t('impact.impact_areas.operations.title'),
      description: t('impact.impact_areas.operations.description'),
      icon: <Clock className="h-6 w-6 text-white" />,
      metrics: [
        t('impact.impact_areas.operations.metrics.productivity'),
        t('impact.impact_areas.operations.metrics.utilization'),
        t('impact.impact_areas.operations.metrics.efficiency')
      ],
      color: 'bg-secondary-500',
    },
    {
      title: t('impact.impact_areas.financial.title'),
      description: t('impact.impact_areas.financial.description'),
      icon: <BarChart2 className="h-6 w-6 text-white" />,
      metrics: [
        t('impact.impact_areas.financial.metrics.revenue_loss'),
        t('impact.impact_areas.financial.metrics.recovery_costs'),
        t('impact.impact_areas.financial.metrics.insurance')
      ],
      color: 'bg-accent-500',
    },
    {
      title: t('impact.impact_areas.compliance.title'),
      description: t('impact.impact_areas.compliance.description'),
      icon: <FileText className="h-6 w-6 text-white" />,
      metrics: [
        t('impact.impact_areas.compliance.metrics.violations'),
        t('impact.impact_areas.compliance.metrics.delays'),
        t('impact.impact_areas.compliance.metrics.gaps')
      ],
      color: 'bg-success-500',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssessment: ImpactAssessment = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString()
    };

    setAssessments(prev => [...prev, newAssessment]);
    
    // Reset form
    setFormData({
      systemName: '',
      patientImpact: 3,
      operationalImpact: 3,
      financialImpact: 3,
      complianceImpact: 3,
      maxDowntime: '',
      revenueAtRisk: 0,
      recoveryTime: '',
      notes: ''
    });
  };

  const getImpactColor = (score: number) => {
    if (score >= 4) return 'text-red-600 bg-red-100 border-red-200';
    if (score >= 3) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getImpactLabel = (score: number) => {
    if (score >= 4) return 'High';
    if (score >= 3) return 'Medium';
    if (score >= 2) return 'Low';
    return 'Minimal';
  };

  const calculateOverallRisk = (assessment: ImpactAssessment) => {
    const avgImpact = (assessment.patientImpact + assessment.operationalImpact + 
                      assessment.financialImpact + assessment.complianceImpact) / 4;
    return Math.round(avgImpact * 10) / 10;
  };

  const downloadSampleReport = () => {
    const sampleReport = `BUSINESS IMPACT ANALYSIS SAMPLE REPORT

Organization: Sample Healthcare Organization
Generated: ${new Date().toLocaleDateString()}
Report Type: Business Impact Analysis

EXECUTIVE SUMMARY
This sample report demonstrates the format and content of a typical business impact analysis for healthcare organizations. Use this as a template for understanding the scope and depth of analysis required.

CRITICAL SYSTEMS ANALYSIS

System: Electronic Health Record (EHR)
- Patient Care Impact: 5/5 (Critical)
- Operational Impact: 5/5 (Critical)
- Financial Impact: 4/5 (High)
- Compliance Impact: 5/5 (Critical)
- Overall Risk Score: 4.8/5
- Maximum Tolerable Downtime: 15 minutes
- Daily Revenue at Risk: $250,000
- Recovery Time Objective: 30 minutes

System: Laboratory Information System
- Patient Care Impact: 4/5 (High)
- Operational Impact: 4/5 (High)
- Financial Impact: 3/5 (Medium)
- Compliance Impact: 4/5 (High)
- Overall Risk Score: 3.8/5
- Maximum Tolerable Downtime: 2 hours
- Daily Revenue at Risk: $75,000
- Recovery Time Objective: 1 hour

System: Pharmacy Management System
- Patient Care Impact: 5/5 (Critical)
- Operational Impact: 4/5 (High)
- Financial Impact: 3/5 (Medium)
- Compliance Impact: 4/5 (High)
- Overall Risk Score: 4.0/5
- Maximum Tolerable Downtime: 30 minutes
- Daily Revenue at Risk: $100,000
- Recovery Time Objective: 45 minutes

RECOMMENDATIONS

High Priority:
- Implement redundant systems for EHR to reduce single points of failure
- Establish real-time backup procedures for critical patient data
- Develop comprehensive downtime procedures for each critical system

Medium Priority:
- Cross-train staff on manual procedures for system outages
- Implement automated failover for laboratory systems
- Enhance monitoring and alerting for early problem detection

Low Priority:
- Review and update business continuity plans quarterly
- Conduct regular disaster recovery testing
- Establish vendor support agreements for emergency response

FINANCIAL IMPACT SUMMARY
Total Daily Revenue at Risk: $425,000
Estimated Recovery Costs: $50,000 - $200,000 per incident
Recommended Investment in Resilience: $300,000 annually

NEXT STEPS
1. Complete comprehensive dependency mapping for all critical systems
2. Develop detailed business continuity plans based on this analysis
3. Implement recommended technical controls and redundancies
4. Train staff on emergency procedures and manual workflows

This report was generated by MediSoluce Healthcare Compliance Platform.
For a customized analysis of your organization, start your assessment at: ${window.location.origin}/business-impact
`;

    const blob = new Blob([sampleReport], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample-business-impact-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Track download
    analytics.trackDownload('Sample Business Impact Analysis', 'TXT');
  };

  if (showAnalyzer) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Journey Progress */}
          <div className="max-w-4xl mx-auto mb-8">
            <JourneyProgress 
              currentStep={3} 
              completedSteps={completedSteps as (1 | 2 | 3 | 4)[]}
              variant="compact"
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  Business Impact Analyzer
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Step 3 of 4: Assess the business impact of system disruptions on your organization
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowAnalyzer(false)}>
                Back to Overview
              </Button>
            </div>

            {/* Bridge Content from Step 2 */}
            {dependencies.length > 0 && (
              <Card className="p-4 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Tip:</strong> You've mapped <strong>{dependencies.length}</strong> system{dependencies.length !== 1 ? 's' : ''}. 
                  {dependencies.filter((d: any) => d.criticality === 'Critical').length > 0 && (
                    <> Start with your <strong>{dependencies.filter((d: any) => d.criticality === 'Critical').length} critical</strong> system{dependencies.filter((d: any) => d.criticality === 'Critical').length !== 1 ? 's' : ''} for the highest impact analysis.</>
                  )}
                </p>
              </Card>
            )}

            {/* Assessment Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-medium mb-6">System Impact Assessment</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    System Name
                  </label>
                  {dependencies.length > 0 ? (
                    <select
                      required
                      value={formData.systemName}
                      onChange={(e) => setFormData({...formData, systemName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a system from your dependency map...</option>
                      {dependencies
                        .filter((d: any) => d.criticality === 'Critical' || d.criticality === 'High')
                        .map((dep: any) => (
                          <option key={dep.id} value={dep.name}>
                            {dep.name} {dep.criticality === 'Critical' ? '(Critical)' : ''}
                          </option>
                        ))}
                      <option value="other">Other System (enter manually)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.systemName}
                      onChange={(e) => setFormData({...formData, systemName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Electronic Health Record System"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Patient Care Impact (1-5)
                    </label>
                    <select
                      value={formData.patientImpact}
                      onChange={(e) => setFormData({...formData, patientImpact: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={1}>1 - Minimal Impact</option>
                      <option value={2}>2 - Low Impact</option>
                      <option value={3}>3 - Medium Impact</option>
                      <option value={4}>4 - High Impact</option>
                      <option value={5}>5 - Critical Impact</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Operational Impact (1-5)
                    </label>
                    <select
                      value={formData.operationalImpact}
                      onChange={(e) => setFormData({...formData, operationalImpact: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={1}>1 - Minimal Impact</option>
                      <option value={2}>2 - Low Impact</option>
                      <option value={3}>3 - Medium Impact</option>
                      <option value={4}>4 - High Impact</option>
                      <option value={5}>5 - Critical Impact</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Financial Impact (1-5)
                    </label>
                    <select
                      value={formData.financialImpact}
                      onChange={(e) => setFormData({...formData, financialImpact: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={1}>1 - Minimal Impact</option>
                      <option value={2}>2 - Low Impact</option>
                      <option value={3}>3 - Medium Impact</option>
                      <option value={4}>4 - High Impact</option>
                      <option value={5}>5 - Critical Impact</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compliance Impact (1-5)
                    </label>
                    <select
                      value={formData.complianceImpact}
                      onChange={(e) => setFormData({...formData, complianceImpact: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={1}>1 - Minimal Impact</option>
                      <option value={2}>2 - Low Impact</option>
                      <option value={3}>3 - Medium Impact</option>
                      <option value={4}>4 - High Impact</option>
                      <option value={5}>5 - Critical Impact</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Tolerable Downtime
                    </label>
                    <input
                      type="text"
                      value={formData.maxDowntime}
                      onChange={(e) => setFormData({...formData, maxDowntime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 2 hours, 30 minutes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Daily Revenue at Risk ($)
                    </label>
                    <input
                      type="number"
                      value={formData.revenueAtRisk}
                      onChange={(e) => setFormData({...formData, revenueAtRisk: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expected Recovery Time
                    </label>
                    <input
                      type="text"
                      value={formData.recoveryTime}
                      onChange={(e) => setFormData({...formData, recoveryTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 4 hours, 1 day"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Additional context about this system's business impact..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assessment
                  </Button>
                </div>
              </form>
            </Card>

            {/* Assessments List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Impact Assessments ({assessments.length})</h2>
              </div>

              {assessments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No impact assessments yet. Create your first assessment above.
                </div>
              ) : (
                <div className="space-y-6">
                  {assessments.map((assessment) => {
                    const overallRisk = calculateOverallRisk(assessment);
                    return (
                      <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {assessment.systemName}
                          </h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getImpactColor(overallRisk)}`}>
                            Overall Risk: {overallRisk}/5 ({getImpactLabel(overallRisk)})
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">{assessment.patientImpact}/5</div>
                            <div className="text-xs text-gray-500">Patient Impact</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary-600">{assessment.operationalImpact}/5</div>
                            <div className="text-xs text-gray-500">Operational Impact</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent-600">{assessment.financialImpact}/5</div>
                            <div className="text-xs text-gray-500">Financial Impact</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-success-600">{assessment.complianceImpact}/5</div>
                            <div className="text-xs text-gray-500">Compliance Impact</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Max Downtime:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                              {assessment.maxDowntime || 'Not specified'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Revenue at Risk:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                              ${assessment.revenueAtRisk.toLocaleString()}/day
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Recovery Time:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                              {assessment.recoveryTime || 'Not specified'}
                            </span>
                          </div>
                        </div>

                        {assessment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{assessment.notes}</span>
                          </div>
                        )}

                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                          Assessed on {new Date(assessment.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Journey Progress */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-4xl mx-auto">
          <JourneyProgress 
            currentStep={3} 
            completedSteps={completedSteps as (1 | 2 | 3 | 4)[]}
            variant="full"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('impact.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('impact.subtitle')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Step 3 of 4: Analyze the business impact of potential system failures
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => setShowAnalyzer(true)}>
                {t('impact.start_analysis')}
              </Button>
              <Button variant="outline" size="lg" onClick={downloadSampleReport}>
                {t('impact.view_sample')}
              </Button>
            </div>

            {/* Stats */}
            {assessments.length > 0 && (
              <>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-primary-600">{assessments.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Systems Assessed</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-accent-600">
                      {assessments.filter(a => calculateOverallRisk(a) >= 4).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">High Risk Systems</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-success-600">
                      ${assessments.reduce((sum, a) => sum + a.revenueAtRisk, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Daily Revenue at Risk</div>
                  </Card>
                </div>

                {/* Bridge Content to Step 4 */}
                <div className="mt-12 max-w-4xl mx-auto">
                  <Card className="p-6 bg-gradient-to-br from-accent-50 to-success-50 dark:from-accent-900/20 dark:to-success-900/20 border-2 border-accent-200 dark:border-accent-800">
                    <div className="text-center mb-6">
                      <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Step 3 Complete! 🎉
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        You've analyzed the impact of <strong className="text-accent-600 dark:text-accent-400">{assessments.length}</strong> system{assessments.length !== 1 ? 's' : ''}
                        {assessments.filter(a => calculateOverallRisk(a) >= 4).length > 0 && (
                          <>, identifying <strong>{assessments.filter(a => calculateOverallRisk(a) >= 4).length} high-impact</strong> system{assessments.filter(a => calculateOverallRisk(a) >= 4).length !== 1 ? 's' : ''} that need continuity plans</>
                        )}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Recommended Next Step:
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Now create <strong>business continuity plans</strong> for your high-impact systems. 
                        These plans will define recovery procedures, RTO/RPO targets, and ensure patient care continues during outages.
                      </p>
                      
                      <Link to="/continuity">
                        <Button 
                          size="lg" 
                          className="w-full sm:w-auto"
                          icon={<ArrowRight className="h-5 w-5" />}
                          iconPosition="right"
                        >
                          Continue to Step 4: Plan Recovery
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ContextualCTA
                        title="Review Impact Analysis"
                        description="View detailed impact assessments"
                        primaryAction={{
                          text: "View All Assessments",
                          href: "#assessments",
                          trackingLabel: "view-assessments"
                        }}
                        variant="minimal"
                      />
                      <ContextualCTA
                        title="Export Report"
                        description="Download your impact analysis"
                        primaryAction={{
                          text: "Download Report",
                          href: "#export",
                          trackingLabel: "export-impact"
                        }}
                        variant="minimal"
                      />
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Impact Areas Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-12">
              {t('impact.key_areas')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {impactAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hover className="h-full">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-lg ${area.color} flex items-center justify-center`}>
                          {area.icon}
                        </div>
                        <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">
                          {area.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {area.description}
                      </p>
                      <ul className="space-y-2">
                        {area.metrics.map((metric) => (
                          <li key={metric} className="flex items-center text-gray-600 dark:text-gray-300">
                            <ArrowRight className="h-4 w-4 mr-2 text-primary-500" />
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
              {t('impact.ready_analyze')}
            </h2>
            <p className="text-primary-100 mb-8">
              {t('impact.ready_analyze_subtitle')}
            </p>
            <Button 
              variant="outline" 
              className="!bg-white !text-primary-600 !border-white hover:!bg-primary-50 hover:!text-primary-700 hover:!border-primary-50"
              onClick={() => setShowAnalyzer(true)}
            >
              {t('impact.begin_analysis')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessImpactPage;