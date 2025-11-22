import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../../hooks/useLocalStorage';
import { analytics } from '../../utils/analytics';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  description?: string;
  options: {
    id: string;
    text: string;
    value: number;
  }[];
  frameworks?: string[]; // Regulatory frameworks (e.g., "HIPAA Security Rule §164.308(a)(1)")
  regulations?: string[]; // Specific regulatory citations
}

export interface AssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    text: string;
  }[];
}

interface AssessmentEngineProps {
  title: string;
  description: string;
  questions: Question[];
  calculateResults: (answers: Record<string, string>) => AssessmentResult;
  onComplete?: (result: AssessmentResult) => void;
}

const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  title,
  description,
  questions,
  calculateResults,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Privacy-by-design: Store assessment results locally
  const [savedAssessments, setSavedAssessments] = useLocalStorage('hipaa-assessments', []);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeAssessment = () => {
    const assessmentResult = calculateResults(answers);
    setResult(assessmentResult);
    setIsCompleted(true);
    
    // Save assessment result locally (privacy-by-design)
    const assessmentData = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString(),
      answers,
      result: assessmentResult,
    };
    
    setSavedAssessments([...savedAssessments, assessmentData]);
    
    // Track assessment completion
    analytics.trackAssessmentComplete(title, assessmentResult.percentage);
    
    if (onComplete) {
      onComplete(assessmentResult);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setIsCompleted(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = answers[currentQuestion?.id];
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
              </div>

              <div className="mb-4">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {currentQuestion.text}
                </h3>
                {currentQuestion.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {currentQuestion.description}
                  </p>
                )}

                <div className="space-y-3 mt-4">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedOptionId === option.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 flex-shrink-0 rounded-full border ${
                            selectedOptionId === option.id
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {selectedOptionId === option.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                        <span className="ml-3 text-gray-800 dark:text-gray-200">
                          {option.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Previous
                </Button>
                <Button
                  onClick={goToNextQuestion}
                  disabled={!selectedOptionId}
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  Assessment Results
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your compliance score and recommendations
                </p>
              </div>

              <div className="mb-8">
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        className="dark:stroke-gray-700"
                      />
                      {/* Score circle with rounded ends */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getScoreColor(result?.percentage || 0)}
                        strokeWidth="8"
                        strokeDasharray={`${result ? result.percentage * 2.83 : 0} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{result?.percentage}%</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Compliance Score
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-lg">
                    Score: {result?.score} out of {result?.maxScore} points
                  </p>
                  <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                    {getScoreMessage(result?.percentage || 0)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Recommendations
                </h3>
                <div className="space-y-4">
                  {result?.recommendations
                    .sort((a, b) => {
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .map((recommendation, index) => (
                      <div 
                        key={index}
                        className={`p-4 border-l-4 rounded-r-lg ${getPriorityColor(recommendation.priority)}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {recommendation.priority === 'high' ? (
                              <AlertCircle className="h-5 w-5 text-accent-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-primary-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                            </span>
                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                              {recommendation.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Framework Coverage */}
              {questions.some(q => q.frameworks || q.regulations) && (
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                    Regulatory Framework Coverage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from(new Set(questions.flatMap(q => [...(q.frameworks || []), ...(q.regulations || [])]))).map((framework, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-primary-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{framework}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={resetAssessment}
                  variant="outline"
                >
                  Retake Assessment
                </Button>
                <Button
                  icon={<FileText className="h-4 w-4" />}
                  iconPosition="left"
                  onClick={() => generatePDFReport(result)}
                >
                  Download Report
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper functions
const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return '#198754'; // Success
  if (percentage >= 60) return '#ffc107'; // Warning
  return '#dc3545'; // Danger
};

const getScoreMessage = (percentage: number): string => {
  if (percentage >= 80) {
    return 'Great job! Your organization shows strong compliance practices.';
  } else if (percentage >= 60) {
    return 'You have a good foundation, but there are improvement opportunities.';
  } else {
    return 'Your organization has significant compliance gaps that need addressing.';
  }
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return 'border-accent-500 bg-accent-50 dark:bg-accent-900/20';
    case 'medium':
      return 'border-warning-500 bg-warning-50 dark:bg-warning-900/20';
    case 'low':
      return 'border-success-500 bg-success-50 dark:bg-success-900/20';
    default:
      return 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800';
  }
};

// PDF Report Generation Function
const generatePDFReport = (result: AssessmentResult | null) => {
  try {
    if (!result) {
      console.error('Cannot generate report: Assessment result is null');
      return;
    }

    // Validate required properties
    if (typeof result.score === 'undefined' || 
        typeof result.maxScore === 'undefined' || 
        typeof result.percentage === 'undefined' ||
        !Array.isArray(result.recommendations)) {
      console.error('Cannot generate report: Invalid assessment result structure', result);
      return;
    }
    
    // Track download
    try {
      analytics.trackDownload('HIPAA Assessment Report', 'TXT');
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
      // Continue with report generation even if analytics fails
    }
    
    const timestamp = new Date().toISOString();
    const reportData = {
      title: 'HIPAA Compliance Assessment Report',
      date: new Date().toLocaleDateString(),
      timestamp,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      recommendations: result.recommendations || [],
      companyInfo: 'Generated by MediSoluce Healthcare Compliance Platform'
    };
    
    // Create downloadable content
    const reportContent = `
HIPAA COMPLIANCE ASSESSMENT REPORT
Generated: ${reportData.date}

EXECUTIVE SUMMARY
Compliance Score: ${result.percentage}% (${result.score}/${result.maxScore} points)

ASSESSMENT RESULTS
${getScoreMessage(result.percentage)}

RECOMMENDATIONS
${result.recommendations && result.recommendations.length > 0
  ? result.recommendations.map((rec, index) => 
      `${index + 1}. [${(rec.priority || 'medium').toUpperCase()} PRIORITY] ${rec.text || 'No description'}`
    ).join('\n')
  : 'No specific recommendations at this time.'}

NEXT STEPS
1. Address high-priority recommendations immediately
2. Develop implementation timeline for medium-priority items
3. Schedule follow-up assessment in 6 months
4. Document all remediation efforts for compliance records

ASSESSMENT METADATA
Generated: ${timestamp}
Assessment ID: ${Date.now()}
Report Version: 1.0
This report was generated by MediSoluce Healthcare Compliance Platform.
For technical support or consultation, contact: support@medisoluce.com`;

    // Create and trigger download
    try {
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hipaa-assessment-report-${new Date().toISOString().split('T')[0]}.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      // Store download history
      try {
        const downloads = JSON.parse(localStorage.getItem('download-history') || '[]');
        downloads.push({
          filename: `hipaa-assessment-report-${new Date().toISOString().split('T')[0]}.txt`,
          timestamp: new Date().toISOString(),
          type: 'Assessment Report'
        });
        localStorage.setItem('download-history', JSON.stringify(downloads));
      } catch (storageError) {
        console.warn('Failed to save download history:', storageError);
        // Continue even if storage fails
      }
    } catch (downloadError) {
      console.error('Failed to generate report download:', downloadError);
      // Fallback: try to open in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<pre>${reportContent}</pre>`);
      } else {
        alert('Unable to download report. Please check your browser settings or try copying the report content manually.');
      }
    }
  } catch (error) {
    console.error('Error generating assessment report:', error);
    alert('An error occurred while generating the report. Please try again or contact support.');
  }
};

export default AssessmentEngine;