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
  Heart,
  Stethoscope,
  Activity,
  Eye,
  Zap,
  Building
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AssessmentEngine from './AssessmentEngine';

const CISANISTRansomwareAssessment: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState(false);

  // CISA/NIST Framework-based questions specifically for healthcare
  const cisaNistQuestions = [
    // IDENTIFY Function - Asset Management
    {
      id: 'asset-inventory',
      text: 'How comprehensive is your healthcare IT asset inventory?',
      description: 'CISA/NIST Framework ID.AM-1: Physical devices and systems within the organization are inventoried',
      options: [
        { id: 'asset-none', text: 'No formal asset inventory', value: 0 },
        { id: 'asset-basic', text: 'Basic inventory of major systems', value: 2 },
        { id: 'asset-detailed', text: 'Detailed inventory including medical devices', value: 4 },
        { id: 'asset-comprehensive', text: 'Comprehensive inventory with real-time updates', value: 5 }
      ]
    },
    {
      id: 'medical-device-security',
      text: 'How are medical devices secured and monitored?',
      description: 'Healthcare-specific: Medical devices are critical infrastructure requiring special protection',
      options: [
        { id: 'devices-unsecured', text: 'Medical devices not secured', value: 0 },
        { id: 'devices-basic', text: 'Basic network isolation', value: 2 },
        { id: 'devices-monitored', text: 'Network isolation with monitoring', value: 3 },
        { id: 'devices-advanced', text: 'Advanced security controls and continuous monitoring', value: 5 }
      ]
    },

    // PROTECT Function - Access Control
    {
      id: 'access-control-healthcare',
      text: 'What access controls protect PHI and clinical systems?',
      description: 'CISA/NIST Framework PR.AC-1: Identities and credentials are issued, managed, verified, revoked, and audited',
      options: [
        { id: 'access-shared', text: 'Shared accounts and passwords', value: 0 },
        { id: 'access-individual', text: 'Individual accounts with basic passwords', value: 2 },
        { id: 'access-mfa', text: 'Individual accounts with MFA', value: 4 },
        { id: 'access-privileged', text: 'Privileged access management with MFA', value: 5 }
      ]
    },
    {
      id: 'phi-encryption',
      text: 'How is PHI protected through encryption?',
      description: 'HIPAA Security Rule: PHI must be encrypted in transit and at rest',
      options: [
        { id: 'encryption-none', text: 'No encryption implemented', value: 0 },
        { id: 'encryption-transit', text: 'Encryption in transit only', value: 2 },
        { id: 'encryption-both', text: 'Encryption in transit and at rest', value: 4 },
        { id: 'encryption-comprehensive', text: 'Comprehensive encryption with key management', value: 5 }
      ]
    },

    // PROTECT Function - Data Security
    {
      id: 'backup-strategy-healthcare',
      text: 'What is your PHI backup and recovery strategy?',
      description: 'CISA/NIST Framework PR.DS-4: Adequate capacity to ensure availability is maintained',
      options: [
        { id: 'backup-none', text: 'No formal backup strategy', value: 0 },
        { id: 'backup-local', text: 'Local backups only', value: 1 },
        { id: 'backup-cloud', text: 'Cloud backups with encryption', value: 3 },
        { id: 'backup-immutable', text: 'Immutable, air-gapped backups with testing', value: 5 }
      ]
    },
    {
      id: 'data-loss-prevention',
      text: 'How do you prevent unauthorized PHI access or exfiltration?',
      description: 'CISA/NIST Framework PR.DS-5: Protections against data leaks are implemented',
      options: [
        { id: 'dlp-none', text: 'No data loss prevention controls', value: 0 },
        { id: 'dlp-basic', text: 'Basic access controls only', value: 2 },
        { id: 'dlp-advanced', text: 'DLP solution with monitoring', value: 4 },
        { id: 'dlp-comprehensive', text: 'Comprehensive DLP with behavioral analytics', value: 5 }
      ]
    },

    // PROTECT Function - Network Security
    {
      id: 'network-segmentation-healthcare',
      text: 'How is your healthcare network segmented?',
      description: 'CISA/NIST Framework PR.AC-5: Network integrity is protected',
      options: [
        { id: 'network-flat', text: 'Flat network with no segmentation', value: 0 },
        { id: 'network-vlan', text: 'Basic VLAN segmentation', value: 2 },
        { id: 'network-micro', text: 'Micro-segmentation with firewalls', value: 4 },
        { id: 'network-zero-trust', text: 'Zero-trust architecture implementation', value: 5 }
      ]
    },
    {
      id: 'wireless-security',
      text: 'How are wireless networks secured in clinical areas?',
      description: 'Healthcare-specific: Wireless networks must protect patient data and medical devices',
      options: [
        { id: 'wireless-open', text: 'Open or weakly secured wireless', value: 0 },
        { id: 'wireless-wpa', text: 'WPA2 with basic security', value: 2 },
        { id: 'wireless-wpa3', text: 'WPA3 with enterprise authentication', value: 4 },
        { id: 'wireless-secure', text: 'Secure wireless with device authentication', value: 5 }
      ]
    },

    // DETECT Function - Monitoring
    {
      id: 'security-monitoring-healthcare',
      text: 'What security monitoring covers your healthcare systems?',
      description: 'CISA/NIST Framework DE.CM-1: Network and system activities are monitored',
      options: [
        { id: 'monitoring-none', text: 'No security monitoring', value: 0 },
        { id: 'monitoring-basic', text: 'Basic log monitoring', value: 2 },
        { id: 'monitoring-siem', text: 'SIEM with healthcare-specific rules', value: 4 },
        { id: 'monitoring-soar', text: 'SOAR with automated healthcare response', value: 5 }
      ]
    },
    {
      id: 'anomaly-detection',
      text: 'How do you detect unusual access patterns to PHI?',
      description: 'CISA/NIST Framework DE.CM-3: Personnel activity is monitored',
      options: [
        { id: 'anomaly-none', text: 'No anomaly detection', value: 0 },
        { id: 'anomaly-manual', text: 'Manual log review', value: 1 },
        { id: 'anomaly-automated', text: 'Automated anomaly detection', value: 3 },
        { id: 'anomaly-ai', text: 'AI-powered behavioral analytics', value: 5 }
      ]
    },

    // RESPOND Function - Incident Response
    {
      id: 'incident-response-healthcare',
      text: 'Do you have a healthcare-specific incident response plan?',
      description: 'CISA/NIST Framework RS.RP-1: Response plan is executed during or after a cybersecurity incident',
      options: [
        { id: 'response-none', text: 'No incident response plan', value: 0 },
        { id: 'response-generic', text: 'Generic IT incident response', value: 2 },
        { id: 'response-healthcare', text: 'Healthcare-specific response plan', value: 4 },
        { id: 'response-tested', text: 'Tested healthcare response plan', value: 5 }
      ]
    },
    {
      id: 'patient-safety-procedures',
      text: 'How do you maintain patient safety during cyber incidents?',
      description: 'Healthcare-specific: Patient safety is paramount during any cyber incident',
      options: [
        { id: 'safety-none', text: 'No patient safety procedures', value: 0 },
        { id: 'safety-basic', text: 'Basic manual procedures', value: 2 },
        { id: 'safety-detailed', text: 'Detailed downtime procedures', value: 4 },
        { id: 'safety-comprehensive', text: 'Comprehensive safety protocols with training', value: 5 }
      ]
    },

    // RECOVER Function - Recovery Planning
    {
      id: 'recovery-planning-healthcare',
      text: 'What is your PHI recovery and business continuity plan?',
      description: 'CISA/NIST Framework RC.RP-1: Recovery plan is executed during or after a cybersecurity incident',
      options: [
        { id: 'recovery-none', text: 'No recovery planning', value: 0 },
        { id: 'recovery-basic', text: 'Basic IT recovery procedures', value: 2 },
        { id: 'recovery-healthcare', text: 'Healthcare-specific recovery plan', value: 4 },
        { id: 'recovery-comprehensive', text: 'Comprehensive plan with RTO/RPO targets', value: 5 }
      ]
    },
    {
      id: 'communication-plan',
      text: 'How do you communicate during a healthcare cyber incident?',
      description: 'CISA/NIST Framework RC.CO-1: Public relations are managed',
      options: [
        { id: 'comm-none', text: 'No communication plan', value: 0 },
        { id: 'comm-internal', text: 'Internal communication only', value: 2 },
        { id: 'comm-stakeholders', text: 'Stakeholder communication plan', value: 4 },
        { id: 'comm-comprehensive', text: 'Comprehensive communication with media plan', value: 5 }
      ]
    },

    // GOVERN Function - Risk Management
    {
      id: 'risk-assessment-healthcare',
      text: 'How often do you conduct cybersecurity risk assessments?',
      description: 'CISA/NIST Framework GV.RM-1: Cybersecurity risk management processes are established',
      options: [
        { id: 'risk-never', text: 'Never conducted', value: 0 },
        { id: 'risk-annual', text: 'Annual assessment', value: 2 },
        { id: 'risk-quarterly', text: 'Quarterly assessment', value: 4 },
        { id: 'risk-continuous', text: 'Continuous risk monitoring', value: 5 }
      ]
    },
    {
      id: 'vendor-risk-management',
      text: 'How do you assess cybersecurity risks from vendors and business associates?',
      description: 'HIPAA Business Associate Agreements require vendor risk assessment',
      options: [
        { id: 'vendor-none', text: 'No vendor risk assessment', value: 0 },
        { id: 'vendor-basic', text: 'Basic vendor questionnaires', value: 2 },
        { id: 'vendor-detailed', text: 'Detailed security assessments', value: 4 },
        { id: 'vendor-continuous', text: 'Continuous vendor monitoring', value: 5 }
      ]
    },

    // Additional Healthcare-Specific Controls
    {
      id: 'email-security-healthcare',
      text: 'What email security protects against healthcare-targeted phishing?',
      description: 'Healthcare organizations are prime targets for phishing attacks',
      options: [
        { id: 'email-none', text: 'No email security', value: 0 },
        { id: 'email-basic', text: 'Basic spam filtering', value: 2 },
        { id: 'email-advanced', text: 'Advanced threat protection', value: 4 },
        { id: 'email-comprehensive', text: 'Comprehensive email security with sandboxing', value: 5 }
      ]
    },
    {
      id: 'patch-management-healthcare',
      text: 'How are critical healthcare systems patched and updated?',
      description: 'CISA/NIST Framework PR.MA-1: Maintenance and repairs are performed',
      options: [
        { id: 'patch-manual', text: 'Manual patching only', value: 0 },
        { id: 'patch-scheduled', text: 'Scheduled patching', value: 2 },
        { id: 'patch-automated', text: 'Automated patch management', value: 4 },
        { id: 'patch-continuous', text: 'Continuous monitoring and patching', value: 5 }
      ]
    },
    {
      id: 'training-healthcare',
      text: 'How comprehensive is your cybersecurity training for healthcare staff?',
      description: 'CISA/NIST Framework PR.AT-1: All users are informed and trained',
      options: [
        { id: 'training-none', text: 'No cybersecurity training', value: 0 },
        { id: 'training-basic', text: 'Basic annual training', value: 2 },
        { id: 'training-regular', text: 'Regular training with simulations', value: 4 },
        { id: 'training-continuous', text: 'Continuous training with role-specific content', value: 5 }
      ]
    }
  ];

  const calculateCISANISTResults = (answers: Record<string, string>) => {
    let score = 0;
    const maxScore = cisaNistQuestions.length * 5;
    
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = cisaNistQuestions.find(q => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find(opt => opt.id === answerId);
        if (selectedOption) {
          score += selectedOption.value;
        }
      }
    });
    
    const percentage = Math.round((score / maxScore) * 100);
    
    const recommendations = [];
    
    // CISA/NIST Framework IDENTIFY recommendations
    if (!answers['asset-inventory'] || ['asset-none', 'asset-basic'].includes(answers['asset-inventory'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement comprehensive IT asset inventory including all medical devices (CISA/NIST ID.AM-1)',
        framework: 'IDENTIFY'
      });
    }
    
    if (!answers['medical-device-security'] || ['devices-unsecured', 'devices-basic'].includes(answers['medical-device-security'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Secure medical devices with network isolation and continuous monitoring (Healthcare-specific)',
        framework: 'IDENTIFY'
      });
    }

    // CISA/NIST Framework PROTECT recommendations
    if (!answers['access-control-healthcare'] || ['access-shared', 'access-individual'].includes(answers['access-control-healthcare'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Implement privileged access management with MFA for PHI access (CISA/NIST PR.AC-1)',
        framework: 'PROTECT'
      });
    }
    
    if (!answers['phi-encryption'] || ['encryption-none', 'encryption-transit'].includes(answers['phi-encryption'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Implement comprehensive PHI encryption in transit and at rest (HIPAA Security Rule)',
        framework: 'PROTECT'
      });
    }
    
    if (!answers['backup-strategy-healthcare'] || ['backup-none', 'backup-local'].includes(answers['backup-strategy-healthcare'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Implement immutable, air-gapped backup solution for PHI (CISA/NIST PR.DS-4)',
        framework: 'PROTECT'
      });
    }
    
    if (!answers['data-loss-prevention'] || ['dlp-none', 'dlp-basic'].includes(answers['data-loss-prevention'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Deploy data loss prevention solution to protect PHI (CISA/NIST PR.DS-5)',
        framework: 'PROTECT'
      });
    }
    
    if (!answers['network-segmentation-healthcare'] || ['network-flat', 'network-vlan'].includes(answers['network-segmentation-healthcare'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement network micro-segmentation to protect healthcare systems (CISA/NIST PR.AC-5)',
        framework: 'PROTECT'
      });
    }

    // CISA/NIST Framework DETECT recommendations
    if (!answers['security-monitoring-healthcare'] || ['monitoring-none', 'monitoring-basic'].includes(answers['security-monitoring-healthcare'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Deploy SIEM with healthcare-specific monitoring rules (CISA/NIST DE.CM-1)',
        framework: 'DETECT'
      });
    }
    
    if (!answers['anomaly-detection'] || ['anomaly-none', 'anomaly-manual'].includes(answers['anomaly-detection'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Implement automated anomaly detection for PHI access patterns (CISA/NIST DE.CM-3)',
        framework: 'DETECT'
      });
    }

    // CISA/NIST Framework RESPOND recommendations
    if (!answers['incident-response-healthcare'] || ['response-none', 'response-generic'].includes(answers['incident-response-healthcare'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Develop and test healthcare-specific incident response plan (CISA/NIST RS.RP-1)',
        framework: 'RESPOND'
      });
    }
    
    if (!answers['patient-safety-procedures'] || ['safety-none', 'safety-basic'].includes(answers['patient-safety-procedures'])) {
      recommendations.push({
        priority: 'critical' as const,
        text: 'Develop comprehensive patient safety procedures for cyber incidents (Healthcare-specific)',
        framework: 'RESPOND'
      });
    }

    // CISA/NIST Framework RECOVER recommendations
    if (!answers['recovery-planning-healthcare'] || ['recovery-none', 'recovery-basic'].includes(answers['recovery-planning-healthcare'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Develop healthcare-specific recovery plan with RTO/RPO targets (CISA/NIST RC.RP-1)',
        framework: 'RECOVER'
      });
    }
    
    if (!answers['communication-plan'] || ['comm-none', 'comm-internal'].includes(answers['communication-plan'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Develop comprehensive communication plan for cyber incidents (CISA/NIST RC.CO-1)',
        framework: 'RECOVER'
      });
    }

    // CISA/NIST Framework GOVERN recommendations
    if (!answers['risk-assessment-healthcare'] || ['risk-never', 'risk-annual'].includes(answers['risk-assessment-healthcare'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement continuous cybersecurity risk assessment process (CISA/NIST GV.RM-1)',
        framework: 'GOVERN'
      });
    }
    
    if (!answers['vendor-risk-management'] || ['vendor-none', 'vendor-basic'].includes(answers['vendor-risk-management'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Implement comprehensive vendor risk assessment program (HIPAA BAA requirements)',
        framework: 'GOVERN'
      });
    }

    // Additional recommendations
    if (!answers['email-security-healthcare'] || ['email-none', 'email-basic'].includes(answers['email-security-healthcare'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Deploy advanced email security with healthcare-specific threat protection',
        framework: 'PROTECT'
      });
    }
    
    if (!answers['patch-management-healthcare'] || ['patch-manual', 'patch-scheduled'].includes(answers['patch-management-healthcare'])) {
      recommendations.push({
        priority: 'high' as const,
        text: 'Implement automated patch management for critical healthcare systems (CISA/NIST PR.MA-1)',
        framework: 'PROTECT'
      });
    }
    
    if (!answers['training-healthcare'] || ['training-none', 'training-basic'].includes(answers['training-healthcare'])) {
      recommendations.push({
        priority: 'medium' as const,
        text: 'Implement continuous cybersecurity training with healthcare-specific content (CISA/NIST PR.AT-1)',
        framework: 'PROTECT'
      });
    }

    // Framework mapping for results
    const frameworkScores: Record<string, number> = {
      'IDENTIFY': 0,
      'PROTECT': 0,
      'DETECT': 0,
      'RESPOND': 0,
      'RECOVER': 0,
      'GOVERN': 0
    };

    recommendations.forEach(rec => {
      if (rec.framework && frameworkScores.hasOwnProperty(rec.framework)) {
        frameworkScores[rec.framework]++;
      }
    });

    return {
      score,
      maxScore,
      percentage,
      recommendations: recommendations.map(rec => ({
        priority: rec.priority === 'critical' ? 'high' : rec.priority,
        text: rec.text
      }))
    };
  };

  if (showAssessment) {
    return (
      <AssessmentEngine
        title="CISA/NIST Ransomware Readiness Assessment for Healthcare"
        description="Comprehensive assessment based on CISA/NIST Cybersecurity Framework specifically tailored for healthcare organizations"
        questions={cisaNistQuestions}
        calculateResults={calculateCISANISTResults}
        onComplete={() => setShowAssessment(false)}
      />
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Shield className="h-16 w-16 text-blue-600" />
              <Heart className="h-16 w-16 text-red-500" />
              <AlertTriangle className="h-16 w-16 text-orange-500" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              CISA #StopRansomware Assessment
            </h1>
            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">
              Healthcare Sector Implementation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-4xl mx-auto">
              Official CISA #StopRansomware Guide assessment tailored for healthcare organizations, implementing prevention best practices and response procedures aligned with CISA's Cross-Sector Cybersecurity Performance Goals (CPGs).
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4 mr-2" />
              Official CISA #StopRansomware Guide
            </div>
          </div>

          {/* CISA/NIST Framework Overview */}
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                CISA/NIST Cybersecurity Framework for Healthcare
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">IDENTIFY</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Asset Management</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">PROTECT</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Access Control</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Activity className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">DETECT</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Monitoring</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Zap className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-red-900 dark:text-red-100">RESPOND</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">Incident Response</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">RECOVER</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Recovery Planning</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Building className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">GOVERN</h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">Risk Management</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <Stethoscope className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Healthcare-Specific Assessment Areas
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Medical Device Security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>PHI Encryption & Protection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>Patient Safety Procedures</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Network className="h-4 w-4 text-purple-500" />
                  <span>Clinical Network Segmentation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-orange-500" />
                  <span>HIPAA Compliance Controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span>Business Associate Risk</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-pink-500" />
                  <span>Anomaly Detection for PHI</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-teal-500" />
                  <span>Healthcare Recovery Planning</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                CISA/NIST Compliance Benefits
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Framework-aligned recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>HIPAA compliance mapping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Healthcare-specific controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Regulatory compliance guidance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Patient safety prioritization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Medical device security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Vendor risk assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Exportable compliance report</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Healthcare Ransomware Statistics */}
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Healthcare Ransomware Impact Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">$10.93M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Healthcare Ransomware Cost (2023)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">78%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Of Healthcare Organizations Affected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">24 Days</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Recovery Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">45%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Experience Patient Safety Impact</div>
                </div>
              </div>
            </Card>
          </div>

          {/* CISA/NIST References */}
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Framework References & Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">CISA Resources</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Ransomware Readiness Assessment (RRA)</li>
                    <li>• StopRansomware Guide</li>
                    <li>• Cyber Hygiene Services</li>
                    <li>• Healthcare Sector Cybersecurity Framework</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">NIST Resources</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Cybersecurity Framework (CSF) 2.0</li>
                    <li>• HIPAA Security Rule Toolkit</li>
                    <li>• Healthcare Cybersecurity Guide</li>
                    <li>• Risk Management Framework</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setShowAssessment(true)}
              size="lg"
              icon={<Shield className="h-5 w-5" />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start CISA/NIST Healthcare Assessment
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Based on CISA/NIST Cybersecurity Framework 2.0 and healthcare-specific requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CISANISTRansomwareAssessment;
