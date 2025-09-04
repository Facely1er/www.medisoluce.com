import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Server, 
  BarChart, 
  CheckCircle, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  ArrowRight 
} from 'lucide-react';

const DemoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      title: "Welcome to MediSoluce",
      description: "Your comprehensive healthcare compliance platform combining HIPAA compliance, technology dependency management, and business continuity planning.",
      component: "overview",
      duration: 3000
    },
    {
      title: "HIPAA Compliance Assessment",
      description: "Evaluate your organization's compliance with comprehensive assessments that provide scoring and recommendations.",
      component: "assessment",
      duration: 4000
    },
    {
      title: "Technology Dependency Mapping",
      description: "Map and visualize critical healthcare system dependencies to identify vulnerabilities and risks.",
      component: "dependencies",
      duration: 4000
    },
    {
      title: "Business Impact Analysis", 
      description: "Assess how technology failures affect patient care and business operations.",
      component: "impact",
      duration: 3000
    },
    {
      title: "Staff Training Platform",
      description: "Comprehensive training modules to ensure your team understands compliance requirements.",
      component: "training",
      duration: 3000
    },
    {
      title: "Resource Toolkit",
      description: "Download templates, policies, and implementation guides tailored for healthcare organizations.",
      component: "toolkit",
      duration: 3000
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep();
      }, demoSteps[currentStep].duration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const renderDemoContent = () => {
    const step = demoSteps[currentStep];
    
    switch (step.component) {
      case 'overview':
        return (
          <div className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-4 rounded-lg">
                <ShieldCheck className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <div className="text-sm font-medium">HIPAA Compliance</div>
              </div>
              <div className="bg-secondary-100 dark:bg-secondary-900/20 p-4 rounded-lg">
                <Server className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
                <div className="text-sm font-medium">System Mapping</div>
              </div>
              <div className="bg-accent-100 dark:bg-accent-900/20 p-4 rounded-lg">
                <BarChart className="h-8 w-8 text-accent-500 mx-auto mb-2" />
                <div className="text-sm font-medium">Impact Analysis</div>
              </div>
            </div>
          </div>
        );
      
      case 'assessment':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Risk Assessment Coverage</span>
                <span className="text-primary-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                Policy Documentation
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                Staff Training
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-warning-500 mr-2" />
                Access Controls
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-accent-500 mr-2" />
                Encryption
              </div>
            </div>
          </div>
        );
      
      case 'dependencies':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'Electronic Health Record', risk: 'Critical', connections: 8 },
                { name: 'Patient Monitoring', risk: 'High', connections: 5 },
                { name: 'Laboratory System', risk: 'Medium', connections: 3 }
              ].map((system) => (
                <div key={system.name} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 text-secondary-500 mr-2" />
                      <span className="font-medium text-sm">{system.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        system.risk === 'Critical' ? 'bg-red-100 text-red-600' :
                        system.risk === 'High' ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {system.risk}
                      </span>
                      <span className="text-xs text-gray-500">{system.connections} deps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'impact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                <div className="text-2xl font-bold text-accent-600">$250K</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Daily Revenue at Risk</div>
              </div>
              <div className="text-center p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <div className="text-2xl font-bold text-warning-600">4 hrs</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Max Downtime</div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm font-medium mb-2">Patient Care Impact Analysis</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Emergency Services</span>
                  <span className="text-red-600">Critical</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Laboratory Results</span>
                  <span className="text-orange-600">High</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Scheduling</span>
                  <span className="text-yellow-600">Medium</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'training':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { module: 'HIPAA Essentials', progress: 100, score: 92 },
                { module: 'Security Awareness', progress: 75, score: 0 },
                { module: 'Incident Response', progress: 0, score: 0 },
                { module: 'Compliance Updates', progress: 0, score: 0 }
              ].map((training) => (
                <div key={training.module} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">{training.module}</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mb-1">
                    <div 
                      className="bg-primary-500 h-1 rounded-full" 
                      style={{ width: `${training.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {training.progress === 100 ? `Score: ${training.score}%` : `${training.progress}% complete`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'toolkit':
        return (
          <div className="space-y-3">
            {[
              { name: 'Privacy Policy Template', type: 'DOCX', downloads: 245 },
              { name: 'Breach Response Checklist', type: 'PDF', downloads: 189 },
              { name: 'Risk Assessment Tool', type: 'XLSX', downloads: 167 },
              { name: 'Business Continuity Plan', type: 'DOCX', downloads: 134 }
            ].map((resource) => (
              <div key={resource.name} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center">
                  <Download className="h-4 w-4 text-primary-500 mr-2" />
                  <div>
                    <div className="text-sm font-medium">{resource.name}</div>
                    <div className="text-xs text-gray-500">{resource.type} • {resource.downloads} downloads</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Interactive Platform Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience MediSoluce's comprehensive healthcare compliance platform with this interactive demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Player */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {demoSteps[currentStep].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {demoSteps[currentStep].description}
                  </p>
                </div>

                {/* Demo Content */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[300px]">
                  {renderDemoContent()}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Step {currentStep + 1} of {demoSteps.length}</span>
                    <span>{Math.round(((currentStep + 1) / demoSteps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4 mt-6">
                  <Button variant="outline" size="sm" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={togglePlayback}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextStep}>
                    Next
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetDemo}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Step Navigation */}
              <Card className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Demo Navigation
                </h3>
                <div className="space-y-2">
                  {demoSteps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        currentStep === index
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          currentStep === index
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{step.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Platform Features
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: <ShieldCheck className="h-5 w-5 text-primary-500" />,
                      title: "Comprehensive HIPAA Assessment",
                      description: "10-question evaluation with detailed scoring",
                      link: "/hipaa-check"
                    },
                    {
                      icon: <Server className="h-5 w-5 text-secondary-500" />,
                      title: "Dependency Mapping",
                      description: "Visualize critical system relationships",
                      link: "/dependency-manager"
                    },
                    {
                      icon: <BarChart className="h-5 w-5 text-accent-500" />,
                      title: "Impact Analysis Tools",
                      description: "Assess business and operational risks",
                      link: "/business-impact"
                    },
                    {
                      icon: <Users className="h-5 w-5 text-success-500" />,
                      title: "Interactive Training",
                      description: "Compliance education with certification",
                      link: "/training"
                    },
                    {
                      icon: <Download className="h-5 w-5 text-warning-500" />,
                      title: "Resource Library",
                      description: "Templates, policies, and guides",
                      link: "/toolkit"
                    }
                  ].map((feature) => (
                    <div key={feature.title} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                      <Link to={feature.link}>
                        <Button size="sm" variant="ghost">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Demo CTA */}
              <Card className="p-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <h3 className="text-lg font-medium text-primary-800 dark:text-primary-200 mb-2">
                  Ready to try the real platform?
                </h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm mb-4">
                  Start with a free assessment to see how MediSoluce can improve your compliance posture.
                </p>
                <div className="flex flex-col space-y-2">
                  <Link to="/hipaa-check">
                    <Button size="sm" fullWidth>
                      Start Free Assessment
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" fullWidth>
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Key Benefits */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Why Choose MediSoluce?
                </h3>
                <div className="space-y-3">
                  {[
                    "Healthcare-specific compliance tools",
                    "Integrated risk and dependency management", 
                    "Privacy-first design with local data storage",
                    "Comprehensive training and certification",
                    "Expert-designed templates and resources"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-success-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;