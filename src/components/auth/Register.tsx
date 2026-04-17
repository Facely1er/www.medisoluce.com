import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, AlertTriangle } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { validateSecureHealthcareInput, rateLimiter } from '../../utils/validation';
import { securityUtils } from '../../utils/securityUtils';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { authProvider, isSupabaseAuthEnabled } from '../../config/runtimeConfig';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const [passwordStrength, setPasswordStrength] = React.useState<{ score: number; feedback: string[] }>({ score: 0, feedback: [] });

  const watchPassword = watch('password');

  React.useEffect(() => {
    if (watchPassword) {
      const strength = securityUtils.checkPasswordStrength(watchPassword);
      setPasswordStrength(strength);
    }
  }, [watchPassword]);

  const onSubmit = async (data: RegisterFormData) => {
    const emailValidation = validateSecureHealthcareInput(data.email, 'contact');
    const passwordValidation = validateSecureHealthcareInput(data.password, 'general');

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      const allErrors = [...emailValidation.errors, ...passwordValidation.errors];
      showToast({
        type: 'error',
        title: 'Invalid input detected',
        message: allErrors[0] || 'Please check your input and try again.'
      });

      securityUtils.logSecurityEvent('invalid_registration_input', {
        emailErrors: emailValidation.errors,
        passwordErrors: passwordValidation.errors
      }, 'medium');
      return;
    }

    const registerAttemptKey = `register-${data.email}`;
    if (!rateLimiter.canAttempt(registerAttemptKey, 2, 60 * 60 * 1000)) {
      showToast({
        type: 'error',
        title: 'Registration limit exceeded',
        message: 'Too many registration attempts. Please wait an hour before trying again.'
      });

      securityUtils.logSecurityEvent('registration_rate_limit_exceeded', {
        email: data.email
      }, 'medium');
      return;
    }

    const submittedPasswordValidation = securityUtils.checkPasswordStrength(data.password);
    if (submittedPasswordValidation.score < 4) {
      showToast({
        type: 'error',
        title: 'Password too weak',
        message: 'Please choose a stronger password to protect your healthcare data. Use a mix of upper/lowercase letters, numbers, and special characters.'
      });

      securityUtils.logSecurityEvent('weak_password_attempt', {
        email: data.email,
        passwordScore: submittedPasswordValidation.score
      }, 'low');
      return;
    }

    const registrationId = Date.now().toString();
    securityUtils.logSecurityEvent('registration_attempt', {
      email: data.email,
      attemptId: registrationId
    }, 'low');

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
        }
      });

      if (error) {
        throw error;
      }

      securityUtils.logSecurityEvent('successful_registration', {
        email: data.email,
        attemptId: registrationId
      }, 'low');

      showToast({
        type: 'success',
        title: 'Account created!',
        message: 'Check your inbox to confirm your account, then sign in.'
      });

      navigate('/login');
    } catch (error) {
      securityUtils.logSecurityEvent('registration_failed', {
        email: data.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        attemptId: registrationId
      }, 'medium');

      showToast({
        type: 'error',
        title: 'Registration failed',
        message: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  if (!isSupabaseAuthEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {t('auth.local_demo_register_disabled', 'Registration disabled in local demo mode')}
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {t(
              'auth.local_demo_register_disabled_message',
              `This demo runs with VITE_AUTH_PROVIDER=${authProvider}. Deploy with VITE_AUTH_PROVIDER=supabase to enable account creation.`
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
          <UserPlus className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-accent-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return 'Passwords do not match';
                  }
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-accent-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {watchPassword && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Strength:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className={`w-6 h-2 rounded ${
                        level <= passwordStrength.score
                          ? passwordStrength.score <= 2 ? 'bg-accent-500' :
                            passwordStrength.score <= 3 ? 'bg-warning-500' : 'bg-success-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  {passwordStrength.feedback.map((feedback: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <AlertTriangle className="h-3 w-3 text-warning-500 mr-1" />
                      {feedback}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
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

export default Register;
