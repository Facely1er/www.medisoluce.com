import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AssessmentEngine, { Question, AssessmentResult } from '../components/assessment/AssessmentEngine';
import AssessmentForm from '../components/forms/AssessmentForm';
import RelatedLinks from '../components/ui/RelatedLinks';
import ContextualCTA from '../components/ui/ContextualCTA';
import { ShieldCheck, CheckCircle, FileText, AlertTriangle, Users, Lock, Eye, ArrowRight, BookOpen, Download, Server } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HIPAACheckPage: React.FC = () => {
  const { t } = useTranslation();
  const [showAssessment, setShowAssessment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [assessmentInfo, setAssessmentInfo] = useState<Record<string, unknown> | null>(null);
  
  const hipaaQuestions: Question[] = [
    {
      id: 'risk-assessment',
      text: 'Has your organization conducted a comprehensive risk assessment within the last year?',
      description: 'HIPAA requires covered entities to conduct regular risk assessments to identify potential vulnerabilities to PHI.',
      options: [
        { id: 'risk-yes-comprehensive', text: 'Yes, we have conducted a comprehensive assessment that covers all systems and processes', value: 5 },
        { id: 'risk-yes-partial', text: 'Yes, but it was limited in scope or did not cover all systems', value: 3 },
        { id: 'risk-no-planned', text: 'No, but we have one planned', value: 1 },
        { id: 'risk-no', text: 'No, we have not conducted a risk assessment', value: 0 },
      ],
      regulations: ['Security Rule §164.308(a)(1)', 'Security Rule §164.306(a)'],
      frameworks: ['HIPAA Security Rule']
    },
    {
      id: 'policies-procedures',
      text: 'Does your organization have documented HIPAA policies and procedures?',
      description: 'Written policies and procedures are required to demonstrate compliance with HIPAA regulations.',
      options: [
        { id: 'policies-yes-comprehensive', text: 'Yes, comprehensive and regularly updated', value: 5 },
        { id: 'policies-yes-outdated', text: 'Yes, but they need updating', value: 3 },
        { id: 'policies-partial', text: 'We have some, but not all required policies', value: 2 },
        { id: 'policies-no', text: t('hipaa_assessment.options.policies_no'), value: 0 },
      ],
      regulations: ['Security Rule §164.316(a)', 'Privacy Rule §164.530(i)'],
      frameworks: ['HIPAA Security Rule', 'HIPAA Privacy Rule']
    },
    {
      id: 'employee-training',
      text: 'How frequently does your organization conduct HIPAA training for employees?',
      description: 'Regular training ensures staff understand their obligations for protecting patient information.',
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
      text: 'Is PHI encrypted at rest and in transit across your systems?',
      description: 'Encryption is an addressable implementation specification under the HIPAA Security Rule.',
      options: [
        { id: 'encryption-both', text: 'Yes, both at rest and in transit', value: 5 },
        { id: 'encryption-transit', text: 'Only in transit', value: 3 },
        { id: 'encryption-rest', text: 'Only at rest', value: 2 },
        { id: 'encryption-none', text: 'No encryption in place', value: 0 },
      ],
      regulations: ['Security Rule §164.312(a)(2)(iv)', 'Security Rule §164.312(e)(2)(ii)'],
      frameworks: ['HIPAA Security Rule']
    },
    {
      id: 'access-controls',
      text: 'How do you manage access controls to systems containing PHI?',
      description: 'Access controls ensure only authorized personnel can access protected health information.',
      options: [
        { id: 'access-rbac-audit', text: 'Role-based access with regular auditing and certification', value: 5 },
        { id: 'access-rbac', text: 'Role-based access controls without regular review', value: 3 },
        { id: 'access-basic', text: 'Basic username/password controls', value: 2 },
        { id: 'access-minimal', text: 'Minimal or no access controls', value: 0 },
      ],
    },
    {
      id: 'business-associates',
      text: 'Do you have Business Associate Agreements (BAAs) with all vendors who access PHI?',
      description: 'BAAs are required for all third parties that access, transmit, or store PHI on your behalf.',
      options: [
        { id: 'baa-all-reviewed', text: 'Yes, with all vendors and regularly reviewed', value: 5 },
        { id: 'baa-all', text: 'Yes, with all vendors', value: 4 },
        { id: 'baa-some', text: 'With some but not all vendors', value: 2 },
        { id: 'baa-none', text: 'No BAAs in place', value: 0 },
      ],
    },
    {
      id: 'incident-response',
      text: 'Does your organization have a tested incident response plan for data breaches?',
      description: 'A documented and tested plan is essential for proper response to security incidents.',
      options: [
        { id: 'incident-tested', text: 'Yes, documented and regularly tested', value: 5 },
        { id: 'incident-documented', text: 'Yes, documented but not tested', value: 3 },
        { id: 'incident-informal', text: 'Informal or partial plans exist', value: 2 },
        { id: 'incident-none', text: 'No incident response plan', value: 0 },
      ],
    },
    {
      id: 'audit-logs',
      text: 'Are audit logs maintained for systems containing PHI?',
      description: 'Audit logs help track who accessed PHI, when, and what actions were performed.',
      options: [
        { id: 'logs-comprehensive-monitored', text: 'Yes, comprehensive logs with active monitoring', value: 5 },
        { id: 'logs-comprehensive', text: 'Yes, comprehensive logs without active monitoring', value: 3 },
        { id: 'logs-partial', text: 'Partial or inconsistent logging', value: 2 },
        { id: 'logs-none', text: 'No audit logging in place', value: 0 },
      ],
    },
    {
      id: 'device-security',
      text: 'How do you secure mobile devices and workstations that access PHI?',
      description: 'Mobile device security is essential as healthcare becomes more mobile.',
      options: [
        { id: 'devices-mdm-encryption', text: 'MDM solution with encryption, remote wipe, and device policies', value: 5 },
        { id: 'devices-encryption-policies', text: 'Encryption and security policies without MDM', value: 3 },
        { id: 'devices-basic', text: 'Basic security measures (passwords only)', value: 2 },
        { id: 'devices-none', text: 'No specific mobile device security', value: 0 },
      ],
    },
    {
      id: 'emergency-access',
      text: 'Do you have procedures for emergency access to PHI during system downtime?',
      description: 'Emergency access procedures ensure continuity of patient care during system outages.',
      options: [
        { id: 'emergency-documented-tested', text: 'Yes, documented and regularly tested', value: 5 },
        { id: 'emergency-documented', text: 'Yes, documented but not tested', value: 3 },
        { id: 'emergency-informal', text: 'Informal procedures exist', value: 2 },
        { id: 'emergency-none', text: 'No emergency access procedures', value: 0 },
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
    // Here you could save the result, show additional UI, etc.
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
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
          </div>

          <AssessmentEngine
            title={t('hipaa.self_assessment')}
            description={t('hipaa.description')}
            questions={hipaaQuestions}
            calculateResults={calculateResults}
            onComplete={handleComplete}
          />
          
          {/* Contextual CTA after assessment */}
          <div className="mt-12">
            <ContextualCTA
              title="Ready to act on your assessment results?"
              description="Access our comprehensive toolkit with expert-designed templates, policies, and step-by-step implementation guides tailored to your assessment findings."
              primaryAction={{
                text: "Download Implementation Resources",
                href: "/toolkit",
                trackingLabel: "post-assessment-toolkit"
              }}
              secondaryAction={{
                text: "Get Expert Implementation Guidance",
                href: "/contact",
                trackingLabel: "post-assessment-consultation"
              }}
              variant="gradient"
              showBenefit={true}
              benefit="Most users see 40% improvement in compliance scores within 90 days of implementing our recommendations"
            />
          </div>
        </div>
        
        {/* Related Resources Sidebar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <RelatedLinks 
            links={[
              { title: 'Dependency Manager', url: '/dependency-manager', description: 'Map your critical systems' },
              { title: 'Business Impact Analysis', url: '/business-impact', description: 'Assess potential impacts' },
              { title: 'Resource Toolkit', url: '/toolkit', description: 'Download templates and guides' }
            ]}
            title="Continue Your Compliance Journey"
            variant="inline"
            showCategory={true}
          />
        </div>
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