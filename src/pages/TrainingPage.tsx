import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Play, 
  Download, 
  CheckCircle, 
  Clock, 
  Users, 
  Award,
  FileText,
  Shield,
  Server,
  LifeBuoy,
  AlertTriangle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

const TrainingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const trainingModules = [
    {
      id: 'hipaa-basics',
      title: t('training.modules.hipaa_basics.title'),
      description: t('training.modules.hipaa_basics.description'),
      duration: t('training.modules.hipaa_basics.duration'),
      level: t('training.levels.beginner'),
      icon: <Shield className="h-8 w-8 text-primary-500" />,
      topics: [
        t('training.modules.hipaa_basics.topics.privacy_rule'),
        t('training.modules.hipaa_basics.topics.security_rule'),
        t('training.modules.hipaa_basics.topics.breach_notification'),
        t('training.modules.hipaa_basics.topics.patient_rights')
      ],
      completed: false,
      available: true,
      comingSoon: false
    },
    {
      id: 'dependency-management',
      title: t('training.modules.dependency_management.title'),
      description: t('training.modules.dependency_management.description'),
      duration: t('training.modules.dependency_management.duration'),
      level: t('training.levels.intermediate'),
      icon: <Server className="h-8 w-8 text-secondary-500" />,
      topics: [
        t('training.modules.dependency_management.topics.mapping'),
        t('training.modules.dependency_management.topics.risk_assessment'),
        t('training.modules.dependency_management.topics.vendor_management'),
        t('training.modules.dependency_management.topics.lifecycle')
      ],
      completed: false,
      available: true,
      comingSoon: false
    },
    {
      id: 'business-continuity',
      title: t('training.modules.business_continuity.title'),
      description: t('training.modules.business_continuity.description'),
      duration: t('training.modules.business_continuity.duration'),
      level: t('training.levels.advanced'),
      icon: <LifeBuoy className="h-8 w-8 text-success-500" />,
      topics: [
        t('training.modules.business_continuity.topics.framework'),
        t('training.modules.business_continuity.topics.emergency'),
        t('training.modules.business_continuity.topics.rto'),
        t('training.modules.business_continuity.topics.testing')
      ],
      completed: false,
      available: true,
      comingSoon: false
    },
    {
      id: 'ransomware-protection',
      title: t('training.modules.ransomware_protection.title'),
      description: t('training.modules.ransomware_protection.description'),
      duration: t('training.modules.ransomware_protection.duration'),
      level: t('training.levels.advanced'),
      icon: <AlertTriangle className="h-8 w-8 text-accent-500" />,
      topics: [
        t('training.modules.ransomware_protection.topics.attack_vectors'),
        t('training.modules.ransomware_protection.topics.prevention'),
        t('training.modules.ransomware_protection.topics.incident_response'),
        t('training.modules.ransomware_protection.topics.recovery')
      ],
      completed: false,
      available: true,
      comingSoon: false
    }
  ];

  const certifications = [
    {
      name: t('training.certifications_list.hipaa_specialist.name'),
      description: t('training.certifications_list.hipaa_specialist.description'),
      requirements: [
        t('training.certifications_list.hipaa_specialist.requirements.complete'),
        t('training.certifications_list.hipaa_specialist.requirements.pass')
      ],
      icon: <Award className="h-6 w-6 text-primary-500" />
    },
    {
      name: t('training.certifications_list.tech_manager.name'),
      description: t('training.certifications_list.tech_manager.description'),
      requirements: [
        t('training.certifications_list.tech_manager.requirements.dependency'),
        t('training.certifications_list.tech_manager.requirements.continuity')
      ],
      icon: <Award className="h-6 w-6 text-secondary-500" />
    },
    {
      name: t('training.certifications_list.cybersecurity.name'),
      description: t('training.certifications_list.cybersecurity.description'),
      requirements: [
        t('training.certifications_list.cybersecurity.requirements.ransomware'),
        t('training.certifications_list.cybersecurity.requirements.security')
      ],
      icon: <Award className="h-6 w-6 text-accent-500" />
    }
  ];

  return (
    <div className="py-8 min-w-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="max-w-6xl mx-auto min-w-0">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                {t('training.page_title')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('training.page_description')}
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-bold text-primary-600">
                  {trainingModules.filter(m => m.available).length}/{trainingModules.length}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('training.available_modules')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t('training.comprehensive_programs')}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-secondary-500" />
                <span className="text-2xl font-bold text-secondary-600">9h</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('training.total_duration')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t('training.self_paced')}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-success-500" />
                <span className="text-2xl font-bold text-success-600">3</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('training.certifications')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t('training.industry_recognized')}
              </p>
            </Card>
          </div>

          {/* Training Modules */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('training.training_modules')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainingModules.map((module) => (
                <Card key={module.id} className={`p-6 hover:shadow-lg transition-shadow ${!module.available ? 'opacity-75' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      {module.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {module.title}
                          </h3>
                          {module.comingSoon && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    {module.completed && (
                      <CheckCircle className="h-6 w-6 text-success-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{module.level}</span>
                    </div>
                    {module.launchDate && (
                      <div className="flex items-center space-x-1">
                        <span className="text-warning-600 dark:text-warning-400 font-medium">
                          {module.launchDate}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('training.topics_covered')}
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {module.topics.map((topic, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-success-500 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {module.comingSoon && (
                    <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
                      <p className="text-sm text-warning-800 dark:text-warning-300">
                        📅 This module is currently in development. Get notified when it launches!
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    {module.available ? (
                      <>
                        <Link to={`/training/${module.id}/0`} className="flex-1">
                          <Button
                            className="w-full"
                            icon={<Play className="h-4 w-4" />}
                          >
                            {module.completed ? t('training.review') : t('training.start_module')}
                          </Button>
                        </Link>
                        <Link to="/toolkit">
                          <Button
                            variant="outline"
                            icon={<Download className="h-4 w-4" />}
                          >
                            {t('training.materials')}
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Button
                          className="flex-1"
                          variant="outline"
                          disabled
                        >
                          Coming {module.launchDate}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/contact')}
                        >
                          Notify Me
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {t('training.available_certifications')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {cert.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {cert.description}
                  </p>
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {t('training.requirements')}
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      {cert.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-success-500 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Resources */}
          <Card className="p-6 min-w-0 overflow-hidden">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('training.related_resources')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 min-w-0">
              <Link 
                to="/hipaa-check"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors min-w-0"
              >
                <div className="flex items-center space-x-2 mb-2 min-w-0">
                  <Shield className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white break-words min-w-0">
                    {t('training.related.hipaa_assessment.title')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {t('training.related.hipaa_assessment.description')}
                </p>
              </Link>

              <Link 
                to="/dependency-manager"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-secondary-300 dark:hover:border-secondary-600 transition-colors min-w-0"
              >
                <div className="flex items-center space-x-2 mb-2 min-w-0">
                  <Server className="h-5 w-5 text-secondary-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white break-words min-w-0">
                    {t('training.related.dependency_manager.title')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {t('training.related.dependency_manager.description')}
                </p>
              </Link>

              <Link 
                to="/continuity"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-success-300 dark:hover:border-success-600 transition-colors min-w-0"
              >
                <div className="flex items-center space-x-2 mb-2 min-w-0">
                  <LifeBuoy className="h-5 w-5 text-success-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white break-words min-w-0">
                    {t('training.related.continuity_planning.title')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {t('training.related.continuity_planning.description')}
                </p>
              </Link>

              <Link 
                to="/toolkit"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-600 transition-colors min-w-0"
              >
                <div className="flex items-center space-x-2 mb-2 min-w-0">
                  <FileText className="h-5 w-5 text-accent-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white break-words min-w-0">
                    {t('training.related.resource_toolkit.title')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('training.related.resource_toolkit.description')}
                </p>
              </Link>

              <Link 
                to="/ransomware"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-600 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-accent-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t('training.related.ransomware_protection.title')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                  {t('training.related.ransomware_protection.description')}
                </p>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
