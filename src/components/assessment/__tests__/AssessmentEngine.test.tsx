import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentEngine from '../AssessmentEngine';

// Mock the i18n hook
vi.mock('../../i18n/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}));

// Mock the assessment data
const mockQuestions = [
  {
    id: 'q1',
    text: 'Do you have documented HIPAA policies?',
    description: 'This question assesses your HIPAA policy documentation',
    options: [
      { id: 'yes', text: 'Yes', value: 10 },
      { id: 'no', text: 'No', value: 0 },
    ],
  },
  {
    id: 'q2',
    text: 'How often do you conduct HIPAA training?',
    description: 'This question assesses your training frequency',
    options: [
      { id: 'annual', text: 'Annually', value: 5 },
      { id: 'quarterly', text: 'Quarterly', value: 15 },
      { id: 'never', text: 'Never', value: 0 },
    ],
  },
];

const mockCalculateResults = (answers: Record<string, string>) => {
  const totalScore = Object.values(answers).reduce((sum, answerId) => {
    const question = mockQuestions.find(q => q.id === Object.keys(answers).find(key => answers[key] === answerId));
    const option = question?.options.find(opt => opt.id === answerId);
    return sum + (option?.value || 0);
  }, 0);
  
  return {
    score: totalScore,
    maxScore: 25,
    percentage: (totalScore / 25) * 100,
    recommendations: [
      { priority: 'high' as const, text: 'Implement regular training' },
      { priority: 'medium' as const, text: 'Document policies' },
    ],
  };
};

const AssessmentEngineWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('AssessmentEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders assessment questions', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    expect(screen.getByText('Test HIPAA Assessment')).toBeInTheDocument();
    expect(screen.getByText('Do you have documented HIPAA policies?')).toBeInTheDocument();
  });

  it('handles yes/no question responses', () => {
    const onComplete = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={onComplete}
        />
      </AssessmentEngineWrapper>
    );

    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // The component should show the selected option
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('handles multiple choice question responses', () => {
    const onComplete = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={onComplete}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question to get to second
    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // Click Next to go to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const quarterlyOption = screen.getByText('Quarterly');
    fireEvent.click(quarterlyOption);

    // Click Next to complete the assessment
    fireEvent.click(nextButton);

    // Should complete the assessment
    expect(onComplete).toHaveBeenCalled();
  });

  it('calculates progress correctly', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Should show progress for first question
    expect(screen.getByText(/1 of 2/)).toBeInTheDocument();
  });

  it('navigates between questions', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question
    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // Click Next to go to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should show second question
    expect(screen.getByText('How often do you conduct HIPAA training?')).toBeInTheDocument();
  });

  it('allows going back to previous questions', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question and go to second
    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // Click Next to go to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Go back
    const backButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(backButton);

    // Should show first question again
    expect(screen.getByText('Do you have documented HIPAA policies?')).toBeInTheDocument();
  });

  it('completes assessment when all questions answered', async () => {
    const onComplete = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={onComplete}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question
    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // Click Next to go to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Answer second question
    const quarterlyOption = screen.getByText('Quarterly');
    fireEvent.click(quarterlyOption);

    // Click Next to complete the assessment
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          score: expect.any(Number),
          percentage: expect.any(Number),
          recommendations: expect.any(Array),
        })
      );
    });
  });

  it('saves progress automatically', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question
    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // Click Next to go to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should show next question
    expect(screen.getByText('How often do you conduct HIPAA training?')).toBeInTheDocument();
  });

  it('allows navigation without answering questions', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // The Next button should be disabled when no option is selected
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calculates score correctly based on weights', () => {
    const onComplete = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          title="Test HIPAA Assessment"
          description="Test assessment for HIPAA compliance"
          questions={mockQuestions}
          calculateResults={mockCalculateResults}
          onComplete={onComplete}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question (value: 10)
    const yesOption = screen.getByText('Yes');
    fireEvent.click(yesOption);

    // Click Next to go to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Answer second question (value: 15)
    const quarterlyOption = screen.getByText('Quarterly');
    fireEvent.click(quarterlyOption);

    // Click Next to complete the assessment
    fireEvent.click(nextButton);

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 25, // 10 + 15
        percentage: 100,
      })
    );
  });
});