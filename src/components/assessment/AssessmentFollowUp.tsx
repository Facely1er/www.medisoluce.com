/**
 * Post-assessment follow-up: local save notice, optional self-email of the
 * report, account CTA only in Supabase mode, and a Step 2 handoff.
 */

import React, { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseAuthEnabled } from '../../config/runtimeConfig';
import Button from '../ui/Button';
import type { AssessmentResult } from './AssessmentEngine';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildReportMailto(result: AssessmentResult, email: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const subject = t('assessment_followup.email_subject', { score: result.percentage });
  const recs = result.recommendations
    .map((rec) => `- [${rec.priority}] ${rec.text}`)
    .join('\n');
  const body = t('assessment_followup.email_body', {
    score: result.percentage,
    points: `${result.score}/${result.maxScore}`,
    recommendations: recs || t('assessment_followup.no_recommendations'),
  });
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(String(body))}`;
}

interface AssessmentFollowUpProps {
  result: AssessmentResult;
  nextStepPath?: string;
}

const AssessmentFollowUp: React.FC<AssessmentFollowUpProps> = ({
  result,
  nextStepPath = '/dependency-manager',
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [openedMail, setOpenedMail] = useState(false);

  const handoffCopy = useMemo(() => {
    if (result.percentage < 50) return t('assessment_followup.handoff_low');
    if (result.percentage < 75) return t('assessment_followup.handoff_mid');
    return t('assessment_followup.handoff_high');
  }, [result.percentage, t]);

  const handleEmailReport = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError(t('assessment_followup.email_invalid'));
      return;
    }
    setEmailError('');
    window.location.href = buildReportMailto(result, trimmed, t);
    setOpenedMail(true);
  };

  const showAccountCta = isSupabaseAuthEnabled && !user;

  return (
    <div className="space-y-4 mb-6">
      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-1">
              {t('assessment_followup.saved_title')}
            </p>
            <p className="text-sm text-primary-700 dark:text-primary-300 mb-3">
              {showAccountCta
                ? t('assessment_followup.saved_account_message')
                : t('assessment_followup.saved_local_message')}
            </p>
            {showAccountCta && (
              <div className="flex flex-wrap gap-2">
                <Link to="/register">
                  <Button size="sm">{t('assessment_followup.create_account')}</Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" variant="outline">{t('assessment_followup.sign_in')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleEmailReport} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {t('assessment_followup.email_title')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {t('assessment_followup.email_help')}
            </p>
            {openedMail ? (
              <p className="text-sm text-success-700 dark:text-success-300" role="status">
                {t('assessment_followup.email_opened')}
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="sr-only" htmlFor="assessment-report-email">
                  {t('email')}
                </label>
                <input
                  id="assessment-report-email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('assessment_followup.email_placeholder')}
                  className="flex h-10 flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                />
                <Button type="submit" size="sm">{t('assessment_followup.email_submit')}</Button>
              </div>
            )}
            {emailError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{emailError}</p>
            )}
          </div>
        </div>
      </form>

      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {t('assessment_followup.next_step_title')}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{handoffCopy}</p>
        <Link to={nextStepPath}>
          <Button size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
            {t('assessment_followup.next_step_cta')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AssessmentFollowUp;
