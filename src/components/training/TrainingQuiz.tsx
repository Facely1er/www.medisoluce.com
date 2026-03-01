import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, RotateCcw, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Card from '../ui/Card';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TrainingQuizProps {
  moduleId: string;
  moduleName: string;
  questions: QuizQuestion[];
  passingScore: number;
  onComplete: (passed: boolean, score: number) => void;
}

const TrainingQuiz: React.FC<TrainingQuizProps> = ({
  moduleId,
  moduleName,
  questions,
  passingScore,
  onComplete
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
    const score = calculateScore();
    const passed = score >= passingScore;
    onComplete(passed, score);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    const correct = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    return Math.round((correct / questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto min-w-0 w-full">
        {/* Results Summary */}
        <Card className={`mb-6 p-6 sm:p-8 border-l-4 ${passed ? 'border-success-500 bg-success-50 dark:bg-success-900/20' : 'border-warning-500 bg-warning-50 dark:bg-warning-900/20'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 min-w-0">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                {passed ? t('training.quiz.passed') : t('training.quiz.not_passed')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {moduleName} {t('training.quiz.assessment')}
              </p>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <div className={`text-5xl font-bold ${passed ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'}`}>
                {score}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('training.quiz.passing_score')}: {passingScore}%
              </div>
            </div>
          </div>

          {passed ? (
            <div className="flex items-center gap-3 p-4 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <Award className="h-8 w-8 text-success-600 dark:text-success-400" />
              <div>
                <p className="font-semibold text-success-900 dark:text-success-100">
                  {t('training.quiz.congratulations')}
                </p>
                <p className="text-sm text-success-700 dark:text-success-300">
                  {t('training.quiz.certificate_available')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
              <XCircle className="h-8 w-8 text-warning-600 dark:text-warning-400" />
              <div>
                <p className="font-semibold text-warning-900 dark:text-warning-100">
                  {t('training.quiz.keep_trying')}
                </p>
                <p className="text-sm text-warning-700 dark:text-warning-300">
                  {t('training.quiz.review_retake')}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Question Review */}
        <Card className="mb-6 p-6 sm:p-8 min-w-0 overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('training.quiz.answer_review')}
          </h3>
          <div className="space-y-6 min-w-0">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={index} className={`p-4 sm:p-6 rounded-lg border-2 min-w-0 overflow-hidden ${isCorrect ? 'border-success-300 bg-success-50 dark:bg-success-900/10' : 'border-error-300 bg-error-50 dark:bg-error-900/10'}`}>
                  <div className="flex items-start gap-3 mb-4 min-w-0">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-success-600 dark:text-success-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-error-600 dark:text-error-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white mb-3 break-words">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg ${
                              optIndex === question.correctAnswer
                                ? 'bg-success-100 dark:bg-success-900/30 border-2 border-success-500'
                                : optIndex === userAnswer && !isCorrect
                                ? 'bg-error-100 dark:bg-error-900/30 border-2 border-error-500'
                                : 'bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {optIndex === question.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-success-600 dark:text-success-400" />
                              )}
                              {optIndex === userAnswer && !isCorrect && (
                                <XCircle className="h-4 w-4 text-error-600 dark:text-error-400" />
                              )}
                              <span className={optIndex === question.correctAnswer ? 'font-semibold' : ''}>
                                {option}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {t('training.quiz.explanation')}:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/training')}
            >
              {t('training.back_to_modules')}
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              {!passed && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  icon={<RotateCcw className="h-5 w-5" />}
                >
                  {t('training.quiz.retake')}
                </Button>
              )}
              
              {passed && (
                <Button
                  onClick={() => navigate(`/training/${moduleId}/certificate`)}
                  icon={<Download className="h-5 w-5" />}
                  className="bg-gradient-to-r from-success-500 to-success-600"
                >
                  {t('training.quiz.download_certificate')}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
  const answeredCount = selectedAnswers.filter(a => a !== -1).length;

  return (
    <div className="max-w-4xl mx-auto min-w-0 w-full">
      {/* Progress */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {moduleName} {t('training.quiz.assessment')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('training.quiz.question')} {currentQuestion + 1} {t('training.of')} {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {answeredCount}/{questions.length} {t('training.quiz.answered')}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* Question */}
      <Card className="mb-6 p-8">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">
            {currentQuestion + 1}
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4 break-words">
            {currentQ.question}
          </h2>
        </div>

        <div className="space-y-3 min-w-0">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all min-w-0 ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <CheckCircle className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white break-words min-w-0">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            {t('training.quiz.previous')}
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400 order-last w-full sm:order-none sm:w-auto text-center sm:text-left">
            {selectedAnswers[currentQuestion] === -1 && (
              <span>{t('training.quiz.select_answer')}</span>
            )}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
              className="bg-gradient-to-r from-success-500 to-success-600"
            >
              {t('training.quiz.submit')}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              {t('training.quiz.next')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TrainingQuiz;

