import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, FileCheck, AlertTriangle, Server, Users, Plus, Edit, Trash2, Download, CheckCircle, Trophy, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import JourneyProgress from '../components/journey/JourneyProgress';
import ContextualCTA from '../components/ui/ContextualCTA';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTierLimit } from '../hooks/useTierLimit';

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

type ContinuityPlanFormData = Omit<ContinuityPlan, 'id' | 'createdAt'>;

const ContinuityPage: React.FC = () => {
  const { t } = useTranslation();
  const [showPlanner, setShowPlanner] = useState(false);
  const [plans, setPlans] = useLocalStorage<ContinuityPlan[]>('continuity-plans', []);
  const [completedSteps, setCompletedSteps] = useLocalStorage<number[]>('journey-completed-steps', []);
  const [impactAssessments] = useLocalStorage<any[]>('business-impact-assessments', []);
  const { canSave: canSavePlan, atLimit: atLimitPlan, limit: limitPlans } = useTierLimit({
    productId: 'continuity',
    limitKey: 'continuityPlans',
    currentCount: plans.length
  });
  const [showCompletion, setShowCompletion] = useState(false);

  // Mark Step 4 as completed when plans are created
  useEffect(() => {
    if (plans.length > 0 && !completedSteps.includes(4)) {
      setCompletedSteps([...completedSteps, 4]);
      // Show completion celebration if all 4 steps are done
      if (completedSteps.length >= 3) {
        setShowCompletion(true);
      }
    }
  }, [plans.length, completedSteps, setCompletedSteps]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContinuityPlanFormData>({
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

  const continuityAreas = [
    {
      title: t('continuity.continuity_areas.system_recovery.title'),
      description: t('continuity.continuity_areas.system_recovery.description'),
      icon: <Server className="h-6 w-6 text-white" />,
      features: [
        t('continuity.continuity_areas.system_recovery.features.rto'),
        t('continuity.continuity_areas.system_recovery.features.prioritization'),
        t('continuity.continuity_areas.system_recovery.features.restoration')
      ],
      color: 'bg-primary-500',
    },
    {
      title: t('continuity.continuity_areas.operational_procedures.title'),
      description: t('continuity.continuity_areas.operational_procedures.description'),
      icon: <FileCheck className="h-6 w-6 text-white" />,
      features: [
        t('continuity.continuity_areas.operational_procedures.features.manual'),
        t('continuity.continuity_areas.operational_procedures.features.communication'),
        t('continuity.continuity_areas.operational_procedures.features.allocation')
      ],
      color: 'bg-secondary-500',
    },
    {
      title: t('continuity.continuity_areas.staff_response.title'),
      description: t('continuity.continuity_areas.staff_response.description'),
      icon: <Users className="h-6 w-6 text-white" />,
      features: [
        t('continuity.continuity_areas.staff_response.features.teams'),
        t('continuity.continuity_areas.staff_response.features.training'),
        t('continuity.continuity_areas.staff_response.features.chains')
      ],
      color: 'bg-accent-500',
    },
    {
      title: t('continuity.continuity_areas.patient_safety.title'),
      description: t('continuity.continuity_areas.patient_safety.description'),
      icon: <Shield className="h-6 w-6 text-white" />,
      features: [
        t('continuity.continuity_areas.patient_safety.features.continuity'),
        t('continuity.continuity_areas.patient_safety.features.data_access'),
        t('continuity.continuity_areas.patient_safety.features.protocols')
      ],
      color: 'bg-success-500',
    },
  ];

  const riskCategories = [
    t('continuity.risk_categories.natural_disasters'),
    t('continuity.risk_categories.technology_failures'),
    t('continuity.risk_categories.cyber_security_incidents'),
    t('continuity.risk_categories.power_outages'),
    t('continuity.risk_categories.staff_shortages'),
    t('continuity.risk_categories.supply_chain_disruptions'),
    t('continuity.risk_categories.facility_issues'),
    t('continuity.risk_categories.regulatory_changes')
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
      if (!canSavePlan && atLimitPlan && limitPlans !== null) {
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast({
            type: 'warning',
            title: t('pricing_common.upgrade_cta'),
            message: t('pricing_common.limit_reached_plans', { limit: limitPlans })
          });
        }
        return;
      }
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
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const downloadTemplate = () => {
    const template = `${t('continuity.template.title')}

${t('continuity.template.organization')}
${t('continuity.template.plan_type')}
${t('continuity.template.created')} ${new Date().toLocaleDateString()}

${t('continuity.template.executive_summary')}
${t('continuity.template.purpose')}
${t('continuity.template.scope')}
${t('continuity.template.authority')}

${t('continuity.template.plan_activation')}
${t('continuity.template.activation_triggers')}
- [List specific events that trigger this plan]
- [Include both automatic and assessment-required events]

${t('continuity.template.activation_authority')}
- ${t('continuity.template.primary')}
- ${t('continuity.template.secondary')}

${t('continuity.template.recovery_procedures')}
Recovery Time Objective (RTO): [Time to restore operations]
Recovery Point Objective (RPO): [Acceptable data loss timeframe]

${t('continuity.template.phase_1')}
- [List immediate actions]
- [Include safety and containment measures]

${t('continuity.template.phase_2')}
- [List stabilization actions]
- [Include temporary solutions]

${t('continuity.template.phase_3')}
- [List full restoration actions]
- [Include lessons learned process]

${t('continuity.template.communication_plan')}
${t('continuity.template.internal_communications')}
- [Staff notification methods]
- [Update frequency]
- [Key messaging]

${t('continuity.template.external_communications')}
- [Patient/family communication]
- [Regulatory notifications]
- [Media relations]

${t('continuity.template.testing_and_training')}
${t('continuity.template.testing_schedule')}
- [Frequency of plan testing]
- [Types of exercises]
- [Success criteria]

${t('continuity.template.training_requirements')}
- [Staff training needs]
- [Competency requirements]
- [Update procedures]

${t('continuity.template.approval')}
${t('continuity.template.plan_approved_by')}
${t('continuity.template.next_review_date')}

${t('continuity.template.generated_by')}
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
    const statusKey = status === t('continuity.status.active') ? 'Active' : 
                     status === t('continuity.status.draft') ? 'Draft' : 
                     status === t('continuity.status.under_review') ? 'Under Review' : status;
    switch (statusKey) {
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
                  {t('continuity.manager.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {t('continuity.manager.subtitle')}
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowPlanner(false)}>
                {t('continuity.manager.back_to_overview')}
              </Button>
            </div>

            {/* Plan Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-medium mb-6">{isEditing ? t('continuity.manager.edit_plan') : t('continuity.manager.create_plan')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.plan_name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.planName}
                      onChange={(e) => setFormData({...formData, planName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('continuity.manager.form.plan_name_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.risk_category')}
                    </label>
                    <select
                      required
                      value={formData.riskCategory}
                      onChange={(e) => setFormData({...formData, riskCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{t('continuity.manager.form.risk_category_select')}</option>
                      {riskCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.impact_level')}
                    </label>
                    <select
                      value={formData.impactLevel}
                      onChange={(e) => setFormData({...formData, impactLevel: e.target.value as 'Critical' | 'High' | 'Medium' | 'Low'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Critical">{t('risk.critical')}</option>
                      <option value="High">{t('risk.high')}</option>
                      <option value="Medium">{t('risk.medium')}</option>
                      <option value="Low">{t('risk.low')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.recovery_time_objective')}
                    </label>
                    <input
                      type="text"
                      value={formData.recoveryTimeObjective}
                      onChange={(e) => setFormData({...formData, recoveryTimeObjective: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('continuity.manager.form.recovery_time_objective_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.recovery_point_objective')}
                    </label>
                    <input
                      type="text"
                      value={formData.recoveryPointObjective}
                      onChange={(e) => setFormData({...formData, recoveryPointObjective: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('continuity.manager.form.recovery_point_objective_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.responsible_party')}
                    </label>
                    <input
                      type="text"
                      value={formData.responsibleParty}
                      onChange={(e) => setFormData({...formData, responsibleParty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('continuity.manager.form.responsible_party_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.testing_schedule')}
                    </label>
                    <input
                      type="text"
                      value={formData.testingSchedule}
                      onChange={(e) => setFormData({...formData, testingSchedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('continuity.manager.form.testing_schedule_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('continuity.manager.form.last_tested')}
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
                    {t('continuity.manager.form.plan_description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder={t('continuity.manager.form.plan_description_placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('continuity.manager.form.recovery_procedures')}
                  </label>
                  <textarea
                    value={formData.procedures}
                    onChange={(e) => setFormData({...formData, procedures: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder={t('continuity.manager.form.recovery_procedures_placeholder')}
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
      {/* Journey Progress */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-4xl mx-auto">
          <JourneyProgress 
            currentStep={4} 
            completedSteps={completedSteps as (1 | 2 | 3 | 4)[]}
            variant="full"
          />
        </div>
      </div>

      {/* Journey Completion Celebration */}
      {showCompletion && completedSteps.length === 4 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-success-50 via-primary-50 to-secondary-50 dark:from-success-900/20 dark:via-primary-900/20 dark:to-secondary-900/20 border-2 border-success-300 dark:border-success-700">
              <div className="text-center">
                <Trophy className="h-16 w-16 text-success-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  🎉 Journey Complete! 🎉
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                  Congratulations! You've completed all 4 steps of your compliance journey.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Step 1</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Assessment</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Step 2</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">System Mapping</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Step 3</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Impact Analysis</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Step 4</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Continuity Plans</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard">
                    <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                      View Your Dashboard
                    </Button>
                  </Link>
                  <Link to="/toolkit">
                    <Button size="lg" variant="outline">
                      Download Resources
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('continuity.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('continuity.subtitle')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Step 4 of 4: Develop recovery procedures for critical systems
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => setShowPlanner(true)}>{t('continuity.create_plan')}</Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/toolkit'}>
                {t('continuity.view_templates')}
              </Button>
            </div>

            {/* Bridge Content from Step 3 */}
            {impactAssessments.length > 0 && plans.length === 0 && (
              <div className="mt-12 max-w-4xl mx-auto">
                <Card className="p-6 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Tip:</strong> You've analyzed <strong>{impactAssessments.length}</strong> system{impactAssessments.length !== 1 ? 's' : ''}. 
                    Create continuity plans for your high-impact systems first. 
                    {impactAssessments.filter((a: any) => a.patientImpact >= 4 || a.operationalImpact >= 4).length > 0 && (
                      <> Start with the <strong>{impactAssessments.filter((a: any) => a.patientImpact >= 4 || a.operationalImpact >= 4).length} system{impactAssessments.filter((a: any) => a.patientImpact >= 4 || a.operationalImpact >= 4).length !== 1 ? 's' : ''}</strong> that have high patient or operational impact.</>
                    )}
                  </p>
                </Card>
              </div>
            )}

            {/* Stats */}
            {plans.length > 0 && (
              <>
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
                    {plans.filter(p => p.status === t('continuity.status.active') || p.status === 'Active').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('planning.active_plans')}</div>
                </Card>
              </div>

              {/* Step 4 Completion Content */}
              <div className="mt-12 max-w-4xl mx-auto">
                <Card className="p-6 bg-gradient-to-br from-success-50 to-primary-50 dark:from-success-900/20 dark:to-primary-900/20 border-2 border-success-200 dark:border-success-800">
                  <div className="text-center mb-6">
                    <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Step 4 Complete! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      You've created <strong className="text-success-600 dark:text-success-400">{plans.length}</strong> continuity plan{plans.length !== 1 ? 's' : ''}
                      {plans.filter(p => p.impactLevel === 'Critical').length > 0 && (
                        <>, including <strong>{plans.filter(p => p.impactLevel === 'Critical').length} critical</strong> plan{plans.filter(p => p.impactLevel === 'Critical').length !== 1 ? 's' : ''}</>
                      )}
                    </p>
                  </div>
                  
                  {completedSteps.length === 4 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
                        🎊 Journey Complete! 🎊
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
                        Congratulations! You've completed all 4 steps of your compliance journey. 
                        You now have a comprehensive compliance framework with assessments, system mapping, impact analysis, and continuity plans.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/dashboard">
                          <Button 
                            size="lg" 
                            className="w-full"
                            icon={<ArrowRight className="h-5 w-5" />}
                            iconPosition="right"
                          >
                            View Complete Dashboard
                          </Button>
                        </Link>
                        <Link to="/toolkit">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="w-full"
                          >
                            Download All Resources
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ContextualCTA
                      title="Review Plans"
                      description="View and manage your continuity plans"
                      primaryAction={{
                        text: "View Plans",
                        href: "#plans",
                        trackingLabel: "view-plans"
                      }}
                      variant="minimal"
                    />
                    <ContextualCTA
                      title="Train Staff"
                      description="Access training resources"
                      primaryAction={{
                        text: "Go to Training",
                        href: "/training",
                        trackingLabel: "go-to-training"
                      }}
                      variant="minimal"
                    />
                    <ContextualCTA
                      title="Get Support"
                      description="Need implementation help?"
                      primaryAction={{
                        text: "Contact Us",
                        href: "/contact",
                        trackingLabel: "contact-support"
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
              {t('continuity.cta_description')}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title={t('continuity.modal.delete_title')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t('continuity.modal.delete_message')}
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={cancelDelete}>
              {t('continuity.modal.cancel')}
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              {t('continuity.modal.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContinuityPage;