import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Award, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ReactMarkdown from 'react-markdown';

export interface LessonContent {
  title: string;
  content: string;
  keyPoints?: string[];
  example?: string;
  practicalApplication?: string;
}

export interface TrainingLessonProps {
  moduleId: string;
  moduleName: string;
  lessonIndex: number;
  totalLessons: number;
  lesson: LessonContent;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isCompleted: boolean;
  showQuiz?: boolean;
}

const TrainingLesson: React.FC<TrainingLessonProps> = ({
  moduleId,
  moduleName,
  lessonIndex,
  totalLessons,
  lesson,
  onComplete,
  onNext,
  onPrevious,
  isCompleted,
  showQuiz = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [lessonCompleted, setLessonCompleted] = useState(isCompleted);

  useEffect(() => {
    // Track time spent on lesson
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      console.log(`Time spent on lesson: ${timeSpent} seconds`);
    };
  }, []);

  const handleComplete = () => {
    if (!lessonCompleted) {
      setLessonCompleted(true);
      onComplete();
    }
    if (onNext) {
      onNext();
    }
  };

  const progress = Math.round(((lessonIndex + 1) / totalLessons) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {moduleName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('training.lesson')} {lessonIndex + 1} {t('training.of')} {totalLessons}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {progress}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('training.complete')}
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

      {/* Lesson Content */}
      <Card className="mb-6 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {lesson.title}
          </h1>
          {lessonCompleted && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 rounded-full text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>{t('training.lesson_completed')}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="prose dark:prose-invert max-w-none mb-8">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>

        {/* Key Points */}
        {lesson.keyPoints && lesson.keyPoints.length > 0 && (
          <div className="mb-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              {t('training.key_takeaways')}
            </h3>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Example */}
        {lesson.example && (
          <div className="mb-8 p-6 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border-l-4 border-secondary-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 {t('training.example')}
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{lesson.example}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Practical Application */}
        {lesson.practicalApplication && (
          <div className="mb-8 p-6 bg-success-50 dark:bg-success-900/20 rounded-lg border-l-4 border-success-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 {t('training.practical_application')}
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{lesson.practicalApplication}</ReactMarkdown>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            {onPrevious && (
              <Button
                variant="outline"
                onClick={onPrevious}
                icon={<ChevronLeft className="h-5 w-5" />}
              >
                {t('training.previous_lesson')}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/training')}
            >
              {t('training.back_to_modules')}
            </Button>
            
            {showQuiz ? (
              <Button
                onClick={handleComplete}
                icon={<Award className="h-5 w-5" />}
                className="bg-gradient-to-r from-success-500 to-success-600"
              >
                {t('training.take_assessment')}
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                icon={lessonCompleted ? <ChevronRight className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                iconPosition="right"
              >
                {lessonCompleted ? t('training.next_lesson') : t('training.mark_complete_continue')}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Resources */}
      <Card className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          {t('training.additional_resources')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/toolkit')}
            className="justify-start"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('training.download_templates')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/training/${moduleId}/materials`)}
            className="justify-start"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('training.study_materials')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TrainingLesson;

