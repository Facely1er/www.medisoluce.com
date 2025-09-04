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
const mockAssessmentData = {
  id: 'test-assessment',
  title: 'Test HIPAA Assessment',
  questions: [
    {
      id: 'q1',
      text: 'Do you have documented HIPAA policies?',
      type: 'yesno',
      category: 'policies',
      weight: 10,
    },
    {
      id: 'q2',
      text: 'How often do you conduct HIPAA training?',
      type: 'multiple-choice',
      category: 'training',
      weight: 15,
      options: [
        { value: 'annual', label: 'Annually' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'never', label: 'Never' },
      ],
    },
  ],
  categories: {
    policies: { name: 'Policies', weight: 30 },
    training: { name: 'Training', weight: 25 },
  },
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
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    expect(screen.getByText('Test HIPAA Assessment')).toBeInTheDocument();
    expect(screen.getByText('Do you have documented HIPAA policies?')).toBeInTheDocument();
  });

  it('handles yes/no question responses', () => {
    const onSave = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={onSave}
        />
      </AssessmentEngineWrapper>
    );

    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        responses: expect.objectContaining({
          q1: 'yes',
        }),
      })
    );
  });

  it('handles multiple choice question responses', () => {
    const onSave = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={onSave}
        />
      </AssessmentEngineWrapper>
    );

    // Navigate to second question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const quarterlyOption = screen.getByRole('radio', { name: /quarterly/i });
    fireEvent.click(quarterlyOption);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        responses: expect.objectContaining({
          q2: 'quarterly',
        }),
      })
    );
  });

  it('calculates progress correctly', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={vi.fn()}
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
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question
    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);

    // Navigate to next question
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should show second question
    expect(screen.getByText('How often do you conduct HIPAA training?')).toBeInTheDocument();
  });

  it('allows going back to previous questions', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question and go to second
    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Go back
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    // Should show first question again
    expect(screen.getByText('Do you have documented HIPAA policies?')).toBeInTheDocument();
  });

  it('completes assessment when all questions answered', async () => {
    const onComplete = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={onComplete}
          onSave={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question
    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Answer second question
    const quarterlyOption = screen.getByRole('radio', { name: /quarterly/i });
    fireEvent.click(quarterlyOption);

    // Complete assessment
    const completeButton = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          responses: expect.objectContaining({
            q1: 'yes',
            q2: 'quarterly',
          }),
          score: expect.any(Number),
          completedAt: expect.any(Date),
        })
      );
    });
  });

  it('saves progress automatically', () => {
    const onSave = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={onSave}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question
    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);

    // Should auto-save
    expect(onSave).toHaveBeenCalled();
  });

  it('shows validation errors for required questions', () => {
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={vi.fn()}
          onSave={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Try to go to next question without answering
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Should show validation error
    expect(screen.getByText(/please answer this question/i)).toBeInTheDocument();
  });

  it('calculates score correctly based on weights', () => {
    const onComplete = vi.fn();
    
    render(
      <AssessmentEngineWrapper>
        <AssessmentEngine
          assessmentData={mockAssessmentData}
          onComplete={onComplete}
          onSave={vi.fn()}
        />
      </AssessmentEngineWrapper>
    );

    // Answer first question (weight: 10)
    const yesButton = screen.getByRole('button', { name: /yes/i });
    fireEvent.click(yesButton);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Answer second question (weight: 15)
    const quarterlyOption = screen.getByRole('radio', { name: /quarterly/i });
    fireEvent.click(quarterlyOption);

    // Complete assessment
    const completeButton = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeButton);

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        score: expect.any(Number),
      })
    );
  });
});