import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrainingLesson from '../components/training/TrainingLesson';
import TrainingQuiz from '../components/training/TrainingQuiz';
import { hipaaBasicsLessons, hipaaBasicsQuiz } from '../data/training/hipaaBasicsContent';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

const HIPAABasicsModule: React.FC = () => {
  const { t } = useTranslation();
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  // Progress tracking with localStorage
  const [progress, setProgress] = useState<{
    completedLessons: number[];
    quizCompleted: boolean;
    quizScore: number;
    quizPassed: boolean;
  }>(() => {
    const saved = localStorage.getItem('training_hipaa_basics_progress');
    return saved ? JSON.parse(saved) : {
      completedLessons: [],
      quizCompleted: false,
      quizScore: 0,
      quizPassed: false
    };
  });

  useEffect(() => {
    localStorage.setItem('training_hipaa_basics_progress', JSON.stringify(progress));
  }, [progress]);

  const currentLessonIndex = lessonId === 'quiz' ? -1 : parseInt(lessonId || '0');
  const isQuiz = lessonId === 'quiz';

  const handleLessonComplete = () => {
    if (!progress.completedLessons.includes(currentLessonIndex)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, currentLessonIndex]
      }));
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < hipaaBasicsLessons.length - 1) {
      navigate(`/training/hipaa-basics/${currentLessonIndex + 1}`);
    } else {
      navigate('/training/hipaa-basics/quiz');
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      navigate(`/training/hipaa-basics/${currentLessonIndex - 1}`);
    }
  };

  const handleQuizComplete = (passed: boolean, score: number) => {
    setProgress(prev => ({
      ...prev,
      quizCompleted: true,
      quizScore: score,
      quizPassed: passed
    }));
  };

  if (isQuiz) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <TrainingQuiz
            moduleId="hipaa-basics"
            moduleName={t('training.modules.hipaa_basics.title')}
            questions={hipaaBasicsQuiz}
            passingScore={80}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  const currentLesson = hipaaBasicsLessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === hipaaBasicsLessons.length - 1;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <TrainingLesson
          moduleId="hipaa-basics"
          moduleName={t('training.modules.hipaa_basics.title')}
          lessonIndex={currentLessonIndex}
          totalLessons={hipaaBasicsLessons.length}
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

export default HIPAABasicsModule;

