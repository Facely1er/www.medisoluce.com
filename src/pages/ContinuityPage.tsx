import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, FileCheck, AlertTriangle, Server, Users, Plus, Edit, Trash2, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useLocalStorage from '../hooks/useLocalStorage';

interface ContinuityPlan {
  id: string;
  planName: string;
  description: string;
  riskCategory: string;
  impactLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  recoveryTimeObjective: string;
  recoveryPointObjective: string;
  procedures: string;
  responsibleParty: string;
  testingSchedule: string;
  lastTested: string;
  status: 'Active' | 'Draft' | 'Under Review';
  createdAt: string;
}

const ContinuityPage: React.FC = () => {
  const { t } = useTranslation();
  const [showPlanner, setShowPlanner] = useState(false);
  const [plans, setPlans] = useLocalStorage<ContinuityPlan[]>('continuity-plans', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    riskCategory: '',
    impactLevel: 'Medium' as const,
    recoveryTimeObjective: '',
    recoveryPointObjective: '',
    procedures: '',
    responsibleParty: '',
    testingSchedule: '',
    lastTested: '',
    status: 'Draft' as const
  });

  const continuityAreas = [
    {
      title: 'System Recovery',
      description: 'Detailed procedures for restoring critical healthcare systems',
      icon: <Server className="h-6 w-6 text-white" />,
      features: ['Recovery time objectives', 'System prioritization', 'Data restoration'],
      color: 'bg-primary-500',
    },
    {
      title: 'Operational Procedures',
      description: 'Alternative workflows during system downtime',
      icon: <FileCheck className="h-6 w-6 text-white" />,
      features: ['Manual processes', 'Communication protocols', 'Resource allocation'],
      color: 'bg-secondary-500',
    },
    {
      title: 'Staff Response',
      description: 'Staff roles and responsibilities during incidents',
      icon: <Users className="h-6 w-6 text-white" />,
      features: ['Response teams', 'Training requirements', 'Communication chains'],
      color: 'bg-accent-500',
    },
    {
      title: 'Patient Safety',
      description: 'Maintaining patient care during disruptions',
      icon: <Shield className="h-6 w-6 text-white" />,
      features: ['Critical care continuity', 'Patient data access', 'Treatment protocols'],
      color: 'bg-success-500',
    },
  ];

  const riskCategories = [
    'Natural Disasters',
    'Technology Failures',
    'Cyber Security Incidents',
    'Power Outages',
    'Staff Shortages',
    'Supply Chain Disruptions',
    'Facility Issues',
    'Regulatory Changes'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan: ContinuityPlan = {
      id: editingId || Date.now().toString(),
      ...formData,
      createdAt: editingId ? plans.find(p => p.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };

    if (editingId) {
      setPlans(prevPlans => prevPlans.map(plan => plan.id === editingId ? newPlan : plan));
    } else {
      setPlans(prevPlans => [...prevPlans, newPlan]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      planName: '',
      description: '',
      riskCategory: '',
      impactLevel: 'Medium',
      recoveryTimeObjective: '',
      recoveryPointObjective: '',
      procedures: '',
      responsibleParty: '',
      testingSchedule: '',
      lastTested: '',
      status: 'Draft'
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (plan: ContinuityPlan) => {
    setFormData({
      planName: plan.planName,
      description: plan.description,
      riskCategory: plan.riskCategory,
      impactLevel: plan.impactLevel,
      recoveryTimeObjective: plan.recoveryTimeObjective,
      recoveryPointObjective: plan.recoveryPointObjective,
      procedures: plan.procedures,
      responsibleParty: plan.responsibleParty,
      testingSchedule: plan.testingSchedule,
      lastTested: plan.lastTested,
      status: plan.status
    });
    setIsEditing(true);
    setEditingId(plan.id);
    setShowPlanner(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this continuity plan?')) {
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    }
  };

  const downloadTemplate = () => {
    const template = `BUSINESS CONTINUITY PLAN TEMPLATE

Organization: [Your Organization Name]
Plan Type: [Risk Category]
Created: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
Purpose: [Describe the purpose of this continuity plan]
Scope: [Define what this plan covers]
Authority: [Who has authority to activate this plan]

PLAN ACTIVATION
Activation Triggers:
- [List specific events that trigger this plan]
- [Include both automatic and assessment-required events]

Activation Authority:
- Primary: [Name and contact]
- Secondary: [Name and contact]

RECOVERY PROCEDURES
Recovery Time Objective (RTO): [Time to restore operations]
Recovery Point Objective (RPO): [Acceptable data loss timeframe]

Phase 1: Immediate Response (0-4 hours)
- [List immediate actions]
- [Include safety and containment measures]

Phase 2: Short-term Recovery (4-72 hours)
- [List stabilization actions]
- [Include temporary solutions]

Phase 3: Long-term Recovery (72+ hours)
- [List full restoration actions]
- [Include lessons learned process]

COMMUNICATION PLAN
Internal Communications:
- [Staff notification methods]
- [Update frequency]
- [Key messaging]

External Communications:
- [Patient/family communication]
- [Regulatory notifications]
- [Media relations]

TESTING AND TRAINING
Testing Schedule:
- [Frequency of plan testing]
- [Types of exercises]
- [Success criteria]

Training Requirements:
- [Staff training needs]
- [Competency requirements]
- [Update procedures]

APPROVAL
Plan Approved By: _________________ Date: _________
Next Review Date: _________________

Generated by MediSoluce Healthcare Compliance Platform
`;

    const blob = new Blob([template], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `continuity-plan-template-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'Draft': return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600';
      case 'Under Review': return 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  if (showPlanner) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                  Continuity Plan Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Create and manage business continuity plans for your healthcare organization
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowPlanner(false)}>
                Back to Overview
              </Button>
            </div>

            {/* Plan Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-medium mb-6">{isEditing ? 'Edit' : 'Create'} Continuity Plan</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.planName}
                      onChange={(e) => setFormData({...formData, planName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., EHR System Outage Plan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Risk Category
                    </label>
                    <select
                      required
                      value={formData.riskCategory}
                      onChange={(e) => setFormData({...formData, riskCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Risk Category</option>
                      {riskCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Impact Level
                    </label>
                    <select
                      value={formData.impactLevel}
                      onChange={(e) => setFormData({...formData, impactLevel: e.target.value as 'Critical' | 'High' | 'Medium' | 'Low'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recovery Time Objective (RTO)
                    </label>
                    <input
                      type="text"
                      value={formData.recoveryTimeObjective}
                      onChange={(e) => setFormData({...formData, recoveryTimeObjective: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 4 hours, 24 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recovery Point Objective (RPO)
                    </label>
                    <input
                      type="text"
                      value={formData.recoveryPointObjective}
                      onChange={(e) => setFormData({...formData, recoveryPointObjective: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 1 hour, 8 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Responsible Party
                    </label>
                    <input
                      type="text"
                      value={formData.responsibleParty}
                      onChange={(e) => setFormData({...formData, responsibleParty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., IT Director, Facilities Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Testing Schedule
                    </label>
                    <input
                      type="text"
                      value={formData.testingSchedule}
                      onChange={(e) => setFormData({...formData, testingSchedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Quarterly, Annually"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Tested
                    </label>
                    <input
                      type="date"
                      value={formData.lastTested}
                      onChange={(e) => setFormData({...formData, lastTested: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Plan Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of this continuity plan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recovery Procedures
                  </label>
                  <textarea
                    value={formData.procedures}
                    onChange={(e) => setFormData({...formData, procedures: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Detailed step-by-step recovery procedures..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update' : 'Create'} Plan
                  </Button>
                </div>
              </form>
            </Card>

            {/* Plans List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Continuity Plans ({plans.length})</h2>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  icon={<Download className="h-4 w-4" />}
                >
                  Download Template
                </Button>
              </div>

              {plans.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No continuity plans yet. Create your first plan above.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {plans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {plan.planName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getImpactColor(plan.impactLevel)}`}>
                            {plan.impactLevel} Impact
                          </span>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(plan.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Risk Category:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{plan.riskCategory}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">RTO:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{plan.recoveryTimeObjective || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">RPO:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{plan.recoveryPointObjective || 'Not specified'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Responsible Party:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{plan.responsibleParty || 'Not assigned'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Testing Schedule:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{plan.testingSchedule || 'Not scheduled'}</span>
                        </div>
                      </div>

                      {plan.procedures && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Procedures:</span>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {plan.procedures}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        Created on {new Date(plan.createdAt).toLocaleDateString()}
                        {plan.lastTested && (
                          <span className="ml-4">
                            Last tested: {new Date(plan.lastTested).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('continuity.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('continuity.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => setShowPlanner(true)}>{t('continuity.create_plan')}</Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/toolkit'}>
                {t('continuity.view_templates')}
              </Button>
            </div>

            {/* Stats */}
            {plans.length > 0 && (
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-primary-600">{plans.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Plans Created</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-accent-600">
                    {plans.filter(p => p.impactLevel === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Critical Plans</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-success-600">
                    {plans.filter(p => p.status === 'Active').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Plans</div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continuity Areas Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-12">
              {t('continuity.key_areas')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {continuityAreas.map((area, index) => (
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
                        {area.features.map((feature) => (
                          <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                            <Shield className="h-4 w-4 mr-2 text-primary-500" />
                            {feature}
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

      {/* Planning Process Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-12">
              {t('continuity.planning_process')}
            </h2>

            <div className="space-y-12">
              {[
                {
                  title: "1. " + t('continuity.risk_assessment'),
                  description: "Identify potential threats and vulnerabilities to healthcare operations.",
                  icon: <AlertTriangle className="h-8 w-8 text-primary-500" />,
                },
                {
                  title: "2. " + t('continuity.impact_analysis'),
                  description: "Evaluate the impact of disruptions on patient care and operations.",
                  icon: <FileCheck className="h-8 w-8 text-secondary-500" />,
                },
                {
                  title: "3. " + t('continuity.recovery_strategy'),
                  description: "Develop comprehensive recovery procedures and workflows.",
                  icon: <Server className="h-8 w-8 text-accent-500" />,
                },
                {
                  title: "4. " + t('continuity.testing_training'),
                  description: "Regular testing of plans and staff training for preparedness.",
                  icon: <Users className="h-8 w-8 text-success-500" />,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700">
                      {step.icon}
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
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
              {t('continuity.ready_strengthen')}
            </h2>
            <p className="text-primary-100 mb-8">
              Start creating comprehensive continuity plans for your healthcare organization.
            </p>
            <Button 
              variant="outline" 
              className="!bg-white !text-primary-600 !border-white hover:!bg-primary-50 hover:!text-primary-700 hover:!border-primary-50"
              onClick={() => setShowPlanner(true)}
            >
              {t('continuity.start_planning')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContinuityPage;