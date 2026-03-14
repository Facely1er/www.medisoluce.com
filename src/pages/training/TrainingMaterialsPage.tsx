import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Download, ExternalLink, ChevronLeft,
  Shield, Server, LifeBuoy, AlertTriangle, FileText, CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';

interface MaterialItem {
  title: string;
  description: string;
  type: 'guide' | 'template' | 'checklist' | 'reference';
  toolkitPath?: string;
}

interface ModuleMaterials {
  icon: React.ReactNode;
  color: string;
  overview: string;
  keyTopics: string[];
  materials: MaterialItem[];
  relatedTools: { label: string; path: string }[];
}

const materialsByModule: Record<string, ModuleMaterials> = {
  'hipaa-basics': {
    icon: <Shield className="h-8 w-8 text-primary-500" />,
    color: 'primary',
    overview:
      'The HIPAA Compliance Fundamentals module covers the Privacy Rule, Security Rule, Breach Notification Rule, and Patient Rights. These study materials reinforce the core concepts and provide practical tools for daily compliance.',
    keyTopics: [
      'Protected Health Information (PHI) — the 18 identifiers',
      'Administrative, Physical, and Technical Safeguards',
      'Breach notification four-factor analysis',
      'Patient rights: access, amendment, restrictions, accounting',
    ],
    materials: [
      {
        title: 'HIPAA Privacy Policy Template',
        description: 'Comprehensive template for creating a HIPAA-compliant privacy policy. Covers permitted uses, patient rights, and minimum necessary standards.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Breach Response Checklist',
        description: 'Step-by-step checklist for responding to a data breach — from containment through patient notification and HHS reporting.',
        type: 'checklist',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Business Associate Agreement Template',
        description: 'Standard BAA template covering permitted uses, safeguard obligations, breach notification, and PHI return/destruction at termination.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Staff Training Record Form',
        description: 'Track HIPAA compliance training completions, dates, and scores for all workforce members.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'PHI Identifier Reference Card',
        description: 'Quick reference listing all 18 HIPAA identifiers with examples of each. Ideal for front-desk and clinical staff.',
        type: 'reference',
      },
      {
        title: 'Patient Rights Quick Guide',
        description: 'One-page summary of the 6 patient rights with timelines: access (30 days), amendment (60 days), accounting (60 days).',
        type: 'guide',
      },
    ],
    relatedTools: [
      { label: 'Run HIPAA Assessment', path: '/hipaa-check' },
      { label: 'Comprehensive Assessment', path: '/comprehensive-assessment' },
      { label: 'Download All Templates', path: '/toolkit' },
    ],
  },
  'dependency-management': {
    icon: <Server className="h-8 w-8 text-secondary-500" />,
    color: 'secondary',
    overview:
      'The Technology Dependency Management module covers mapping, risk assessment, vendor management, and lifecycle planning for healthcare systems. Use these materials to build and maintain your dependency management program.',
    keyTopics: [
      'Hard, soft, and circular dependencies',
      'Risk scoring: Impact × Likelihood framework',
      'Maximum Tolerable Downtime (MTD) definition',
      'Vendor BAA requirements and tier classification',
      'End-of-life planning and lifecycle governance',
    ],
    materials: [
      {
        title: 'Technology Dependency Mapping Template',
        description: 'Structured template for documenting system dependencies, criticality ratings, vendor contacts, and backup procedures.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Vendor Risk Assessment Worksheet',
        description: 'Tier-based vendor risk assessment covering BAA status, security certifications, SLA terms, and annual review tracking.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Risk Scoring Matrix',
        description: 'Visual 5×5 risk matrix for scoring system risk by impact (patient care, operational, financial, compliance) and likelihood.',
        type: 'reference',
      },
      {
        title: 'MTD Reference Table',
        description: 'Healthcare-specific Maximum Tolerable Downtime reference values for 15+ common clinical and administrative systems.',
        type: 'reference',
      },
      {
        title: 'Technology Lifecycle Register Template',
        description: 'Track every system\'s current version, EOL date, lifecycle phase, and remediation plan.',
        type: 'template',
      },
      {
        title: 'Vendor Offboarding Checklist',
        description: 'Step-by-step process for safely terminating a vendor relationship: PHI destruction, access revocation, BAA termination, documentation.',
        type: 'checklist',
      },
    ],
    relatedTools: [
      { label: 'Open Dependency Manager', path: '/dependency-manager' },
      { label: 'Business Impact Analysis', path: '/business-impact' },
      { label: 'Download All Templates', path: '/toolkit' },
    ],
  },
  'business-continuity': {
    icon: <LifeBuoy className="h-8 w-8 text-success-500" />,
    color: 'success',
    overview:
      'The Business Continuity Planning module covers BCP frameworks, emergency response, recovery objectives, and plan testing. These materials support building and maintaining a healthcare-grade continuity program.',
    keyTopics: [
      'BCP vs. DRP vs. EOP — understanding the differences',
      'HIPAA §164.308(a)(7) contingency plan requirements',
      'RTO and RPO definition and validation',
      'Hospital Incident Command System (HICS) roles',
      'Tabletop and DR failover exercise types',
    ],
    materials: [
      {
        title: 'Continuity Plan Template for Healthcare',
        description: 'Comprehensive BCP template with sections for risk assessment, recovery strategies, activation procedures, communication plan, and appendices.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'BIA Worksheet for Healthcare',
        description: 'Business Impact Analysis worksheet capturing MTD, daily revenue at risk, patient care impact scores, and system prioritization.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'EHR Downtime Procedures Template',
        description: 'Step-by-step EHR downtime procedures covering activation, paper workflows, departmental procedures, and restoration/reconciliation.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Department Downtime Quick Reference Card',
        description: 'One-page laminated card template for each department with immediate actions, contact numbers, and form locations.',
        type: 'template',
      },
      {
        title: 'Tabletop Exercise Facilitator Guide',
        description: 'Complete guide for running a ransomware or EHR downtime tabletop exercise: scenario injects, facilitation questions, gap documentation.',
        type: 'guide',
      },
      {
        title: 'BCP Testing Record Form',
        description: 'Standardized form for documenting BCP exercises: participants, scenario, findings, remediation actions, and sign-off.',
        type: 'template',
      },
    ],
    relatedTools: [
      { label: 'Open Continuity Planner', path: '/continuity' },
      { label: 'Business Impact Analysis', path: '/business-impact' },
      { label: 'Download All Templates', path: '/toolkit' },
    ],
  },
  'ransomware-protection': {
    icon: <AlertTriangle className="h-8 w-8 text-accent-500" />,
    color: 'accent',
    overview:
      'The Ransomware Protection module covers attack vectors, defense-in-depth, incident response, PHI breach assessment, and recovery procedures. Use these materials to build and test your ransomware resilience program.',
    keyTopics: [
      'Top 4 healthcare ransomware attack vectors',
      'Defense-in-depth: MFA, EDR, backup immutability',
      '3-2-1-1-0 backup strategy',
      'HIPAA breach determination for ransomware incidents',
      'Recovery runbook and medication reconciliation',
    ],
    materials: [
      {
        title: 'Ransomware Response Playbook',
        description: 'Detailed playbook covering all four phases: containment (0–4h), investigation (4–72h), eradication/recovery, and post-incident review.',
        type: 'template',
        toolkitPath: '/toolkit',
      },
      {
        title: 'PHI Breach Assessment Form (Ransomware)',
        description: 'Four-factor HIPAA breach analysis form specifically designed for ransomware incidents — includes exfiltration evidence checklist.',
        type: 'template',
      },
      {
        title: 'Patient Data Backup Strategy Guide',
        description: 'Comprehensive guide for implementing the 3-2-1-1-0 backup strategy with healthcare-specific recommendations for immutable backup solutions.',
        type: 'guide',
        toolkitPath: '/toolkit',
      },
      {
        title: 'Ransomware Incident Response Contacts Template',
        description: 'Pre-populated contacts template: FBI Cyber, CISA, HHS 405(d), cyber insurance carrier, IR retainer, legal counsel.',
        type: 'template',
      },
      {
        title: 'Security Hardening Checklist',
        description: 'Prioritized list of 25 security controls proven to reduce ransomware risk — from MFA implementation to Active Directory hardening.',
        type: 'checklist',
      },
      {
        title: 'Ransomware Tabletop Scenario Pack',
        description: 'Three complete tabletop exercise scenarios (phishing entry, RDP compromise, supply chain attack) with inject sequences and facilitation guides.',
        type: 'guide',
      },
    ],
    relatedTools: [
      { label: 'Ransomware Assessment', path: '/ransomware-assessment' },
      { label: 'Threat Dashboard', path: '/ransomware-threat-dashboard' },
      { label: 'Download All Templates', path: '/toolkit' },
    ],
  },
};

