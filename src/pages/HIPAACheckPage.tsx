import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AssessmentEngine, { Question, AssessmentResult } from '../components/assessment/AssessmentEngine';
import AssessmentForm, { AssessmentFormData } from '../components/forms/AssessmentForm';
import RelatedLinks from '../components/ui/RelatedLinks';
import ContextualCTA from '../components/ui/ContextualCTA';
import JourneyProgress from '../components/journey/JourneyProgress';
import { ShieldCheck, CheckCircle, FileText, AlertTriangle, Users, Lock, Eye, ArrowRight, BookOpen, Download, Server } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useLocalStorage from '../hooks/useLocalStorage';

const HIPAACheckPage: React.FC = () => {
  const { t } = useTranslation();
  const [showAssessment, setShowAssessment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentFormData | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [completedSteps, setCompletedSteps] = useLocalStorage<number[]>('journey-completed-steps', []);
  
  const hipaaQuestions: Question[] = [
    {
      id: 'risk-assessment',
      text: t('hipaa_assessment.questions.risk_assessment.text'),
      description: t('hipaa_assessment.questions.risk_assessment.description'),
      options: [
        { id: 'risk-yes-comprehensive', text: t('hipaa_assessment.questions.risk_assessment.options.yes_comprehensive'), value: 5 },
        { id: 'risk-yes-partial', text: t('hipaa_assessment.questions.risk_assessment.options.yes_partial'), value: 3 },
        { id: 'risk-no-planned', text: t('hipaa_assessment.questions.risk_assessment.options.no_planned'), value: 1 },
        { id: 'risk-no', text: t('hipaa_assessment.questions.risk_assessment.options.no'), value: 0 },
      ],
      regulations: ['Security Rule §164.308(a)(1)', 'Security Rule §164.306(a)'],
      frameworks: ['HIPAA Security Rule']
    },
    {
      id: 'policies-procedures',
      text: t('hipaa_assessment.questions.policies_procedures.text'),
      description: t('hipaa_assessment.questions.policies_procedures.description'),
      options: [
        { id: 'policies-yes-comprehensive', text: t('hipaa_assessment.questions.policies_procedures.options.yes_comprehensive'), value: 5 },
        { id: 'policies-yes-outdated', text: t('hipaa_assessment.questions.policies_procedures.options.yes_outdated'), value: 3 },
        { id: 'policies-partial', text: t('hipaa_assessment.questions.policies_procedures.options.partial'), value: 2 },
        { id: 'policies-no', text: t('hipaa_assessment.options.policies_no'), value: 0 },
      ],
      regulations: ['Security Rule §164.316(a)', 'Privacy Rule §164.530(i)'],
      frameworks: ['HIPAA Security Rule', 'HIPAA Privacy Rule']
    },
    {
      id: 'employee-training',
      text: t('hipaa_assessment.questions.employee_training.text'),
      description: t('hipaa_assessment.questions.employee_training.description'),
      options: [
        { id: 'training-annual-plus', text: t('hipaa_assessment.options.training_annual_plus'), value: 5 },
        { id: 'training-annual', text: t('hipaa_assessment.options.training_annual'), value: 4 },
        { id: 'training-onboarding', text: t('hipaa_assessment.options.training_onboarding'), value: 2 },
        { id: 'training-never', text: t('hipaa_assessment.options.training_never'), value: 0 },
      ],
      regulations: ['Security Rule §164.308(a)(5)', 'Privacy Rule §164.530(b)'],
      frameworks: ['HIPAA Security Rule', 'HIPAA Privacy Rule']
    },
    {
      id: 'encryption',
      text: t('hipaa_assessment.questions.encryption.text'),
      description: t('hipaa_assessment.questions.encryption.description'),
      options: [
        { id: 'encryption-both', text: t('hipaa_assessment.questions.encryption.options.both'), value: 5 },
        { id: 'encryption-transit', text: t('hipaa_assessment.options.encryption_transit'), value: 3 },
        { id: 'encryption-rest', text: t('hipaa_assessment.options.encryption_rest'), value: 2 },
        { id: 'encryption-none', text: t('hipaa_assessment.options.encryption_none'), value: 0 },
      ],
      regulations: ['Security Rule §164.312(a)(2)(iv)', 'Security Rule §164.312(e)(2)(ii)'],
      frameworks: ['HIPAA Security Rule']
    },
    {
      id: 'access-controls',
      text: t('hipaa_assessment.questions.access_controls.text'),
      description: t('hipaa_assessment.questions.access_controls.description'),
      options: [
        { id: 'access-rbac-audit', text: t('hipaa_assessment.questions.access_controls.options.rbac_audit'), value: 5 },
        { id: 'access-rbac', text: t('hipaa_assessment.questions.access_controls.options.rbac'), value: 3 },
        { id: 'access-basic', text: t('hipaa_assessment.questions.access_controls.options.basic'), value: 2 },
        { id: 'access-minimal', text: t('hipaa_assessment.options.access_minimal'), value: 0 },
      ],
    },
    {
      id: 'business-associates',
      text: t('hipaa_assessment.questions.business_associates.text'),
      description: t('hipaa_assessment.questions.business_associates.description'),
      options: [
        { id: 'baa-all-reviewed', text: t('hipaa_assessment.questions.business_associates.options.all_reviewed'), value: 5 },
        { id: 'baa-all', text: t('hipaa_assessment.questions.business_associates.options.all'), value: 4 },
        { id: 'baa-some', text: t('hipaa_assessment.options.baa_some'), value: 2 },
        { id: 'baa-none', text: t('hipaa_assessment.options.baa_none'), value: 0 },
      ],
    },
    {
      id: 'incident-response',
      text: t('hipaa_assessment.questions.incident_response.text'),
      description: t('hipaa_assessment.questions.incident_response.description'),
      options: [
        { id: 'incident-tested', text: t('hipaa_assessment.questions.incident_response.options.tested'), value: 5 },
        { id: 'incident-documented', text: t('hipaa_assessment.questions.incident_response.options.documented'), value: 3 },
        { id: 'incident-informal', text: t('hipaa_assessment.options.incident_informal'), value: 2 },
        { id: 'incident-none', text: t('hipaa_assessment.options.incident_none'), value: 0 },
      ],
    },
    {
      id: 'audit-logs',
      text: t('hipaa_assessment.questions.audit_logs.text'),
      description: t('hipaa_assessment.questions.audit_logs.description'),
      options: [
        { id: 'logs-comprehensive-monitored', text: t('hipaa_assessment.questions.audit_logs.options.comprehensive_monitored'), value: 5 },
        { id: 'logs-comprehensive', text: t('hipaa_assessment.questions.audit_logs.options.comprehensive'), value: 3 },
        { id: 'logs-partial', text: t('hipaa_assessment.options.logs_partial'), value: 2 },
        { id: 'logs-none', text: t('hipaa_assessment.options.logs_none'), value: 0 },
      ],
    },
    {
      id: 'device-security',
      text: t('hipaa_assessment.questions.device_security.text'),
      description: t('hipaa_assessment.questions.device_security.description'),
      options: [
        { id: 'devices-mdm-encryption', text: t('hipaa_assessment.questions.device_security.options.mdm_encryption'), value: 5 },
        { id: 'devices-encryption-policies', text: t('hipaa_assessment.options.devices_encryption_policies'), value: 3 },
        { id: 'devices-basic', text: t('hipaa_assessment.questions.device_security.options.basic'), value: 2 },
        { id: 'devices-none', text: t('hipaa_assessment.options.devices_none'), value: 0 },
      ],
    },
    {
      id: 'emergency-access',
      text: t('hipaa_assessment.questions.emergency_access.text'),
      description: t('hipaa_assessment.questions.emergency_access.description'),
      options: [
        { id: 'emergency-documented-tested', text: t('hipaa_assessment.questions.emergency_access.options.documented_tested'), value: 5 },
        { id: 'emergency-documented', text: t('hipaa_assessment.questions.emergency_access.options.documented'), value: 3 },
        { id: 'emergency-informal', text: t('hipaa_assessment.options.emergency_informal'), value: 2 },
        { id: 'emergency-none', text: t('hipaa_assessment.options.emergency_none'), value: 0 },
      ],
    },
  ];

  const calculateResults = (answers: Record<string, string>): AssessmentResult => {
    let score = 0;
    const maxScore = hipaaQuestions.length * 5; // Max score is 5 per question
    
    // Calculate score based on selected options
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = hipaaQuestions.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === answerId);
        if (selectedOption) {
          score += selectedOption.value;
        }
      }
    });
    
    const percentage = Math.round((score / maxScore) * 100);
    
    // Generate recommendations based on answers
    const recommendations = [];
    
    // Risk Assessment
    if (!answers['risk-assessment'] || ['risk-no-planned', 'risk-no'].includes(answers['risk-assessment'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Conduct a comprehensive risk assessment covering all systems that process, store, or transmit PHI.',
      });
    } else if (answers['risk-assessment'] === 'risk-yes-partial') {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Expand your current risk assessment to include all systems and processes that handle PHI.',
      });
    }
    
    // Policies and Procedures
    if (!answers['policies-procedures'] || answers['policies-procedures'] === 'policies-no') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Develop comprehensive HIPAA policies and procedures covering Privacy, Security, and Breach Notification Rules.',
      });
    } else if (['policies-yes-outdated', 'policies-partial'].includes(answers['policies-procedures'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Update and complete your HIPAA policies and procedures to ensure comprehensive coverage.',
      });
    }
    
    // Employee Training
    if (!answers['employee-training'] || answers['employee-training'] === 'training-never') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement a formal HIPAA training program for all employees with annual refresher courses.',
      });
    } else if (answers['employee-training'] === 'training-onboarding') {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Expand your training program to include annual refreshers and updates when significant changes occur.',
      });
    }
    
    // Encryption
    if (!answers['encryption'] || answers['encryption'] === 'encryption-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement encryption for PHI both at rest and in transit across all systems.',
      });
    } else if (['encryption-transit', 'encryption-rest'].includes(answers['encryption'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Extend encryption coverage to protect PHI both at rest and in transit.',
      });
    }
    
    // Access Controls
    if (!answers['access-controls'] || ['access-minimal'].includes(answers['access-controls'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement role-based access controls with least privilege principles for all systems containing PHI.',
      });
    } else if (['access-basic', 'access-rbac'].includes(answers['access-controls'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Enhance access controls with regular user access reviews and certification.',
      });
    }
    
    // Business Associates
    if (!answers['business-associates'] || answers['business-associates'] === 'baa-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Identify all business associates with access to PHI and execute BAAs with each vendor.',
      });
    } else if (answers['business-associates'] === 'baa-some') {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Complete BAAs with all remaining vendors who access PHI and implement a vendor management program.',
      });
    }
    
    // Incident Response
    if (!answers['incident-response'] || answers['incident-response'] === 'incident-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Develop and document a comprehensive incident response plan for security incidents involving PHI.',
      });
    } else if (['incident-informal', 'incident-documented'].includes(answers['incident-response'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Formalize and test your incident response plan with tabletop exercises or simulations.',
      });
    }
    
    // Audit Logs
    if (!answers['audit-logs'] || answers['audit-logs'] === 'logs-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement comprehensive audit logging for all systems that contain PHI.',
      });
    } else if (['logs-partial', 'logs-comprehensive'].includes(answers['audit-logs'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Enhance audit logging with active monitoring and alerting for suspicious activities.',
      });
    }
    
    // Device Security
    if (!answers['device-security'] || answers['device-security'] === 'devices-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement mobile device management and encryption for all devices accessing PHI.',
      });
    } else if (['devices-basic', 'devices-encryption-policies'].includes(answers['device-security'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Enhance mobile device security with a comprehensive MDM solution and device policies.',
      });
    }
    
    // Emergency Access
    if (!answers['emergency-access'] || answers['emergency-access'] === 'emergency-none') {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Develop emergency access procedures for critical PHI during system downtime.',
      });
    } else if (['emergency-informal', 'emergency-documented'].includes(answers['emergency-access'])) {
      recommendations.push({
        priority: 'low' as const,
        text: 'Formalize and regularly test your emergency access procedures.',
      });
    }
    
    return {
      score,
      maxScore,
      percentage,
      recommendations,
    };
  };

  const handleComplete = (result: AssessmentResult) => {
    if (!import.meta.env.PROD) {
      console.log('Assessment completed:', result);
    }
    // Mark Step 1 as completed
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    setAssessmentResult(result);
  };

  const handleFormSubmit = (data: AssessmentFormData) => {
    setAssessmentInfo(data);
    setShowForm(false);
    setShowAssessment(true);
  };

  const regulatoryFrameworks = [
    {
      title: "HIPAA Privacy Rule (45 CFR §164.500-§164.534)",
      description: "Protects the privacy of individually identifiable health information",
      icon: <Eye className="h-5 w-5" />,
      color: "text-primary-500",
      requirements: [
        "Notice of Privacy Practices",
        "Individual Rights (access, amendment, restriction)",
        "Uses and Disclosures",
        "Minimum Necessary Standard",
        "Administrative Requirements"
      ]
    },
    {
      title: "HIPAA Security Rule (45 CFR §164.302-§164.318)", 
      description: "Protects electronic protected health information (ePHI)",
      icon: <Lock className="h-5 w-5" />,
      color: "text-secondary-500",
      requirements: [
        "Administrative Safeguards",
        "Physical Safeguards", 
        "Technical Safeguards",
        "Risk Assessment and Management",
        "Contingency Planning"
      ]
    },
    {
      title: "HIPAA Breach Notification Rule (45 CFR §164.400-§164.414)",
      description: "Requirements for breach notification and response",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-accent-500",
      requirements: [
        "Breach Discovery and Assessment",
        "Individual Notification (60 days)",
        "HHS Notification",
        "Media Notification (500+ individuals)",
        "Documentation Requirements"
      ]
    },
    {
      title: "HIPAA Enforcement Rule (45 CFR §160.300-§160.426)",
      description: "Investigation procedures and penalty structures",
      icon: <FileText className="h-5 w-5" />,
      color: "text-success-500",
      requirements: [
        "Compliance and Investigation Procedures",
        "Civil Monetary Penalties",
        "Corrective Action Plans",
        "Settlement Procedures",
        "Hearing Procedures"
      ]
    }
  ];

  const questionMapping = [
    {
      question: "Risk Assessment (Question 1)",
      regulations: ["Security Rule §164.308(a)(1)", "Security Rule §164.306(a)"],
      description: "Required implementation specification for conducting security risk assessments"
    },
    {
      question: "Policies and Procedures (Question 2)", 
      regulations: ["Security Rule §164.316(a)", "Privacy Rule §164.530(i)"],
      description: "Administrative requirements for documented policies and procedures"
    },
    {
      question: "Employee Training (Question 3)",
      regulations: ["Security Rule §164.308(a)(5)", "Privacy Rule §164.530(b)"],
      description: "Required workforce training on HIPAA requirements"
    },
    {
      question: "Encryption Controls (Question 4)",
      regulations: ["Security Rule §164.312(a)(2)(iv)", "Security Rule §164.312(e)(2)(ii)"],
      description: "Addressable implementation specification for encryption"
    },
    {
      question: "Access Controls (Question 5)",
      regulations: ["Security Rule §164.308(a)(4)", "Security Rule §164.312(a)(1)"],
      description: "Required specification for information access management"
    },
    {
      question: "Business Associate Agreements (Question 6)",
      regulations: ["Privacy Rule §164.502(e)", "Security Rule §164.308(b)"],
      description: "Required contracts with business associates handling PHI"
    },
    {
      question: "Incident Response Planning (Question 7)",
      regulations: ["Security Rule §164.308(a)(6)", "Breach Notification §164.408"],
      description: "Required contingency plan and breach response procedures"
    },
    {
      question: "Audit Controls (Question 8)",
      regulations: ["Security Rule §164.312(b)"],
      description: "Required implementation specification for audit controls"
    },
    {
      question: "Device Security (Question 9)",
      regulations: ["Security Rule §164.310(d)", "Security Rule §164.312(a)(2)(iii)"],
      description: "Required safeguards for workstations and mobile devices"
    },
    {
      question: "Emergency Access Procedures (Question 10)",
      regulations: ["Security Rule §164.312(a)(2)(ii)", "Security Rule §164.308(a)(7)"],
      description: "Addressable specification for emergency access procedures"
    }
  ];

  // If showing form
  if (showForm) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <ShieldCheck className="h-16 w-16 text-primary-500 mx-auto mb-4" />
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Assessment Setup
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please provide some basic information before starting your HIPAA compliance assessment.
              </p>
            </div>
            
            <AssessmentForm 
              onSubmit={handleFormSubmit}
              initialData={{ assessmentType: 'hipaa-compliance' }}
            />
            
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                ← Back to Overview
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If showing assessment engine
  if (showAssessment) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Journey Progress */}
          <div className="max-w-4xl mx-auto mb-8">
            <JourneyProgress 
              currentStep={1} 
              completedSteps={completedSteps as (1 | 2 | 3 | 4)[]}
              variant="full"
            />
          </div>

          {assessmentInfo && (
            <div className="max-w-3xl mx-auto mb-8">
              <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-primary-800 dark:text-primary-200">
                      Assessment for: {assessmentInfo.organizationName}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Conducted by: {assessmentInfo.conductedBy} • Type: {assessmentInfo.assessmentType}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowAssessment(false);
                      setShowForm(true);
                    }}
                  >
                    Edit Info
                  </Button>
                </div>
              </Card>
            </div>
          )}
          
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="h-16 w-16 text-primary-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('hipaa.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('hipaa.subtitle')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Step 1 of 4: Assess your current compliance state
            </p>
          </div>

          <AssessmentEngine
            title={t('hipaa.self_assessment')}
            description={t('hipaa.description')}
            questions={hipaaQuestions}
            calculateResults={calculateResults}
            onComplete={handleComplete}
          />
          
          {/* Contextual CTA after assessment - Show only if assessment is complete */}
          {assessmentResult && (
            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
                <div className="text-center mb-6">
                  <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Step 1 Complete! 🎉
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your compliance score: <strong className="text-primary-600 dark:text-primary-400">{assessmentResult.percentage}%</strong>
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Recommended Next Step:
                  </h4>
                  {assessmentResult.percentage < 50 ? (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Based on your assessment, you have significant compliance gaps. We recommend starting with <strong>Step 2: Map Your Systems</strong> to identify critical technology dependencies that need attention.
                    </p>
                  ) : assessmentResult.percentage < 75 ? (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You have a solid foundation, but there's room for improvement. Continue to <strong>Step 2: Map Your Systems</strong> to understand how your technology infrastructure supports compliance.
                    </p>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Excellent compliance score! To maintain and strengthen your position, proceed to <strong>Step 2: Map Your Systems</strong> to ensure your technology dependencies are properly secured.
                    </p>
                  )}
                  
                  <Link to="/dependency-manager">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto"
                      icon={<ArrowRight className="h-5 w-5" />}
                      iconPosition="right"
                    >
                      Continue to Step 2: Map Your Systems
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContextualCTA
                    title="Download Resources"
                    description="Access templates and guides based on your assessment"
                    primaryAction={{
                      text: "View Toolkit",
                      href: "/toolkit",
                      trackingLabel: "post-assessment-toolkit"
                    }}
                    variant="minimal"
                  />
                  <ContextualCTA
                    title="Need Help?"
                    description="Get expert guidance on implementing recommendations"
                    primaryAction={{
                      text: "Contact Support",
                      href: "/contact",
                      trackingLabel: "post-assessment-support"
                    }}
                    variant="minimal"
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
        
        {/* Related Resources Sidebar */}
        {!assessmentResult && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <RelatedLinks 
              links={[
                { title: 'Dependency Manager', path: '/dependency-manager', description: 'Map your critical systems', icon: 'Server', category: 'Technical' },
                { title: 'Business Impact Analysis', path: '/business-impact', description: 'Assess potential impacts', icon: 'BarChart', category: 'Planning' },
                { title: 'Resource Toolkit', path: '/toolkit', description: 'Download templates and guides', icon: 'Download', category: 'Resources' }
              ]}
              title="Continue Your Compliance Journey"
              variant="inline"
              showCategory={true}
            />
          </div>
        )}
      </div>
    );
  }

  // Show overview page (default state)
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-16 w-16 text-primary-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            HIPAA Compliance Assessment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive evaluation tool that assesses your organization's compliance with federal healthcare privacy and security regulations.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  Assessment Overview
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
                  This assessment evaluates your organization across <strong>10 critical areas</strong> of HIPAA compliance, 
                  covering all major requirements from the Privacy, Security, and Breach Notification Rules.
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  <strong>Duration:</strong> 15-20 minutes | <strong>Questions:</strong> 10 | <strong>Results:</strong> Immediate scoring with detailed recommendations
                </p>
              </div>
            </div>
          </div>
          
          {/* Strategic Internal Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              to="/training"
              className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
              data-analytics="pre-assessment-link"
              data-link-destination="/training"
              aria-label="Access HIPAA training modules to strengthen your knowledge before assessment"
            >
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary-500" />
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  HIPAA Training
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Strengthen your compliance knowledge with interactive training modules
              </p>
            </Link>

            <Link
              to="/toolkit"
              className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
              data-analytics="pre-assessment-link"
              data-link-destination="/toolkit"
              aria-label="Download HIPAA compliance templates and implementation resources"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Download className="h-5 w-5 text-primary-500" />
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Compliance Resources
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access templates, policies, and implementation guides
              </p>
            </Link>
            
            <Link 
              to="/dependency-manager"
              className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
              data-analytics="pre-assessment-link"
              data-link-destination="/dependency-manager"
              aria-label="Map and secure your critical healthcare technology systems"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Server className="h-5 w-5 text-primary-500" />
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Technology Assessment
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Evaluate and secure your critical system infrastructure
              </p>
            </Link>
          </div>
        </div>

        {/* Regulatory Coverage */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white text-center mb-8">
            Regulatory Requirements Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regulatoryFrameworks.map((framework) => (
              <Card key={framework.title} className="p-6">
                <div className="flex items-start mb-4">
                  <div className={`${framework.color} mt-1 mr-3`}>
                    {framework.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {framework.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {framework.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {framework.requirements.map((requirement) => (
                    <div key={requirement} className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Question Mapping */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white text-center mb-8">
            Assessment Question Mapping
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              {questionMapping.map((mapping) => (
                <div key={mapping.question} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {mapping.question}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {mapping.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mapping.regulations.map((regulation) => (
                          <span
                            key={regulation}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200"
                          >
                            {regulation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Assessment Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white text-center mb-8">
            What You'll Receive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Compliance Score
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Percentage-based score showing your current compliance level across all HIPAA requirements
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-secondary-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Detailed Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Prioritized action items with specific steps to improve your compliance posture
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Implementation Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Downloadable report with timeline and resources for addressing identified gaps
              </p>
            </Card>
          </div>
        </div>

        {/* Start Assessment Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
            className="px-8 py-4"
          >
            Start HIPAA Assessment
          </Button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Your responses are stored locally on your device for privacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default HIPAACheckPage;