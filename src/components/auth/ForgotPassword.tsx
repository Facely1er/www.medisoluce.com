import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound } from 'lucide-react';
import { useToast } from '../ui/Toast';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { authProvider, isSupabaseAuthEnabled } from '../../config/runtimeConfig';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
      });

      if (error) {
        throw error;
      }

      showToast({
        type: 'success',
        title: 'Reset link sent',
        message: 'Check your email for password reset instructions.'
      });

      navigate('/login');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Reset failed',
        message: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  if (!isSupabaseAuthEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {t('auth.local_demo_forgot_disabled', 'Password reset is unavailable in local demo mode')}
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {t(
              'auth.local_demo_forgot_disabled_message',
              `This demo runs with VITE_AUTH_PROVIDER=${authProvider}. Enable Supabase mode to use account recovery.`
            )}
          </p>
          <div className="mt-6">
            <Link to="/dashboard">
              <Button fullWidth>{t('auth.continue_to_dashboard', 'Continue to Dashboard')}</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <KeyRound className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-accent-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            Send Reset Link
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
