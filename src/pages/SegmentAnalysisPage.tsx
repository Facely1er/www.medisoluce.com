import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { analytics } from '../utils/analytics';
import { 
  Users, 
  Building2, 
  Briefcase, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Shield,
  DollarSign,
  Clock,
  FileText,
  Zap,
  TrendingUp,
  Target,
  Lock
} from 'lucide-react';

interface SegmentData {
  id: string;
  name: string;
  size: string;
  employeeRange: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  useCases: string[];
  painPoints: {
    title: string;
    description: string;
  }[];
  problems: {
    title: string;
    description: string;
    impact: string;
  }[];
  solutions: {
    feature: string;
    benefit: string;
    plan: string;
  }[];
  recommendedPlan: string;
  planPrice: string;
  roi: string;
}

const SegmentAnalysisPage: React.FC = () => {
  const { t } = useTranslation();

  // Privacy-respecting analytics tracking
  useEffect(() => {
    analytics.trackPageView('/segments', 'Segment Analysis Page');
  }, []);

  const segments: SegmentData[] = [
    {
      id: 'small-practice',
      name: 'Small Practices',
      size: 'Small',
      employeeRange: '< 50 employees',
      icon: <Users className="w-8 h-8 text-white" />,
      color: 'bg-secondary-500',
      description: 'Independent medical practices, dental offices, and specialty clinics with limited IT resources but critical compliance needs.',
      useCases: [
        'First-time HIPAA compliance setup',
        'Annual compliance audit preparation',
        'Staff HIPAA training and certification tracking',
        'Ransomware protection on a budget',
        'Quick business continuity planning',
        'Patient data backup strategy implementation'
      ],
      painPoints: [
        {
          title: 'Budget Constraints',
          description: 'Small practices struggle with expensive compliance consultants ($5,000-$15,000+) for basic HIPAA documentation.'
        },
        {
          title: 'Limited IT Resources',
          description: 'No dedicated IT staff or security expertise to implement compliance measures effectively.'
        },
        {
          title: 'Time Constraints',
          description: 'Practice managers juggle patient care, administration, and compliance with limited time for proper planning.'
        },
        {
          title: 'Overwhelmed by Regulations',
          description: 'HIPAA requirements feel complex and overwhelming without clear, actionable guidance.'
        }
      ],
      problems: [
        {
          title: 'High Cost of Non-Compliance',
          description: 'HIPAA violations can cost $100-$50,000 per violation, potentially reaching $1.5M annually.',
          impact: 'Financial risk that could shut down a small practice'
        },
        {
          title: 'Ransomware Vulnerability',
          description: '70% of healthcare organizations hit by ransomware; small practices often lack proper backup systems.',
          impact: 'Average recovery cost: $10.9M; 22 days downtime'
        },
        {
          title: 'Incomplete Documentation',
          description: 'Missing policies, procedures, and training records result in audit failures and fines.',
          impact: 'Regulatory penalties and loss of patient trust'
        },
        {
          title: 'No Disaster Recovery Plan',
          description: 'System failures lead to complete practice shutdown with no recovery procedures.',
          impact: 'Revenue loss and patient care disruption'
        }
      ],
      solutions: [
        {
          feature: 'Essential HIPAA Suite - $49/month',
          benefit: 'All policy templates, assessment tools, and downloadable resources at an affordable price',
          plan: 'Essential'
        },
        {
          feature: 'Free HIPAA Compliance Assessment',
          benefit: '10-question evaluation to identify compliance gaps without cost commitment',
          plan: 'Free'
        },
        {
          feature: 'Easy-to-Use Templates',
          benefit: 'Ready-made HIPAA policies, training forms, and compliance documentation',
          plan: 'Essential'
        },
        {
          feature: 'Budget-Friendly Pricing',
          benefit: 'No expensive consultants needed - save $5,000-$15,000 annually',
          plan: 'Essential'
        },
        {
          feature: 'Quick Implementation',
          benefit: 'Get audit-ready in 30 days with step-by-step guidance',
          plan: 'Essential'
        }
      ],
      recommendedPlan: 'Essential HIPAA',
      planPrice: '$49/month',
      roi: 'Save $5,000-$15,000 vs. hiring consultants; prevent $1.5M in potential violation fines'
    },
    {
      id: 'medium-org',
      name: 'Medium Healthcare Organizations',
      size: 'Medium',
      employeeRange: '50-200 employees',
      icon: <Building2 className="w-8 h-8 text-white" />,
      color: 'bg-primary-500',
      description: 'Regional clinics, multi-location practices, mid-size hospitals, and specialty healthcare networks requiring comprehensive compliance solutions.',
      useCases: [
        'Multi-location compliance management',
        'Comprehensive HIPAA audit readiness',
        'Team collaboration on compliance tasks',
        'Ransomware defense across multiple sites',
        'Business continuity for complex operations',
        'Technology dependency mapping',
        'Staff training at scale',
        'Vendor risk assessment'
      ],
      painPoints: [
        {
          title: 'Complex Compliance Management',
          description: 'Coordinating HIPAA compliance across multiple locations and departments is challenging.'
        },
        {
          title: 'Team Collaboration Needs',
          description: 'Multiple stakeholders need to work together but lack centralized tools.'
        },
        {
          title: 'Growing Security Threats',
          description: 'Larger attack surface with more systems, more employees, higher ransomware risk.'
        },
        {
          title: 'Regulatory Scrutiny',
          description: 'Higher likelihood of audits and inspections requiring comprehensive documentation.'
        },
        {
          title: 'Technology Complexity',
          description: 'Multiple EHR systems, clinical applications, and dependencies to secure.'
        }
      ],
      problems: [
        {
          title: 'Ransomware Attacks Increasing',
          description: '70% of healthcare orgs hit; medium-sized are prime targets due to moderate security but valuable data.',
          impact: 'Average $10.9M recovery cost; 22 days operational disruption'
        },
        {
          title: 'Audit Failures',
          description: 'Incomplete compliance documentation leads to regulatory findings and potential fines.',
          impact: 'Up to $1.5M in penalties; reputation damage'
        },
        {
          title: 'System Dependency Risks',
          description: 'Complex technology ecosystems with interdependencies create single points of failure.',
          impact: 'Critical system downtime affects patient care and revenue'
        },
        {
          title: 'Insufficient Business Continuity',
          description: 'Lack of comprehensive continuity plans leads to extended recovery times during incidents.',
          impact: 'Revenue loss and patient care disruption exceeding acceptable thresholds'
        }
      ],
      solutions: [
        {
          feature: 'Professional Bundle - $299/month',
          benefit: 'Complete HIPAA, Ransomware, and Continuity suites with team collaboration (5 users)',
          plan: 'Professional'
        },
        {
          feature: 'Cloud Sync & Backup',
          benefit: 'Centralized compliance data accessible across all locations with secure backup',
          plan: 'Professional'
        },
        {
          feature: 'Team Collaboration Tools',
          benefit: '5 user seats for coordinated compliance management across departments',
          plan: 'Professional'
        },
        {
          feature: 'Advanced Reporting',
          benefit: 'Executive-ready compliance dashboards and audit trail documentation',
          plan: 'Professional'
        },
        {
          feature: 'Technology Dependency Mapping',
          benefit: 'Visualize and secure critical healthcare system relationships across operations',
          plan: 'Professional'
        },
        {
          feature: 'Business Impact Analysis',
          benefit: 'Assess financial and operational risks from system failures with quantified impacts',
          plan: 'Professional'
        },
        {
          feature: 'Priority Support',
          benefit: 'Dedicated support for faster issue resolution and compliance guidance',
          plan: 'Professional'
        }
      ],
      recommendedPlan: 'Professional Bundle',
      planPrice: '$299/month',
      roi: 'Protect $10.9M in potential ransomware losses; achieve audit-ready status saving $20,000+ in consultant fees'
    },
    {
      id: 'large-hospital',
      name: 'Large Hospitals & Health Systems',
      size: 'Large',
      employeeRange: '200-1,000 employees',
      icon: <Building2 className="w-8 h-8 text-white" />,
      color: 'bg-accent-500',
      description: 'Major hospitals, health systems, and healthcare networks with complex operations, multiple locations, and enterprise-level compliance requirements.',
      useCases: [
        'Enterprise-wide HIPAA compliance program',
        'Multi-site ransomware protection',
        'Comprehensive business continuity planning',
        'Complex technology ecosystem mapping',
        'Large-scale staff training and certification',
        'Vendor risk assessment and management',
        'Board-level compliance reporting',
        'Regulatory audit preparation and response',
        'Incident response and breach management'
      ],
      painPoints: [
        {
          title: 'Enterprise Complexity',
          description: 'Managing compliance across hundreds of systems, thousands of employees, and multiple facilities is overwhelming.'
        },
        {
          title: 'Multiple Regulatory Frameworks',
          description: 'HIPAA, Joint Commission, state regulations, and other compliance requirements create complexity.'
        },
        {
          title: 'High-Value Target',
          description: 'Large hospitals are prime ransomware targets due to critical operations and valuable patient data.'
        },
        {
          title: 'Board & Executive Reporting',
          description: 'Need executive-level reporting on compliance status, risks, and financial impacts.'
        },
        {
          title: 'Vendor Management',
          description: 'Dozens of business associates require risk assessment and BAA management.'
        },
        {
          title: 'Scalability Requirements',
          description: 'Solutions must scale to hundreds of users and dozens of systems while maintaining performance.'
        }
      ],
      problems: [
        {
          title: 'Catastrophic Ransomware Impact',
          description: 'Large hospitals face average $10.9M recovery costs with 22 days of operational disruption affecting patient care.',
          impact: 'Life-threatening delays; millions in revenue loss; regulatory violations'
        },
        {
          title: 'Regulatory Penalties',
          description: 'HIPAA violations can reach $1.5M annually; Joint Commission findings can result in accreditation loss.',
          impact: 'Financial penalties, reputation damage, loss of Medicare certification'
        },
        {
          title: 'System-Wide Failures',
          description: 'Single points of failure in complex technology ecosystems can shut down entire operations.',
          impact: 'Complete operational shutdown; patient safety risks; revenue interruption'
        },
        {
          title: 'Inadequate Business Continuity',
          description: 'Lack of comprehensive continuity plans leads to extended recovery times and patient care disruption.',
          impact: 'Unacceptable downtime; regulatory non-compliance; patient safety concerns'
        },
        {
          title: 'Vendor Risk Exposure',
          description: 'Unassessed third-party vendors create security and compliance vulnerabilities.',
          impact: 'Supply chain attacks; BAA violations; data breaches through vendors'
        }
      ],
      solutions: [
        {
          feature: 'Enterprise Bundle - $999/month',
          benefit: 'Complete enterprise solution with unlimited users, white-label options, and dedicated consultant',
          plan: 'Enterprise'
        },
        {
          feature: 'Unlimited Users & Teams',
          benefit: 'Scale to hundreds of users across multiple departments and locations',
          plan: 'Enterprise'
        },
        {
          feature: '99.9% Uptime SLA',
          benefit: 'Guaranteed service availability with enterprise-grade infrastructure',
          plan: 'Enterprise'
        },
        {
          feature: 'Dedicated Compliance Consultant',
          benefit: 'Personal guidance for complex compliance challenges and strategic planning',
          plan: 'Enterprise'
        },
        {
          feature: 'Custom Integrations',
          benefit: 'Integrate with existing EHR systems, HR platforms, and security tools',
          plan: 'Enterprise'
        },
        {
          feature: 'White-Label Options',
          benefit: 'Brand the platform with your organization\'s identity for internal use',
          plan: 'Enterprise'
        },
        {
          feature: 'Quarterly Compliance Reviews',
          benefit: 'Regular strategic reviews with compliance experts to maintain audit readiness',
          plan: 'Enterprise'
        },
        {
          feature: '24/7 Phone Support',
          benefit: 'Round-the-clock support for critical compliance and security issues',
          plan: 'Enterprise'
        },
        {
          feature: 'SOC Monitoring & Incident Response',
          benefit: 'Advanced security monitoring and automated incident response capabilities',
          plan: 'Enterprise'
        },
        {
          feature: 'Board-Ready Reporting',
          benefit: 'Executive dashboards with financial impact analysis and risk quantification',
          plan: 'Enterprise'
        }
      ],
      recommendedPlan: 'Enterprise Bundle',
      planPrice: '$999/month',
      roi: 'Prevent $10.9M+ ransomware losses; avoid $1.5M+ in HIPAA penalties; save $100,000+ annually vs. enterprise consultants'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Health Systems',
      size: 'Enterprise',
      employeeRange: '1,000+ employees',
      icon: <Briefcase className="w-8 h-8 text-white" />,
      color: 'bg-success-500',
      description: 'Major health systems, hospital networks, integrated delivery networks (IDNs), and academic medical centers with complex, multi-state operations.',
      useCases: [
        'Multi-state compliance program management',
        'Enterprise-wide ransomware defense',
        'Comprehensive business continuity planning across facilities',
        'Complex technology ecosystem governance',
        'Large-scale staff training programs (1,000+ employees)',
        'Extensive vendor risk management',
        'C-suite and board-level reporting',
        'Regulatory audit management',
        'Advanced incident response',
        'Custom compliance workflows',
        'Integration with enterprise systems',
        'Centralized compliance governance'
      ],
      painPoints: [
        {
          title: 'Massive Scale Complexity',
          description: 'Managing compliance across thousands of employees, hundreds of systems, and multiple states presents enormous challenges.'
        },
        {
          title: 'Multi-Jurisdictional Compliance',
          description: 'Must comply with HIPAA, state regulations in multiple states, Joint Commission, and other frameworks simultaneously.'
        },
        {
          title: 'Critical Infrastructure Protection',
          description: 'Enterprise health systems are high-value targets requiring advanced protection against sophisticated attacks.'
        },
        {
          title: 'Executive Accountability',
          description: 'C-suite and board require clear visibility into compliance status, risks, and financial exposures.'
        },
        {
          title: 'Operational Resilience',
          description: 'System failures can impact patient care across entire regions requiring robust continuity planning.'
        },
        {
          title: 'Vendor Ecosystem Management',
          description: 'Hundreds of vendors and business associates require comprehensive risk assessment and management.'
        },
        {
          title: 'Custom Requirements',
          description: 'Enterprise needs often require custom solutions, integrations, and workflows beyond standard offerings.'
        }
      ],
      problems: [
        {
          title: 'Catastrophic Financial Impact',
          description: 'Ransomware attacks can cost $10.9M+ with weeks of operational disruption affecting thousands of patients.',
          impact: 'Regional healthcare disruption; life-threatening delays; tens of millions in losses'
        },
        {
          title: 'Maximum Regulatory Penalties',
          description: 'Enterprise violations face maximum HIPAA penalties up to $1.5M per incident category annually.',
          impact: 'Multi-million dollar fines; regulatory oversight; public scrutiny'
        },
        {
          title: 'Enterprise-Wide System Failures',
          description: 'Complex interdependencies create cascade failures affecting multiple facilities and thousands of patients.',
          impact: 'Regional healthcare crisis; patient safety emergencies; complete operational shutdown'
        },
        {
          title: 'Regulatory Oversight',
          description: 'Large systems face increased scrutiny from OCR, Joint Commission, and state regulators requiring comprehensive compliance.',
          impact: 'Increased audit frequency; potential certification loss; ongoing regulatory monitoring'
        },
        {
          title: 'Reputation & Market Impact',
          description: 'Compliance failures damage reputation, patient trust, and can impact contracts and partnerships.',
          impact: 'Loss of patient trust; contract terminations; market share decline'
        },
        {
          title: 'Leadership Accountability',
          description: 'C-suite executives face personal accountability for compliance failures with potential legal consequences.',
          impact: 'Executive liability; board scrutiny; potential legal action'
        }
      ],
      solutions: [
        {
          feature: 'Enterprise Bundle (Custom Pricing)',
          benefit: 'Tailored enterprise solution with custom features, unlimited scale, and dedicated team',
          plan: 'Enterprise Custom'
        },
        {
          feature: 'Unlimited Everything',
          benefit: 'Unlimited users, locations, systems, and storage for complete enterprise coverage',
          plan: 'Enterprise'
        },
        {
          feature: 'Dedicated Account Team',
          benefit: 'Assigned compliance consultants, technical specialists, and account managers',
          plan: 'Enterprise Custom'
        },
        {
          feature: 'Custom Integrations & Workflows',
          benefit: 'Build custom integrations with your EHR, HRIS, security tools, and other enterprise systems',
          plan: 'Enterprise Custom'
        },
        {
          feature: 'White-Label Enterprise Platform',
          benefit: 'Fully branded platform integrated into your organization\'s technology ecosystem',
          plan: 'Enterprise Custom'
        },
        {
          feature: 'Advanced Analytics & Reporting',
          benefit: 'Executive dashboards, predictive analytics, and board-ready compliance reporting',
          plan: 'Enterprise'
        },
        {
          feature: 'Multi-State Compliance Management',
          benefit: 'Manage compliance across multiple jurisdictions with state-specific requirements tracking',
          plan: 'Enterprise'
        },
        {
          feature: 'Enterprise-Grade Security',
          benefit: 'SOC 2 Type II certified infrastructure with advanced threat protection and monitoring',
          plan: 'Enterprise'
        },
        {
          feature: '24/7/365 Support & Monitoring',
          benefit: 'Round-the-clock support, security monitoring, and incident response capabilities',
          plan: 'Enterprise'
        },
        {
          feature: 'Quarterly Executive Reviews',
          benefit: 'Regular C-suite briefings on compliance status, risks, and strategic recommendations',
          plan: 'Enterprise Custom'
        },
        {
          feature: 'Training at Scale',
          benefit: 'Deploy and track compliance training across thousands of employees with certification management',
          plan: 'Enterprise'
        },
        {
          feature: 'Vendor Risk Management',
          benefit: 'Comprehensive vendor assessment, BAA management, and supply chain risk tracking',
          plan: 'Enterprise'
        }
      ],
      recommendedPlan: 'Enterprise Custom',
      planPrice: 'Custom Pricing',
      roi: 'Prevent $10.9M+ ransomware losses; avoid $1.5M+ in penalties; save $200,000-$500,000 annually vs. enterprise consulting; protect regional healthcare infrastructure'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead 
        title="Healthcare Compliance Solutions by Organization Size | MediSoluce"
        description="Find the perfect HIPAA compliance, ransomware protection, and business continuity solution for your healthcare organization size. Privacy-first design with no data collection."
        keywords="healthcare compliance by size, small practice HIPAA, medium healthcare compliance, large hospital compliance, enterprise health system compliance, HIPAA solutions by organization size, privacy-by-design, HIPAA compliant"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Healthcare Compliance Solutions by Organization Size
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8">
                Find the perfect compliance solution tailored to your healthcare organization's needs, challenges, and budget
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/hipaa-check">
                  <Button size="lg" variant="outline" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                    Start Free Assessment
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="!bg-white/10 !border-white !text-white hover:!bg-white/20">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy-by-Design Indicator */}
      <section className="bg-success-50 dark:bg-success-900/20 border-b border-success-200 dark:border-success-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-sm">
            <Shield className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0" />
            <span className="text-success-800 dark:text-success-200">
              <strong>Privacy-First:</strong> This page is informational only - no personal data collected. 
              <Link to="/privacy" className="underline hover:text-success-900 dark:hover:text-success-100 ml-1">
                Learn more about our privacy-by-design approach
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* Privacy Notice Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-primary-500">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <Lock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      Privacy-by-Design Aligned
                      <span className="text-xs bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 px-2 py-1 rounded-full">
                        No Data Collected
                      </span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      This segment analysis page is designed with privacy-by-design principles. It provides comprehensive 
                      information about healthcare compliance solutions without collecting any personal data, tracking user 
                      behavior, or requiring authentication.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">No Personal Data</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">No forms, inputs, or data collection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">No Account Required</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Accessible anonymously</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">No Tracking Cookies</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Only privacy-respecting analytics</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">HIPAA-Compliant</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Designed for healthcare privacy</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link 
                        to="/privacy" 
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-1"
                      >
                        Read our complete Privacy Policy
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Segments Overview */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Organization Size
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Each segment has unique challenges, pain points, and solutions designed specifically for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <a href={`#${segment.id}`} className="block h-full">
                  <Card hover animate className="h-full text-center">
                    <div className={`${segment.color} w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      {segment.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {segment.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {segment.size}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {segment.employeeRange}
                    </p>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Segment Analysis */}
      {segments.map((segment, segmentIndex) => (
        <section 
          key={segment.id}
          id={segment.id}
          className={`py-20 ${segmentIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Segment Header */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className={`${segment.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                  {segment.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {segment.name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {segment.size} • {segment.employeeRange}
                  </p>
                </div>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                {segment.description}
              </p>
            </div>

            {/* Use Cases */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-primary-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Common Use Cases
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segment.useCases.map((useCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pain Points */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-accent-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pain Points
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {segment.painPoints.map((pain, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-l-4 border-l-accent-500">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {pain.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {pain.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Problems */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Critical Problems & Impact
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {segment.problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-l-4 border-l-red-500">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {problem.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {problem.description}
                          </p>
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                              <strong>Impact:</strong> {problem.impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-success-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  MediSoluce Solutions
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {segment.solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-l-4 border-l-success-500 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                              {solution.plan}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {solution.feature}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {solution.benefit}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended Plan CTA */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Recommended Plan
                      </h3>
                    </div>
                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {segment.recommendedPlan} - {segment.planPrice}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      <strong>ROI:</strong> {segment.roi}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link to="/pricing">
                        <Button variant="primary" icon={<ArrowRight />} iconPosition="right">
                          View Pricing Details
                        </Button>
                      </Link>
                      <Link to="/hipaa-check">
                        <Button variant="outline">
                          Start Free Assessment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect Solution?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Get started with a free HIPAA compliance assessment to identify your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hipaa-check">
                <Button size="lg" variant="outline" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  Start Free Assessment
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="!bg-white/10 !border-white !text-white hover:!bg-white/20">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SegmentAnalysisPage;

