import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import AssessmentFollowUp, { buildReportMailto } from '../AssessmentFollowUp';
import type { AssessmentResult } from '../AssessmentEngine';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (!opts) return key;
      return `${key}:${JSON.stringify(opts)}`;
    },
    i18n: {},
  }),
}));

const result: AssessmentResult = {
  score: 12,
  maxScore: 20,
  percentage: 40,
  recommendations: [{ priority: 'high', text: 'Encrypt backups' }],
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </AuthProvider>
);

describe('buildReportMailto', () => {
  it('builds a mailto link without sending the address to a server', () => {
    const href = buildReportMailto(result, 'ciso@clinic.example', (key, opts) => {
      if (!opts) return key;
      return [key, opts.score, opts.points, opts.recommendations].filter(Boolean).join('|');
    });
    expect(href.startsWith('mailto:ciso%40clinic.example?')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Encrypt backups');
  });
});

describe('AssessmentFollowUp', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not offer account creation in local demo mode', () => {
    render(
      <Wrapper>
        <AssessmentFollowUp result={result} />
      </Wrapper>
    );
    expect(screen.getByText('assessment_followup.saved_local_message')).toBeInTheDocument();
    expect(screen.queryByText('assessment_followup.create_account')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'assessment_followup.sign_in' })).not.toBeInTheDocument();
  });

  it('links to system dependency mapping as the next step', () => {
    render(
      <Wrapper>
        <AssessmentFollowUp result={result} />
      </Wrapper>
    );
    const next = screen.getByRole('link', { name: 'assessment_followup.next_step_cta' });
    expect(next).toHaveAttribute('href', '/dependency-manager');
    expect(screen.getByText('assessment_followup.handoff_low')).toBeInTheDocument();
  });

  it('rejects an invalid email without navigating', () => {
    render(
      <Wrapper>
        <AssessmentFollowUp result={result} />
      </Wrapper>
    );
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'assessment_followup.email_submit' }));
    expect(screen.getByRole('alert')).toHaveTextContent('assessment_followup.email_invalid');
  });

  it('opens a mailto URL for a valid address', () => {
    const location = { href: 'https://www.medisoluce.com/hipaa-check' };
    vi.stubGlobal('location', location);

    render(
      <Wrapper>
        <AssessmentFollowUp result={result} />
      </Wrapper>
    );
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'ciso@clinic.example' } });
    fireEvent.click(screen.getByRole('button', { name: 'assessment_followup.email_submit' }));
    expect(location.href.startsWith('mailto:ciso%40clinic.example?')).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent('assessment_followup.email_opened');
  });
});
