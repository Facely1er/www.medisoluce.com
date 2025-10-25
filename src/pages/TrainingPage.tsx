import React from 'react';
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

  const trainingModules = [
    {
      id: 'hipaa-basics',
      title: 'HIPAA Compliance Fundamentals',
      description: 'Essential knowledge for healthcare compliance professionals',
      duration: '2 hours',
      level: 'Beginner',
      icon: <Shield className="h-8 w-8 text-primary-500" />,
      topics: [
        'HIPAA Privacy Rule Overview',
        'Security Rule Requirements',
        'Breach Notification Procedures',
        'Patient Rights and Protections'
      ],
      completed: false
    },
    {
      id: 'dependency-management',
      title: 'Technology Dependency Management',
      description: 'Managing and assessing technology dependencies in healthcare',
      duration: '1.5 hours',
      level: 'Intermediate',
      icon: <Server className="h-8 w-8 text-secondary-500" />,
      topics: [
        'Dependency Mapping Techniques',
        'Risk Assessment Methodologies',
        'Vendor Management Best Practices',
        'Technology Lifecycle Planning'
      ],
      completed: false
    },
    {
      id: 'business-continuity',
      title: 'Business Continuity Planning',
      description: 'Developing comprehensive continuity strategies',
      duration: '2.5 hours',
      level: 'Advanced',
      icon: <LifeBuoy className="h-8 w-8 text-success-500" />,
      topics: [
        'Continuity Planning Framework',
        'Emergency Response Procedures',
        'Recovery Time Objectives',
        'Testing and Validation'
      ],
      completed: false
    },
    {
      id: 'ransomware-protection',
      title: 'Ransomware Protection Strategies',
      description: 'Advanced cybersecurity for healthcare organizations',
      duration: '3 hours',
      level: 'Advanced',
      icon: <AlertTriangle className="h-8 w-8 text-accent-500" />,
      topics: [
        'Ransomware Attack Vectors',
        'Prevention Strategies',
        'Incident Response Planning',
        'Recovery Procedures'
      ],
      completed: false
    }
  ];

  const certifications = [
    {
      name: 'HIPAA Compliance Specialist',
      description: 'Certified healthcare compliance professional',
      requirements: ['Complete HIPAA Fundamentals', 'Pass assessment with 80%+'],
      icon: <Award className="h-6 w-6 text-primary-500" />
    },
    {
      name: 'Healthcare Technology Manager',
      description: 'Expert in healthcare technology management',
      requirements: ['Complete Dependency Management', 'Complete Business Continuity'],
      icon: <Award className="h-6 w-6 text-secondary-500" />
    },
    {
      name: 'Cybersecurity Healthcare Professional',
      description: 'Specialized in healthcare cybersecurity',
      requirements: ['Complete Ransomware Protection', 'Pass security assessment'],
      icon: <Award className="h-6 w-6 text-accent-500" />
    }
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Training Center
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Comprehensive training modules designed to enhance your healthcare compliance expertise. 
              Learn at your own pace with interactive content and earn industry-recognized certifications.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Available Modules
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Comprehensive training programs
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-secondary-500" />
                <span className="text-2xl font-bold text-secondary-600">9h</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Duration
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Self-paced learning
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-success-500" />
                <span className="text-2xl font-bold text-success-600">3</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Certifications
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Industry recognized
              </p>
            </Card>
          </div>

          {/* Training Modules */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Training Modules
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainingModules.map((module) => (
                <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {module.icon}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {module.title}
                        </h3>
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
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Topics Covered:
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

                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => setSelectedModule(module.id)}
                      className="flex-1"
                      icon={<Play className="h-4 w-4" />}
                    >
                      {module.completed ? 'Review' : 'Start Module'}
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Download className="h-4 w-4" />}
                    >
                      Materials
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Available Certifications
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
                      Requirements:
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
          <Card className="p-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Related Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/hipaa-check"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-primary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    HIPAA Assessment
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Test your compliance knowledge
                </p>
              </Link>

              <Link 
                to="/dependency-manager"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-secondary-300 dark:hover:border-secondary-600 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Server className="h-5 w-5 text-secondary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Dependency Manager
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Apply your training knowledge
                </p>
              </Link>

              <Link 
                to="/continuity"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-success-300 dark:hover:border-success-600 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <LifeBuoy className="h-5 w-5 text-success-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Continuity Planning
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Practice continuity strategies
                </p>
              </Link>

              <Link 
                to="/toolkit"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-600 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-accent-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Resource Toolkit
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Download templates and guides
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
