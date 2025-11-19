import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, X, AlertTriangle, Shield, FileText, CheckCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

const RansomwarePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    t('ransomware.categories.prevention'),
    t('ransomware.categories.detection'),
    t('ransomware.categories.response'),
    t('ransomware.categories.recovery'),
    t('ransomware.categories.training')
  ];

  const protectionFramework = [
    {
      title: t('ransomware.prevention'),
      description: t('ransomware.prevention_desc'),
      icon: <Shield className="h-8 w-8 text-primary-500" />,
      features: [
        t('ransomware.prevention_features.email'),
        t('ransomware.prevention_features.endpoint'),
        t('ransomware.prevention_features.network'),
        t('ransomware.prevention_features.access'),
        t('ransomware.prevention_features.updates')
      ]
    },
    {
      title: t('ransomware.detection'),
      description: t('ransomware.detection_desc'),
      icon: <AlertTriangle className="h-8 w-8 text-accent-500" />,
      features: [
        t('ransomware.detection_features.monitoring'),
        t('ransomware.detection_features.anomaly'),
        t('ransomware.detection_features.siem'),
        t('ransomware.detection_features.behavioral'),
        t('ransomware.detection_features.intelligence')
      ]
    },
    {
      title: t('ransomware.response'),
      description: t('ransomware.response_desc'),
      icon: <Clock className="h-8 w-8 text-warning-500" />,
      features: [
        t('ransomware.response_features.playbooks'),
        t('ransomware.response_features.isolation'),
        t('ransomware.response_features.communication'),
        t('ransomware.response_features.legal'),
        t('ransomware.response_features.forensic')
      ]
    },
    {
      title: t('ransomware.recovery'),
      description: t('ransomware.recovery_desc'),
      icon: <CheckCircle className="h-8 w-8 text-success-500" />,
      features: [
        t('ransomware.recovery_features.backup'),
        t('ransomware.recovery_features.recovery_plans'),
        t('ransomware.recovery_features.data_recovery'),
        t('ransomware.recovery_features.continuity'),
        t('ransomware.recovery_features.review')
      ]
    }
  ];

  const incidentResponseSteps = [
    {
      phase: t('ransomware.initial_response'),
      description: t('ransomware.initial_response_desc'),
      actions: [
        t('ransomware.initial_response_actions.isolate'),
        t('ransomware.initial_response_actions.disconnect'),
        t('ransomware.initial_response_actions.preserve'),
        t('ransomware.initial_response_actions.notify')
      ]
    },
    {
      phase: t('ransomware.impact_assessment'),
      description: t('ransomware.impact_assessment_desc'),
      actions: [
        t('ransomware.impact_assessment_actions.identify'),
        t('ransomware.impact_assessment_actions.patient'),
        t('ransomware.impact_assessment_actions.exfiltration'),
        t('ransomware.impact_assessment_actions.disruption')
      ]
    },
    {
      phase: t('ransomware.recovery_operations'),
      description: t('ransomware.recovery_operations_desc'),
      actions: [
        t('ransomware.recovery_operations_actions.restore'),
        t('ransomware.recovery_operations_actions.verify'),
        t('ransomware.recovery_operations_actions.reconnect'),
        t('ransomware.recovery_operations_actions.monitor')
      ]
    },
    {
      phase: t('ransomware.post_incident'),
      description: t('ransomware.post_incident_desc'),
      actions: [
        t('ransomware.post_incident_actions.analysis'),
        t('ransomware.post_incident_actions.update'),
        t('ransomware.post_incident_actions.training'),
        t('ransomware.post_incident_actions.document')
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title={t('ransomware.title')}
        description={t('ransomware.subtitle')}
        keywords="healthcare ransomware, ransomware protection, HIPAA ransomware, healthcare cybersecurity, ransomware response"
      />
      
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                  {t('ransomware.title')}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                  {t('ransomware.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/ransomware-assessment">
                    <Button size="lg" icon={<Shield className="h-5 w-5" />}>
                      {t('ransomware.start_assessment')}
                    </Button>
                  </Link>
                  <Link to="/toolkit">
                    <Button variant="outline" size="lg" icon={<FileText className="h-5 w-5" />}>
                      {t('ransomware.view_playbook')}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <Card className="p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('ransomware.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Protection Framework */}
            <div className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
                {t('ransomware.protection_framework')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {protectionFramework.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full">
                      <div className="flex items-start space-x-4 mb-4">
                        {item.icon}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Incident Response Process */}
            <div className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8 text-center">
                {t('ransomware.incident_response')}
              </h2>
              <div className="space-y-6">
                {incidentResponseSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {step.phase}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {step.description}
                          </p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.actions.map((action, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <Card className="p-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-center">
              <h2 className="text-2xl font-heading font-bold mb-4">
                {t('ransomware.protect_organization')}
              </h2>
              <p className="text-lg mb-6 opacity-90">
                {t('ransomware.cta_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ransomware-assessment">
                  <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                    {t('ransomware.start_assessment')}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                    {t('ransomware.contact_experts')}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RansomwarePage;
