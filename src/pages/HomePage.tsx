import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/ui/SEOHead';
import HeroBanner from '../components/ui/HeroBanner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GlobalSearch from '../components/search/GlobalSearch';
import { analytics } from '../utils/analytics';
import { ShieldCheck, Server, FileText, CheckCircle, BarChart, ArrowRight, Download, BookOpen, Users, Briefcase, Shield, Wrench } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, linkTo, color }) => {
  const { t } = useTranslation();
  
  return (
    <Card hover animate className="h-full flex flex-col">
      <div className="p-6 flex-grow text-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} mb-4 mx-auto`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="p-6 pt-2 mt-auto text-center">
        <Link to={linkTo}>
          <Button variant="ghost" className="text-primary-600 dark:text-primary-400" icon={<ArrowRight size={16} />} iconPosition="right">
            {t('learn_more')}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

interface StatItem {
  labelKey: string;
  value: string;
  suffix: string;
  sourceKey: string;
  sourceUrl: string;
}

const statsItems: StatItem[] = [
  { 
    labelKey: 'homepage.stats.hhs_breaches',
    value: '133', 
    suffix: '', 
    sourceKey: 'homepage.stats.source_hhs',
    sourceUrl: 'https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf'
  },
  { 
    labelKey: 'homepage.stats.data_breach_cost',
    value: '$10.9M', 
    suffix: '', 
    sourceKey: 'homepage.stats.source_ibm',
    sourceUrl: 'https://www.ibm.com/reports/data-breach'
  },
  { 
    labelKey: 'homepage.stats.ransomware_hit',
    value: '70', 
    suffix: '%', 
    sourceKey: 'homepage.stats.source_sophos',
    sourceUrl: 'https://www.sophos.com/en-us/medialibrary/pdfs/whitepaper/sophos-state-of-ransomware-in-healthcare-2023-wp'
  },
  { 
    labelKey: 'homepage.stats.recovery_time',
    value: '22', 
    suffix: ' days', 
    sourceKey: 'homepage.stats.source_sophos',
    sourceUrl: 'https://www.sophos.com/en-us/medialibrary/pdfs/whitepaper/sophos-state-of-ransomware-in-healthcare-2023-wp'
  },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    analytics.trackPageView('/', 'Homepage');
  }, []);

  const features = [
    {
      title: t('hipaa.title'),
      description: t('features.hipaa_description'),
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      linkTo: '/hipaa-check',
      color: 'bg-primary-500',
    },
    {
      title: t('dependency.title'),
      description: t('features.dependency_description'),
      icon: <Server className="w-6 h-6 text-white" />,
      linkTo: '/dependency-manager',
      color: 'bg-secondary-500',
    },
    {
      title: t('impact.title'),
      description: t('features.impact_description'),
      icon: <BarChart className="w-6 h-6 text-white" />,
      linkTo: '/business-impact',
      color: 'bg-accent-500',
    },
    {
      title: t('continuity.title'),
      description: t('features.continuity_description'),
      icon: <FileText className="w-6 h-6 text-white" />,
      linkTo: '/continuity',
      color: 'bg-success-500',
    },
  ];

  return (
    <div>
      <SEOHead 
        title={t('home.title')}
        description={t('home.subtitle')}
        keywords="healthcare ransomware, ransomware resilience, HIPAA readiness, ransomware playbooks, business continuity, patient safety, data protection, PHI protection, HIPAA data security, healthcare data encryption"
      />
      
      <HeroBanner
        title={t('home.title_subtitle')}
        titleSubtitle={t('home.title')}
        subtitle={[
          t('home.subtitle_carousel.main'),
          t('home.subtitle_carousel.protection'),
          t('home.subtitle_carousel.trusted')
        ]}
        ctaText={t('start_free_assessment')}
        ctaLink="/hipaa-check"
      />

   

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {t('home.stats_title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('home.stats_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsItems.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg relative group"
              >
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}{stat.suffix}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t(stat.labelKey)}
                </p>
                {/* Source citation */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Source:{' '}
                    <a 
                      href={stat.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-primary-500"
                    >
                      {t(stat.sourceKey)}
                    </a>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {t('home.features_title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('home.features_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
          
          {/* Cross-linking section for SEO */}
          <div className="mt-16 text-center relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-secondary-50/30 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10 pt-12 pb-16">
            <h3 className="text-3xl font-medium text-gray-900 dark:text-white mb-8">
              {t('home.compliance_journey')}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Follow our proven 4-step methodology to achieve comprehensive healthcare compliance
            </p>
            
            {/* Journey Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              <Link 
                to="/hipaa-check"
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1"
                data-analytics="journey-step"
                data-step="1"
                aria-label="Start with HIPAA compliance assessment to evaluate your current state"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <ShieldCheck className="h-8 w-8 text-primary-500" />
                </div>
                <div className="text-center">
                  <div className="mt-4 mb-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4"></div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2">
                    {t('home.journey_step_1')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.journey_step_1_desc')}
                  </div>
                </div>
              </Link>
              <Link 
                to="/dependency-manager" 
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-secondary-300 dark:hover:border-secondary-600 transition-all duration-300 transform hover:-translate-y-1"
                data-analytics="journey-step"
                data-step="2"
                aria-label="Map your critical technology dependencies and vulnerabilities"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <Server className="h-8 w-8 text-secondary-500" />
                </div>
                <div className="text-center">
                  <div className="mt-4 mb-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mx-auto mb-4"></div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-secondary-600 dark:group-hover:text-secondary-400 mb-2">
                    {t('home.journey_step_2')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.journey_step_2_desc')}
                  </div>
                </div>
              </Link>
              <Link 
                to="/business-impact" 
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-600 transition-all duration-300 transform hover:-translate-y-1"
                data-analytics="journey-step"
                data-step="3"
                aria-label="Analyze the business impact of potential system failures"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <BarChart className="h-8 w-8 text-accent-500" />
                </div>
                <div className="text-center">
                  <div className="mt-4 mb-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full mx-auto mb-4"></div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 mb-2">
                    {t('home.journey_step_3')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.journey_step_3_desc')}
                  </div>
                </div>
              </Link>
              <Link 
                to="/continuity" 
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-success-300 dark:hover:border-success-600 transition-all duration-300 transform hover:-translate-y-1"
                data-analytics="journey-step"
                data-step="4"
                aria-label="Develop business continuity plans for critical operations"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  4
                </div>
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <FileText className="h-8 w-8 text-success-500" />
                </div>
                <div className="text-center">
                  <div className="mt-4 mb-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-success-500 to-primary-500 rounded-full mx-auto mb-4"></div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-success-600 dark:group-hover:text-success-400 mb-2">
                    {t('home.journey_step_4')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.journey_step_4_desc')}
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Additional Strategic Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Link
                to="/training"
                className="group relative p-8 bg-gradient-to-br from-white to-primary-50/50 dark:from-gray-800 dark:to-primary-900/20 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-2"
                data-analytics="homepage-secondary-cta"
                aria-label="Access comprehensive healthcare compliance training programs"
              >
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <BookOpen className="h-12 w-12 text-primary-500" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-warning-400 to-warning-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="h-1 w-16 bg-gradient-to-r from-warning-400 to-primary-500 rounded-full mx-auto mb-6"></div>
                  </div>
                  <div className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3">
                    {t('home.journey_training')}
                  </div>
                  <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.journey_training_desc')}
                  </div>
                  <div className="mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300">
                    Explore Training
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link
                to="/toolkit"
                className="group relative p-8 bg-gradient-to-br from-white to-secondary-50/50 dark:from-gray-800 dark:to-secondary-900/20 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-secondary-300 dark:hover:border-secondary-600 transition-all duration-300 transform hover:-translate-y-2"
                data-analytics="homepage-toolkit-cta"
                aria-label="Access comprehensive compliance resource toolkit"
              >
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Download className="h-12 w-12 text-secondary-500" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🔧</span>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="h-1 w-16 bg-gradient-to-r from-secondary-400 to-accent-500 rounded-full mx-auto mb-6"></div>
                  </div>
                  <div className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-secondary-600 dark:group-hover:text-secondary-400 mb-3">
                    {t('home.journey_toolkit')}
                  </div>
                  <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('home.journey_toolkit_desc')}
                  </div>
                  <div className="mt-6 inline-flex items-center text-secondary-600 dark:text-secondary-400 font-medium text-sm group-hover:text-secondary-700 dark:group-hover:text-secondary-300">
                    Access Toolkit
                    <Download className="h-4 w-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
            </div>
            
            {/* Connection lines between steps */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-full h-2" viewBox="0 0 800 20" fill="none">
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0073e6" stopOpacity="0.3" />
                    <stop offset="25%" stopColor="#00b8c4" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#dc3545" stopOpacity="0.3" />
                    <stop offset="75%" stopColor="#198754" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0073e6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path d="M0 10 Q200 5 400 10 T800 10" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                {t('home.why_choose')}
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                {t('home.why_choose_subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: t('home.healthcare_specific'),
                  description: t('home.healthcare_specific_desc'),
                  icon: <CheckCircle className="h-6 w-6 text-primary-500" />,
                },
                {
                  title: t('home.integrated_approach'),
                  description: t('home.integrated_approach_desc'),
                  icon: <CheckCircle className="h-6 w-6 text-primary-500" />,
                },
                {
                  title: t('home.patient_safety'),
                  description: t('home.patient_safety_desc'),
                  icon: <CheckCircle className="h-6 w-6 text-primary-500" />,
                },
                {
                  title: t('home.regulatory_alignment'),
                  description: t('home.regulatory_alignment_desc'),
                  icon: <CheckCircle className="h-6 w-6 text-primary-500" />,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex"
                >
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

   {/* Quick Search Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('home.quick_access.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('home.quick_access.subtitle')}
            </p>
            <GlobalSearch />
          </div>
        </div>
      </section>

      {/* Persona-Based Quick Links */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Find Your Starting Point
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Quick access based on your role and priorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  role: "I'm a Compliance Officer",
                  description: "Need audit-ready documentation and training",
                  icon: <Shield className="h-8 w-8 text-primary-500" />,
                  recommended: "HIPAA Professional Suite",
                  link: "/hipaa-check",
                  color: "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800"
                },
                {
                  role: "I'm an IT Director",
                  description: "Need security & ransomware defense",
                  icon: <Wrench className="h-8 w-8 text-accent-500" />,
                  recommended: "Enterprise Bundle",
                  link: "/pricing",
                  color: "bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800"
                },
                {
                  role: "I'm an Operations Manager",
                  description: "Need business continuity planning",
                  icon: <FileText className="h-8 w-8 text-success-500" />,
                  recommended: "Continuity Professional Suite",
                  link: "/continuity",
                  color: "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800"
                },
                {
                  role: "I'm a Practice Manager",
                  description: "Need affordable compliance solution",
                  icon: <Users className="h-8 w-8 text-secondary-500" />,
                  recommended: "Essential HIPAA - Start Free",
                  link: "/hipaa-check",
                  color: "bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800"
                },
                {
                  role: "I'm a CEO/CFO",
                  description: "Need financial risk protection",
                  icon: <Briefcase className="h-8 w-8 text-primary-500" />,
                  recommended: "Complete Bundle - Best ROI",
                  link: "/pricing",
                  color: "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800"
                },
                {
                  role: "I'm Exploring Options",
                  description: "Need to understand all capabilities",
                  icon: <Download className="h-8 w-8 text-primary-500" />,
                  recommended: "View All Features",
                  link: "/pricing",
                  color: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }
              ].map((persona, idx) => (
                <Link key={idx} to={persona.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`group p-6 rounded-xl border-2 ${persona.color} transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full`}
                  >
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0">
                        {persona.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {persona.role}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {persona.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {persona.recommended}
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                {t('home.ready_strengthen')}
              </h2>
              <p className="mt-2 text-primary-100">
                {t('home.ready_strengthen_subtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link to="/hipaa-check">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="!bg-white !text-primary-700 !border-white hover:!bg-gray-50 hover:!text-primary-800 hover:!border-gray-100 focus:ring-white font-semibold px-6 py-3 min-w-max whitespace-nowrap"
                >
                  {t('start_free_assessment')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="!bg-white/10 !border-white !text-white hover:!bg-white/20 hover:!text-white hover:!border-white focus:ring-white font-semibold backdrop-blur-sm px-6 py-3 min-w-max whitespace-nowrap"
                >
                  {t('home.contact_sales')}
                </Button>
              </Link>
              <Link to="/toolkit">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="!bg-white/10 !border-white !text-white hover:!bg-white/20 hover:!text-white hover:!border-white focus:ring-white font-semibold backdrop-blur-sm px-6 py-3 min-w-max whitespace-nowrap"
                >
                  Access Toolkit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;