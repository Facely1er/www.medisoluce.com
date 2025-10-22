import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Shield, 
  Server, 
  Users,
  TrendingUp,
  FileText,
  Download,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Breadcrumbs from '../navigation/Breadcrumbs';
import useLocalStorage from '../../hooks/useLocalStorage';

interface EnhancedRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'hipaa' | 'ransomware' | 'dependency' | 'continuity';
  impact: {
    compliance: number; // 0-100
    security: number;   // 0-100
    business: number;   // 0-100
    cost: number;       // Estimated cost
  };
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  dependencies: string[];
  resources: string[];
  metrics: {
    before: number;
    after: number;
    improvement: number;
  };
}

interface ComprehensiveAssessmentResult {
  overallScore: number;
  categoryScores: {
    hipaa: number;
    ransomware: number;
    dependency: number;
    continuity: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: EnhancedRecommendation[];
  executiveSummary: string;
  detailedAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  nextSteps: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

const EnhancedAssessmentEngine: React.FC = () => {
  const { t } = useTranslation();
  const [assessmentData, setAssessmentData] = useState<{
    hipaa?: { result?: { percentage: number } };
    dependency?: Array<{ 
      name: string; 
      category: string; 
      criticality: string; 
      riskLevel: string; 
      backupProcedures?: string[] 
    }>;
    continuity?: Array<{ status: string }>;
  }>({});
  const [comprehensiveResult, setComprehensiveResult] = useState<ComprehensiveAssessmentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedAssessments] = useLocalStorage('comprehensive-assessments', []);

  useEffect(() => {
    // Load existing assessment data
    const hipaaAssessments = JSON.parse(localStorage.getItem('hipaa-assessments') || '[]');
    const dependencies = JSON.parse(localStorage.getItem('system-dependencies') || '[]');
    const continuityPlans = JSON.parse(localStorage.getItem('continuity-plans') || '[]');
    
    setAssessmentData({
      hipaa: hipaaAssessments[hipaaAssessments.length - 1],
      dependency: dependencies,
      continuity: continuityPlans
    });
  }, []);

  const generateComprehensiveAssessment = async () => {
    setIsGenerating(true);
    
    // Simulate comprehensive analysis based on existing data
    const result: ComprehensiveAssessmentResult = {
      overallScore: calculateOverallScore(),
      categoryScores: {
        hipaa: assessmentData.hipaa?.result?.percentage || 0,
        ransomware: calculateRansomwareScore(),
        dependency: calculateDependencyScore(),
        continuity: calculateContinuityScore()
      },
      riskLevel: calculateRiskLevel(),
      recommendations: generatePrioritizedRecommendations(),
      executiveSummary: generateExecutiveSummary(),
      detailedAnalysis: generateDetailedAnalysis(),
      nextSteps: generateNextSteps()
    };
    
    setComprehensiveResult(result);
    
    // Save comprehensive assessment
    const comprehensiveAssessments = JSON.parse(localStorage.getItem('comprehensive-assessments') || '[]');
    comprehensiveAssessments.push({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      result: result
    });
    localStorage.setItem('comprehensive-assessments', JSON.stringify(comprehensiveAssessments));
    
    setIsGenerating(false);
  };

  const calculateOverallScore = (): number => {
    const hipaaScore = assessmentData.hipaa?.result?.percentage || 0;
    const ransomwareScore = calculateRansomwareScore();
    const dependencyScore = calculateDependencyScore();
    const continuityScore = calculateContinuityScore();
    
    return Math.round((hipaaScore + ransomwareScore + dependencyScore + continuityScore) / 4);
  };

  const calculateRansomwareScore = (): number => {
    // Simulate ransomware assessment based on common vulnerabilities
    let score = 30; // Base score
    
    // Check for backup systems
    const dependencies = assessmentData.dependency || [];
    const hasBackupSystems = dependencies.some((dep) => 
      dep.name.toLowerCase().includes('backup') || 
      dep.backupProcedures?.length > 0
    );
    if (hasBackupSystems) score += 20;
    
    // Check for security measures
    const hasSecurityMeasures = dependencies.some((dep) => 
      dep.category === 'infrastructure' && dep.riskLevel === 'Low'
    );
    if (hasSecurityMeasures) score += 15;
    
    return Math.min(score, 100);
  };

  const calculateDependencyScore = (): number => {
    const dependencies = assessmentData.dependency || [];
    if (dependencies.length === 0) return 0;
    
    const criticalDeps = dependencies.filter((dep) => dep.criticality === 'Critical');
    const highRiskDeps = dependencies.filter((dep) => dep.riskLevel === 'High');
    
    let score = 50; // Base score
    score += Math.min(criticalDeps.length * 5, 25); // Bonus for mapping critical systems
    score -= highRiskDeps.length * 10; // Penalty for high-risk dependencies
    
    return Math.max(Math.min(score, 100), 0);
  };

  const calculateContinuityScore = (): number => {
    const continuityPlans = assessmentData.continuity || [];
    if (continuityPlans.length === 0) return 20;
    
    const activePlans = continuityPlans.filter((plan) => plan.status === 'Active');
    let score = 30; // Base score for having plans
    
    score += activePlans.length * 15; // Bonus for active plans
    score += Math.min(continuityPlans.length * 5, 20); // Bonus for multiple plans
    
    return Math.min(score, 100);
  };

  const calculateRiskLevel = (): 'low' | 'medium' | 'high' | 'critical' => {
    const overallScore = calculateOverallScore();
    const ransomwareScore = calculateRansomwareScore();
    
    if (overallScore < 40 || ransomwareScore < 30) return 'critical';
    if (overallScore < 60 || ransomwareScore < 50) return 'high';
    if (overallScore < 80) return 'medium';
    return 'low';
  };

  const generatePrioritizedRecommendations = (): EnhancedRecommendation[] => {
    const recommendations: EnhancedRecommendation[] = [];
    
    // Ransomware recommendations (highest priority)
    if (calculateRansomwareScore() < 50) {
      recommendations.push({
        id: 'ransomware-backup',
        title: 'Implement Immutable Backup System',
        description: 'Deploy air-gapped, immutable backup solution to protect against ransomware encryption',
        priority: 'critical',
        category: 'ransomware',
        impact: {
          compliance: 15,
          security: 85,
          business: 90,
          cost: 25000
        },
        effort: 'medium',
        timeline: '2-4 weeks',
        dependencies: ['IT infrastructure assessment', 'Budget approval'],
        resources: ['IT team', 'Security consultant', 'Backup vendor'],
        metrics: {
          before: 30,
          after: 95,
          improvement: 65
        }
      });
      
      recommendations.push({
        id: 'ransomware-training',
        title: 'Implement Ransomware Awareness Training',
        description: 'Conduct comprehensive ransomware awareness training with phishing simulations',
        priority: 'high',
        category: 'ransomware',
        impact: {
          compliance: 20,
          security: 70,
          business: 60,
          cost: 8000
        },
        effort: 'low',
        timeline: '1-2 weeks',
        dependencies: ['Training content development'],
        resources: ['HR team', 'Security team', 'Training vendor'],
        metrics: {
          before: 40,
          after: 85,
          improvement: 45
        }
      });
    }
    
    // HIPAA recommendations
    const hipaaScore = assessmentData.hipaa?.result?.percentage || 0;
    if (hipaaScore < 80) {
      recommendations.push({
        id: 'hipaa-training',
        title: 'Comprehensive HIPAA Training Program',
        description: 'Implement mandatory HIPAA training for all staff with regular refreshers',
        priority: 'high',
        category: 'hipaa',
        impact: {
          compliance: 90,
          security: 60,
          business: 40,
          cost: 15000
        },
        effort: 'low',
        timeline: '1-2 weeks',
        dependencies: ['Training content development'],
        resources: ['HR team', 'Compliance officer', 'Training vendor'],
        metrics: {
          before: hipaaScore,
          after: Math.min(hipaaScore + 25, 100),
          improvement: Math.min(25, 100 - hipaaScore)
        }
      });
    }
    
    // Dependency management recommendations
    const dependencyScore = calculateDependencyScore();
    if (dependencyScore < 70) {
      recommendations.push({
        id: 'dependency-mapping',
        title: 'Complete System Dependency Mapping',
        description: 'Map all critical system dependencies and create recovery procedures',
        priority: 'high',
        category: 'dependency',
        impact: {
          compliance: 20,
          security: 40,
          business: 80,
          cost: 20000
        },
        effort: 'high',
        timeline: '4-6 weeks',
        dependencies: ['System inventory', 'Vendor coordination'],
        resources: ['IT team', 'Business analysts', 'Vendors'],
        metrics: {
          before: dependencyScore,
          after: Math.min(dependencyScore + 30, 100),
          improvement: Math.min(30, 100 - dependencyScore)
        }
      });
    }
    
    // Business continuity recommendations
    const continuityScore = calculateContinuityScore();
    if (continuityScore < 80) {
      recommendations.push({
        id: 'continuity-testing',
        title: 'Business Continuity Plan Testing',
        description: 'Conduct comprehensive testing of business continuity procedures',
        priority: 'medium',
        category: 'continuity',
        impact: {
          compliance: 30,
          security: 25,
          business: 70,
          cost: 10000
        },
        effort: 'medium',
        timeline: '2-3 weeks',
        dependencies: ['Plan documentation', 'Staff availability'],
        resources: ['Emergency management team', 'Department heads'],
        metrics: {
          before: continuityScore,
          after: Math.min(continuityScore + 20, 100),
          improvement: Math.min(20, 100 - continuityScore)
        }
      });
    }
    
    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const generateExecutiveSummary = (): string => {
    const overallScore = calculateOverallScore();
    const riskLevel = calculateRiskLevel();
    const ransomwareScore = calculateRansomwareScore();
    
    if (riskLevel === 'critical') {
      return `Your organization faces critical compliance and security risks with an overall score of ${overallScore}%. Ransomware protection is severely inadequate at ${ransomwareScore}%, posing immediate threats to patient data and business operations. Immediate action on immutable backups, staff training, and incident response planning is essential to prevent catastrophic data breaches.`;
    } else if (riskLevel === 'high') {
      return `Your organization demonstrates significant compliance gaps with an overall score of ${overallScore}%. While some areas show promise, ransomware protection requires urgent attention at ${ransomwareScore}%. Critical vulnerabilities in backup systems and staff training pose substantial risks to patient data security and business continuity.`;
    } else if (riskLevel === 'medium') {
      return `Your organization shows moderate compliance readiness with an overall score of ${overallScore}%. HIPAA compliance is reasonable, but ransomware protection needs improvement at ${ransomwareScore}%. Focus on enhancing backup systems and staff training to achieve compliance targets.`;
    } else {
      return `Your organization demonstrates strong compliance readiness with an overall score of ${overallScore}%. Most areas meet or exceed compliance requirements, with ransomware protection at ${ransomwareScore}%. Continue monitoring and regular assessments to maintain compliance standards.`;
    }
  };

  const generateDetailedAnalysis = () => {
    const hipaaScore = assessmentData.hipaa?.result?.percentage || 0;
    const ransomwareScore = calculateRansomwareScore();
    const dependencyScore = calculateDependencyScore();
    const continuityScore = calculateContinuityScore();
    
    return {
      strengths: [
        hipaaScore > 80 ? 'Strong HIPAA policy framework' : null,
        dependencyScore > 70 ? 'Good system documentation' : null,
        continuityScore > 70 ? 'Established incident response procedures' : null,
        'Comprehensive assessment tools available'
      ].filter(Boolean) as string[],
      weaknesses: [
        ransomwareScore < 50 ? 'Inadequate ransomware protection' : null,
        dependencyScore < 60 ? 'Limited backup system resilience' : null,
        hipaaScore < 70 ? 'Insufficient staff training frequency' : null,
        continuityScore < 60 ? 'Incomplete business continuity planning' : null
      ].filter(Boolean) as string[],
      opportunities: [
        'Implement automated compliance monitoring',
        'Develop vendor risk management program',
        'Create cross-training programs',
        'Establish continuous improvement processes'
      ],
      threats: [
        ransomwareScore < 50 ? 'Ransomware attack vulnerability' : null,
        hipaaScore < 80 ? 'Regulatory non-compliance risk' : null,
        dependencyScore < 70 ? 'Business disruption potential' : null,
        'Evolving cybersecurity threats'
      ].filter(Boolean) as string[]
    };
  };

  const generateNextSteps = () => {
    const recommendations = generatePrioritizedRecommendations();
    const criticalRecs = recommendations.filter(r => r.priority === 'critical');
    const highRecs = recommendations.filter(r => r.priority === 'high');
    const mediumRecs = recommendations.filter(r => r.priority === 'medium');
    
    return {
      immediate: [
        ...criticalRecs.slice(0, 2).map(r => r.title),
        'Conduct ransomware vulnerability assessment',
        'Update incident response procedures'
      ],
      shortTerm: [
        ...highRecs.slice(0, 2).map(r => r.title),
        'Complete HIPAA training program',
        'Test business continuity procedures'
      ],
      longTerm: [
        ...mediumRecs.slice(0, 2).map(r => r.title),
        'Implement continuous compliance monitoring',
        'Develop vendor risk management program',
        'Create comprehensive security awareness program'
      ]
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Clock className="h-5 w-5" />;
      case 'low': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const exportComprehensiveReport = () => {
    if (!comprehensiveResult) return;
    
    const reportContent = `
COMPREHENSIVE HEALTHCARE COMPLIANCE ASSESSMENT REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${comprehensiveResult.executiveSummary}

OVERALL SCORE: ${comprehensiveResult.overallScore}%
Risk Level: ${comprehensiveResult.riskLevel.toUpperCase()}

CATEGORY SCORES:
- HIPAA Compliance: ${comprehensiveResult.categoryScores.hipaa}%
- Ransomware Protection: ${comprehensiveResult.categoryScores.ransomware}%
- Dependency Management: ${comprehensiveResult.categoryScores.dependency}%
- Business Continuity: ${comprehensiveResult.categoryScores.continuity}%

PRIORITIZED RECOMMENDATIONS:
${comprehensiveResult.recommendations.map((rec, index) => `
${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}
   Impact: Compliance +${rec.impact.compliance}%, Security +${rec.impact.security}%, Business +${rec.impact.business}%
   Cost: $${rec.impact.cost.toLocaleString()}
   Timeline: ${rec.timeline}
   Effort: ${rec.effort}
   Description: ${rec.description}
   Expected Improvement: ${rec.metrics.before}% → ${rec.metrics.after}% (+${rec.metrics.improvement}%)
   Resources Needed: ${rec.resources.join(', ')}
`).join('\n')}

DETAILED ANALYSIS:
Strengths:
${comprehensiveResult.detailedAnalysis.strengths.map(s => `- ${s}`).join('\n')}

Weaknesses:
${comprehensiveResult.detailedAnalysis.weaknesses.map(w => `- ${w}`).join('\n')}

Opportunities:
${comprehensiveResult.detailedAnalysis.opportunities.map(o => `- ${o}`).join('\n')}

Threats:
${comprehensiveResult.detailedAnalysis.threats.map(t => `- ${t}`).join('\n')}

NEXT STEPS:
Immediate (0-30 days):
${comprehensiveResult.nextSteps.immediate.map(s => `- ${s}`).join('\n')}

Short Term (1-3 months):
${comprehensiveResult.nextSteps.shortTerm.map(s => `- ${s}`).join('\n')}

Long Term (3-12 months):
${comprehensiveResult.nextSteps.longTerm.map(s => `- ${s}`).join('\n')}

Generated by MediSoluce Healthcare Compliance Platform
Report ID: ${Date.now()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprehensive-assessment-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs />
          
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Assessment Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Integrated analysis of HIPAA compliance, ransomware protection, dependency management, and business continuity readiness.
            </p>
          </div>

          {!comprehensiveResult ? (
            <Card className="p-8 text-center">
              <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Generate Comprehensive Assessment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Run a complete analysis of your healthcare compliance posture across all critical areas.
              </p>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      HIPAA: {assessmentData.hipaa?.result?.percentage || 0}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Dependencies: {(assessmentData.dependency || []).length} systems
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Continuity: {(assessmentData.continuity || []).length} plans
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Previous: {savedAssessments.length} assessments
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={generateComprehensiveAssessment}
                disabled={isGenerating}
                size="lg"
                icon={isGenerating ? <Clock className="h-5 w-5 animate-spin" /> : <TrendingUp className="h-5 w-5" />}
              >
                {isGenerating ? 'Analyzing...' : 'Start Comprehensive Assessment'}
              </Button>
            </Card>
          ) : (
            <>
              {/* Executive Summary */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Executive Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {comprehensiveResult.overallScore}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      comprehensiveResult.riskLevel === 'critical' ? 'text-red-600' :
                      comprehensiveResult.riskLevel === 'high' ? 'text-orange-600' :
                      comprehensiveResult.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {comprehensiveResult.riskLevel.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {comprehensiveResult.recommendations.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Recommendations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {comprehensiveResult.recommendations.filter(r => r.priority === 'critical').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Critical Items</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comprehensiveResult.executiveSummary}
                </p>
              </Card>

              {/* Category Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <Shield className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {comprehensiveResult.categoryScores.hipaa}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">HIPAA Compliance</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${comprehensiveResult.categoryScores.hipaa}%` }}
                    />
                  </div>
                </Card>

                <Card className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {comprehensiveResult.categoryScores.ransomware}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Ransomware Protection</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${comprehensiveResult.categoryScores.ransomware}%` }}
                    />
                  </div>
                </Card>

                <Card className="p-6 text-center">
                  <Server className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {comprehensiveResult.categoryScores.dependency}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Dependency Management</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${comprehensiveResult.categoryScores.dependency}%` }}
                    />
                  </div>
                </Card>

                <Card className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {comprehensiveResult.categoryScores.continuity}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Business Continuity</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${comprehensiveResult.categoryScores.continuity}%` }}
                    />
                  </div>
                </Card>
              </div>

              {/* Prioritized Recommendations */}
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Prioritized Recommendations
                  </h2>
                  <Button
                    onClick={exportComprehensiveReport}
                    variant="outline"
                    icon={<Download className="h-4 w-4" />}
                  >
                    Export Report
                  </Button>
                </div>

                <div className="space-y-4">
                  {comprehensiveResult.recommendations.map((rec, index) => (
                    <div key={rec.id} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getPriorityIcon(rec.priority)}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {index + 1}. {rec.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ${rec.impact.cost.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            {rec.timeline}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Impact</div>
                          <div className="flex space-x-2 text-xs">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded">
                              Compliance +{rec.impact.compliance}%
                            </span>
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
                              Security +{rec.impact.security}%
                            </span>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                              Business +{rec.impact.business}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Effort</div>
                          <div className="text-sm font-medium capitalize">{rec.effort}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Expected Improvement</div>
                          <div className="text-sm font-medium">
                            {rec.metrics.before}% → {rec.metrics.after}% (+{rec.metrics.improvement}%)
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        <strong>Resources needed:</strong> {rec.resources.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Next Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Immediate (0-30 days)
                  </h3>
                  <ul className="space-y-2">
                    {comprehensiveResult.nextSteps.immediate.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    Short Term (1-3 months)
                  </h3>
                  <ul className="space-y-2">
                    {comprehensiveResult.nextSteps.shortTerm.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    Long Term (3-12 months)
                  </h3>
                  <ul className="space-y-2">
                    {comprehensiveResult.nextSteps.longTerm.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAssessmentEngine;

