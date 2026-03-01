import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrainingLesson from '../../components/training/TrainingLesson';
import TrainingQuiz from '../../components/training/TrainingQuiz';
import { hipaaBasicsLessons, hipaaBasicsQuiz } from '../../data/training/hipaaBasicsContent';
import { dependencyManagementLessons, dependencyManagementQuiz } from '../../data/training/dependencyManagementContent';
import { businessContinuityLessons, businessContinuityQuiz } from '../../data/training/businessContinuityContent';
import { ransomwareProtectionLessons, ransomwareProtectionQuiz } from '../../data/training/ransomwareProtectionContent';
import { LessonContent } from '../../components/training/TrainingLesson';
import { QuizQuestion } from '../../components/training/TrainingQuiz';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ModuleConfig {
  title: string;
  lessons: LessonContent[];
  quiz: QuizQuestion[];
  passingScore: number;
}

const moduleRegistry: Record<string, ModuleConfig> = {
  'hipaa-basics': {
    title: 'HIPAA Compliance Fundamentals',
    lessons: hipaaBasicsLessons,
    quiz: hipaaBasicsQuiz,
    passingScore: 80,
  },
  'dependency-management': {
    title: 'Technology Dependency Management',
    lessons: dependencyManagementLessons,
    quiz: dependencyManagementQuiz,
    passingScore: 75,
  },
  'business-continuity': {
    title: 'Business Continuity Planning',
    lessons: businessContinuityLessons,
    quiz: businessContinuityQuiz,
    passingScore: 75,
  },
  'ransomware-protection': {
    title: 'Ransomware Protection Strategies',
    lessons: ransomwareProtectionLessons,
    quiz: ransomwareProtectionQuiz,
    passingScore: 80,
  },
};

interface ModuleProgress {
  completedLessons: number[];
  quizCompleted: boolean;
  quizScore: number;
  quizPassed: boolean;
}

const defaultProgress: ModuleProgress = {
  completedLessons: [],
  quizCompleted: false,
  quizScore: 0,
  quizPassed: false,
};

const TrainingModulePage: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();

  const module = moduleRegistry[moduleId || ''];

  const storageKey = `training_${moduleId}_progress`;

  const [progress, setProgress] = useState<ModuleProgress>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  if (!module) {
    return (
      <div className="py-8 min-w-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <Card className="p-8 text-center max-w-lg mx-auto">
            <AlertTriangle className="h-12 w-12 text-warning-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Module Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The training module "{moduleId}" could not be found.
            </p>
            <Button onClick={() => navigate('/training')}>Back to Training</Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentLessonIndex = lessonId === 'quiz' ? -1 : parseInt(lessonId || '0');
  const isQuiz = lessonId === 'quiz';

  if (isNaN(currentLessonIndex) || (currentLessonIndex < 0 && !isQuiz) ||
      (currentLessonIndex >= module.lessons.length && !isQuiz)) {
    navigate(`/training/${moduleId}/0`);
    return null;
  }

  const handleLessonComplete = () => {
    if (!progress.completedLessons.includes(currentLessonIndex)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, currentLessonIndex],
      }));
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < module.lessons.length - 1) {
      navigate(`/training/${moduleId}/${currentLessonIndex + 1}`);
    } else {
      navigate(`/training/${moduleId}/quiz`);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      navigate(`/training/${moduleId}/${currentLessonIndex - 1}`);
    }
  };

  const handleQuizComplete = (passed: boolean, score: number) => {
    setProgress(prev => ({
      ...prev,
      quizCompleted: true,
      quizScore: score,
      quizPassed: passed,
    }));
  };

  if (isQuiz) {
    return (
      <div className="py-8 min-w-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <Breadcrumbs />
          <TrainingQuiz
            moduleId={moduleId!}
            moduleName={t(`training.modules.${moduleId?.replace(/-/g, '_')}.title`, { defaultValue: module.title })}
            questions={module.quiz}
            passingScore={module.passingScore}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  const currentLesson = module.lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === module.lessons.length - 1;
  const moduleName = t(`training.modules.${moduleId?.replace(/-/g, '_')}.title`, { defaultValue: module.title });

  return (
    <div className="py-8 min-w-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <Breadcrumbs />
        <TrainingLesson
          moduleId={moduleId!}
          moduleName={moduleName}
          lessonIndex={currentLessonIndex}
          totalLessons={module.lessons.length}
          lesson={currentLesson}
          onComplete={handleLessonComplete}
          onNext={handleNext}
          onPrevious={currentLessonIndex > 0 ? handlePrevious : undefined}
          isCompleted={progress.completedLessons.includes(currentLessonIndex)}
          showQuiz={isLastLesson}
        />
      </div>
    </div>
  );
};

export default TrainingModulePage;