const typeLabels: Record<string, { label: string; color: string }> = {
  guide: { label: 'Guide', color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' },
  template: { label: 'Template', color: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300' },
  checklist: { label: 'Checklist', color: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' },
  reference: { label: 'Reference', color: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300' },
};

const TrainingMaterialsPage: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const materials = materialsByModule[moduleId || ''];
  const moduleTitle = t(
    `training.modules.${moduleId?.replace(/-/g, '_')}.title`,
    { defaultValue: moduleId?.replace(/-/g, ' ') || 'Training Module' }
  );

  if (!materials) {
    return (
      <div className="py-8 min-w-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <Card className="p-8 text-center max-w-lg mx-auto">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Materials Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Study materials for this module are not yet available.
            </p>
            <Button onClick={() => navigate('/training')}>Back to Training</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-w-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="max-w-5xl mx-auto min-w-0">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 min-w-0">
            <div className="flex items-center space-x-4 min-w-0">
              <span className="flex-shrink-0">{materials.icon}</span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-white break-words">
                  Study Materials
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1 break-words">
                  {moduleTitle}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/training/${moduleId}/0`)}
              icon={<ChevronLeft className="h-4 w-4" />}
              className="flex-shrink-0 self-start sm:self-center"
            >
              Back to Module
            </Button>
          </div>

          {/* Overview */}
          <Card className="p-6 mb-8 min-w-0 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-500 flex-shrink-0" />
              Module Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 break-words">
              {materials.overview}
            </p>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Key Topics Covered:
              </h3>
              <ul className="space-y-2">
                {materials.keyTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Study Materials */}
          <div className="mb-8">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary-500" />
              Study Materials & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.materials.map((item, i) => {
                const typeInfo = typeLabels[item.type];
                return (
                  <Card key={i} className="p-5 hover:shadow-md transition-shadow min-w-0 overflow-hidden">
                    <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex-1 min-w-0 break-words pr-2">
                        {item.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 break-words">
                      {item.description}
                    </p>
                    {item.toolkitPath ? (
                      <Link to={item.toolkitPath} className="block min-w-0">
                        <Button
                          variant="outline"
                          className="w-full text-xs min-w-0"
                          icon={<Download className="h-4 w-4" />}
                        >
                          Download from Toolkit
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full text-xs min-w-0"
                        icon={<Download className="h-4 w-4" />}
                        onClick={() => navigate('/toolkit')}
                      >
                        View in Toolkit
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Related Tools */}
          <Card className="p-6 mb-8 min-w-0 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary-500 flex-shrink-0" />
              Apply Your Knowledge
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 break-words">
              Put what you've learned to work in the platform:
            </p>
            <div className="flex flex-wrap gap-3 min-w-0">
              {materials.relatedTools.map((tool, i) => (
                <Link key={i} to={tool.path}>
                  <Button variant="outline" className="text-sm">
                    {tool.label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/training')}
              className="w-full sm:w-auto"
            >
              Back to Training Center
            </Button>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/training/${moduleId}/0`)}
              >
                Resume Module
              </Button>
              <Button
                onClick={() => navigate(`/training/${moduleId}/quiz`)}
              >
                Take Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingMaterialsPage;
