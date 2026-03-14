import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Database, 
  Network, 
  Users, 
  Clock,
  CheckCircle,
  FileText,
  Server,
  HardDrive
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AssessmentEngine from './AssessmentEngine';

const RansomwareAssessment: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState(false);

  const ransomwareQuestions = [
    {
      id: 'backup-strategy',
      text: 'What is your current backup strategy?',
      description: 'Assess the resilience of your backup systems against ransomware attacks',
      options: [
        { id: 'backup-none', text: 'No formal backup strategy', value: 0 },
        { id: 'backup-basic', text: 'Basic local backups only', value: 1 },
        { id: 'backup-cloud', text: 'Cloud backups with some protection', value: 3 },
        { id: 'backup-immutable', text: 'Immutable, air-gapped backups', value: 5 }
      ]
    },
    {
      id: 'network-segmentation',
      text: 'How is your network segmented?',
      description: 'Network segmentation helps contain ransomware spread',
      options: [
        { id: 'network-none', text: 'No network segmentation', value: 0 },
        { id: 'network-basic', text: 'Basic VLAN separation', value: 2 },
        { id: 'network-advanced', text: 'Advanced micro-segmentation', value: 4 },
        { id: 'network-zero-trust', text: 'Zero-trust architecture', value: 5 }
      ]
    },
    {
      id: 'endpoint-protection',
      text: 'What endpoint protection do you have?',
      description: 'Endpoint security is critical for preventing ransomware',
      options: [
        { id: 'endpoint-none', text: 'No endpoint protection', value: 0 },
        { id: 'endpoint-basic', text: 'Basic antivirus only', value: 1 },
        { id: 'endpoint-edr', text: 'EDR/XDR solution', value: 3 },
        { id: 'endpoint-advanced', text: 'Advanced threat protection with AI', value: 5 }
      ]
    },
    {
      id: 'user-training',
      text: 'How often do you conduct security awareness training?',
      description: 'User training is essential for preventing phishing attacks',
      options: [
        { id: 'training-never', text: 'Never conducted', value: 0 },
        { id: 'training-annual', text: 'Annual training only', value: 1 },
        { id: 'training-quarterly', text: 'Quarterly training', value: 3 },
        { id: 'training-continuous', text: 'Continuous training with simulations', value: 5 }
      ]
    },
    {
      id: 'incident-response',
      text: 'Do you have a ransomware incident response plan?',
      description: 'Prepared response plans reduce recovery time and costs',
      options: [
        { id: 'response-none', text: 'No incident response plan', value: 0 },
        { id: 'response-basic', text: 'Basic incident response procedures', value: 2 },
        { id: 'response-detailed', text: 'Detailed ransomware-specific plan', value: 4 },
        { id: 'response-tested', text: 'Tested and regularly updated plan', value: 5 }
      ]
    },
    {
      id: 'access-controls',
      text: 'How are user access controls managed?',
      description: 'Proper access controls limit ransomware spread',
      options: [
        { id: 'access-none', text: 'No formal access controls', value: 0 },
        { id: 'access-basic', text: 'Basic user accounts and passwords', value: 1 },
        { id: 'access-mfa', text: 'Multi-factor authentication', value: 3 },
        { id: 'access-privileged', text: 'Privileged access management', value: 5 }
      ]
    },
    {
      id: 'email-security',
      text: 'What email security measures are in place?',
      description: 'Email is a common ransomware attack vector',
      options: [
        { id: 'email-none', text: 'No email security measures', value: 0 },
        { id: 'email-basic', text: 'Basic spam filtering', value: 1 },
        { id: 'email-advanced', text: 'Advanced threat protection', value: 3 },
        { id: 'email-comprehensive', text: 'Comprehensive email security suite', value: 5 }
      ]
    },
    {
      id: 'system-updates',
      text: 'How are system updates and patches managed?',
      description: 'Regular updates prevent exploitation of known vulnerabilities',
      options: [
        { id: 'updates-manual', text: 'Manual updates only', value: 0 },
        { id: 'updates-scheduled', text: 'Scheduled updates', value: 2 },
        { id: 'updates-automated', text: 'Automated patch management', value: 4 },
        { id: 'updates-continuous', text: 'Continuous monitoring and patching', value: 5 }
      ]
    },
    {
      id: 'monitoring-detection',
      text: 'What security monitoring and detection capabilities exist?',
      description: 'Early detection is crucial for ransomware prevention',
      options: [
        { id: 'monitoring-none', text: 'No security monitoring', value: 0 },
        { id: 'monitoring-basic', text: 'Basic log monitoring', value: 1 },
        { id: 'monitoring-siem', text: 'SIEM solution', value: 3 },
        { id: 'monitoring-soar', text: 'SOAR with automated response', value: 5 }
      ]
    },
    {
      id: 'vendor-security',
      text: 'How do you assess vendor security practices?',
      description: 'Third-party vendors can be attack vectors',
      options: [
        { id: 'vendor-none', text: 'No vendor security assessment', value: 0 },
        { id: 'vendor-basic', text: 'Basic vendor questionnaires', value: 1 },
        { id: 'vendor-detailed', text: 'Detailed security assessments', value: 3 },
        { id: 'vendor-continuous', text: 'Continuous vendor monitoring', value: 5 }
      ]
    }
  ];

  const calculateRansomwareResults = (answers: Record<string, string>) => {
    let score = 0;
    const maxScore = ransomwareQuestions.length * 5;
    
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = ransomwareQuestions.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === answerId);
        if (selectedOption) {
          score += selectedOption.value;
        }
      }
    });
    
    const percentage = Math.round((score / maxScore) * 100);
    
    const recommendations = [];
    
    // Backup recommendations
    if (!answers['backup-strategy'] || ['backup-none', 'backup-basic'].includes(answers['backup-strategy'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Implement immutable, air-gapped backup solution immediately. This is your primary defense against ransomware.',
      });
    }
    
    // Network segmentation recommendations
    if (!answers['network-segmentation'] || answers['network-segmentation'] === 'network-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement network segmentation to limit ransomware spread across your infrastructure.',
      });
    }
    
    // Endpoint protection recommendations
    if (!answers['endpoint-protection'] || ['endpoint-none', 'endpoint-basic'].includes(answers['endpoint-protection'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Deploy advanced endpoint detection and response (EDR) solution with behavioral analysis.',
      });
    }
    
    // Training recommendations
    if (!answers['user-training'] || ['training-never', 'training-annual'].includes(answers['user-training'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Implement regular security awareness training with phishing simulations for all staff.',
      });
    }
    
    // Incident response recommendations
    if (!answers['incident-response'] || answers['incident-response'] === 'response-none') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Develop and test a comprehensive ransomware incident response plan.',
      });
    }

    // Access control recommendations
    if (!answers['access-controls'] || ['access-none', 'access-basic'].includes(answers['access-controls'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement multi-factor authentication and privileged access management.',
      });
    }

    // Email security recommendations
    if (!answers['email-security'] || ['email-none', 'email-basic'].includes(answers['email-security'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Deploy advanced email security with threat protection and sandboxing.',
      });
    }

    // System update recommendations
    if (!answers['system-updates'] || answers['system-updates'] === 'updates-manual') {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement automated patch management system for all critical systems.',
      });
    }

    // Monitoring recommendations
    if (!answers['monitoring-detection'] || ['monitoring-none', 'monitoring-basic'].includes(answers['monitoring-detection'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Deploy SIEM solution with automated threat detection and response.',
      });
    }

    // Vendor security recommendations
    if (!answers['vendor-security'] || ['vendor-none', 'vendor-basic'].includes(answers['vendor-security'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Implement comprehensive vendor security assessment program.',
      });
    }
    
    return {
      score,
      maxScore,
      percentage,
      recommendations
    };
  };


  if (showAssessment) {
    return (
      <AssessmentEngine
        title="Ransomware Protection Assessment"
        description="Evaluate your organization's resilience against ransomware attacks"
        questions={ransomwareQuestions}
        calculateResults={calculateRansomwareResults}
        onComplete={() => setShowAssessment(false)}
      />
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Ransomware Protection Assessment
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Evaluate your organization's resilience against ransomware attacks and identify critical vulnerabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <Shield className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Assessment Areas
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Backup Strategy & Recovery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Network className="h-4 w-4" />
                  <span>Network Segmentation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Endpoint Protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>User Training & Awareness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Incident Response Planning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span>Access Controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Email Security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4" />
                  <span>System Updates</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What You'll Get
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Detailed vulnerability analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Prioritized recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Implementation timeline</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cost-benefit analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Compliance impact assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Risk level evaluation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Exportable assessment report</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Why Ransomware Assessment Matters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">$4.45M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Healthcare Ransomware Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">65%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Of Healthcare Organizations Affected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">21 Days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Recovery Time</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setShowAssessment(true)}
              size="lg"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              Start Ransomware Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RansomwareAssessment;

