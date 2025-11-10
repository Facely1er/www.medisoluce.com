import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOHead from '../components/ui/SEOHead';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShieldCheck, Lock, FileText, CheckCircle, Star, ArrowRight, Users, Briefcase, Shield, Wrench, Calculator, AlertCircle } from 'lucide-react';
import { calculateDynamicPricing, getPricingFactorsFromStorage, type CalculatedPricing } from '../utils/pricingCalculator';

const PricingOverviewPage: React.FC = () => {
  const [dynamicPricing, setDynamicPricing] = useState<CalculatedPricing | null>(null);
  const [showStandardPricing, setShowStandardPricing] = useState(false);

  // Calculate dynamic pricing based on user's assessment data
  useEffect(() => {
    const factors = getPricingFactorsFromStorage();
    const calculated = calculateDynamicPricing(factors, 'bundle');
    setDynamicPricing(calculated);
  }, []);

  const stakeholders = [
    { id: 'all', label: 'View All', icon: <Users className="h-4 w-4" />, color: 'gray' },
    { id: 'executive', label: '👔 C-Level Executive', icon: <Briefcase className="h-4 w-4" />, color: 'primary' },
    { id: 'compliance', label: '📋 Compliance Officer', icon: <Shield className="h-4 w-4" />, color: 'primary' },
    { id: 'it', label: '💻 IT Director', icon: <Wrench className="h-4 w-4" />, color: 'accent' },
    { id: 'operations', label: '⚕️ Operations Manager', icon: <FileText className="h-4 w-4" />, color: 'success' },
    { id: 'practice', label: '🏥 Practice Manager', icon: <Users className="h-4 w-4" />, color: 'secondary' }
  ];

  const roleBasedRecommendations = {
    executive: {
      title: 'For C-Level Executives',
      subtitle: 'Financial risk mitigation and business continuity',
      recommended: 'Professional Bundle',
      price: '$299/month',
      savings: 'Protect $10.9M in potential losses',
      features: ['ROI reporting', 'Business impact analysis', 'Board-ready compliance', 'Financial risk mitigation'],
      painPoint: 'Financial liability and operational disruption',
      icon: <Briefcase className="h-12 w-12" />
    },
    compliance: {
      title: 'For Compliance Officers',
      subtitle: 'Audit readiness and regulatory compliance',
      recommended: 'Professional HIPAA Suite',
      price: '$149/month',
      savings: 'Audit-ready in 30 days',
      features: ['HIPAA documentation', 'Training tracking', 'Audit trail', 'Compliance reporting'],
      painPoint: 'Regulatory requirements and audit readiness',
      icon: <Shield className="h-12 w-12" />
    },
    it: {
      title: 'For IT Directors / CISOs',
      subtitle: 'Security and technical resilience',
      recommended: 'Enterprise Bundle',
      price: '$999/month',
      savings: 'Enterprise-grade security',
      features: ['99.9% uptime SLA', 'SOC monitoring', 'Incident response', 'Custom integrations'],
      painPoint: 'Technical infrastructure and security threats',
      icon: <Wrench className="h-12 w-12" />
    },
    operations: {
      title: 'For Operations Managers',
      subtitle: 'Business continuity and patient safety',
      recommended: 'Professional Continuity',
      price: '$149/month',
      savings: 'Reduce downtime impact',
      features: ['Continuity plans', 'Manual procedures', 'Testing schedules', 'Staff training'],
      painPoint: 'Operational disruptions and patient care',
      icon: <FileText className="h-12 w-12" />
    },
    practice: {
      title: 'For Practice Managers',
      subtitle: 'Affordable compliance solution',
      recommended: 'Essential HIPAA',
      price: '$49/month',
      savings: 'No expensive consultants needed',
      features: ['Free assessment', 'Easy-to-use templates', 'Budget-friendly', 'Quick implementation'],
      painPoint: 'Budget constraints and resource limitations',
      icon: <Users className="h-12 w-12" />
    }
  };

  const suites = [
    {
      name: 'HIPAA Compliance',
      description: 'Protect patient data and avoid $100K-$1.6M HIPAA fines',
      icon: <ShieldCheck className="h-8 w-8 text-primary-500" />,
      link: '/pricing/hipaa',
      color: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
      startingPrice: '$49/month'
    },
    {
      name: 'Ransomware Resilience',
      description: 'Protect against $10.9M ransomware attacks with healthcare-specific defense',
      icon: <Lock className="h-8 w-8 text-accent-500" />,
      link: '/pricing/ransomware',
      color: 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800',
      startingPrice: '$49/month'
    },
    {
      name: 'Business Continuity',
      description: 'Ensure patient care continues with comprehensive operational resilience',
      icon: <FileText className="h-8 w-8 text-success-500" />,
      link: '/pricing/continuity',
      color: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
      startingPrice: '$49/month'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead 
        title="Pricing - MediSoluce Healthcare Compliance"
        description="Choose from our HIPAA Compliance, Ransomware Resilience, or Business Continuity suites. Save with our Complete Bundle packages."
        keywords="healthcare compliance pricing, HIPAA assessment pricing, ransomware protection pricing, business continuity pricing"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Comprehensive Healthcare Protection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              Choose individual suites or save with our Complete Bundle. Start free.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Banner */}
      {dynamicPricing && dynamicPricing.recommendations.length > 0 && (
        <section className="py-8 bg-accent-50 dark:bg-accent-900/20 border-b border-accent-200 dark:border-accent-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-2 border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Personalized Pricing Based on Your Assessment
                      </h3>
                      <button
                        onClick={() => setShowStandardPricing(!showStandardPricing)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {showStandardPricing ? 'Show Personalized' : 'Show Standard'}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {dynamicPricing.rationale}
                    </p>
                    <div className="space-y-2">
                      {dynamicPricing.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Individual Suites Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Individual Suites
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Focus on your biggest vulnerability first
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {suites.map((suite, index) => (
              <Card key={index} hover className={`h-full flex flex-col border-2 ${suite.color}`}>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                      {suite.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{suite.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{suite.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {suite.startingPrice}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">starting</span>
                    </div>
                  </div>

                  <Link to={suite.link} className="mt-auto">
                    <Button className="w-full" size="lg">
                      View {suite.name} Pricing
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
              <Star className="h-4 w-4 mr-2" />
              <span className="font-semibold">Best Value</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Bundle
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              All three suites together. Comprehensive protection, maximum savings.
            </p>
            <Link to="/pricing/bundles">
              <Button size="lg">
                View Bundle Pricing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Role-Based Recommendations */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get personalized recommendations based on your role
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(roleBasedRecommendations).map(([key, rec]) => (
              <Card key={key} hover className="p-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {rec.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {rec.price}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {rec.recommended}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Solves: {rec.painPoint}
                  </p>
                  <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{rec.savings}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {rec.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                      {feature}
                    </span>
                  ))}
                  {rec.features.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{rec.features.length - 2} more
                    </span>
                  )}
                </div>

                <Link to="/pricing/bundles">
                  <Button variant="outline" size="sm" className="w-full">
                    View Recommended Plan
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Start with our free assessment and see how much you can save
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hipaa-check">
                <Button variant="outline" size="lg" className="!bg-white !text-primary-700 hover:!bg-gray-50">
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing/calculator">
                <Button variant="outline" size="lg" className="!bg-transparent !text-white !border-white hover:!bg-white hover:!text-primary-700">
                  Calculate Your Savings
                  <Calculator className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingOverviewPage;