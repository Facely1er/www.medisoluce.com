import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Shield } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { validateEmail, rateLimiter, validateSecureHealthcareInput } from '../../utils/validation';
import { securityUtils } from '../../utils/securityUtils';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface LoginFormData {
  email: string;
  password: string;
  mfaCode?: string;
}

const Login: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const [requiresMFA, setRequiresMFA] = React.useState(false);

  const onSubmit = async (data: LoginFormData) => {
    // Enhanced input validation with security scanning
    const emailValidation = validateSecureHealthcareInput(data.email, 'contact');
    const passwordValidation = validateSecureHealthcareInput(data.password, 'general');
    
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      const allErrors = [...emailValidation.errors, ...passwordValidation.errors];
      showToast({
        type: 'error',
        title: 'Invalid input detected',
        message: allErrors[0] || 'Please check your input and try again.'
      });
      
      // Log security event for invalid input
      securityUtils.logSecurityEvent('invalid_login_input', {
        emailErrors: emailValidation.errors,
        passwordErrors: passwordValidation.errors
      }, 'medium');
      return;
    }
    
    // Check for account lockout
    const lockoutKey = `account-lockout-${data.email}`;
    const lockoutData = JSON.parse(localStorage.getItem(lockoutKey) || '{}');
    
    if (lockoutData.expiresAt && lockoutData.expiresAt > Date.now()) {
      const remainingTime = Math.ceil((lockoutData.expiresAt - Date.now()) / 1000 / 60);
      showToast({
        type: 'error',
        title: 'Account temporarily locked',
        message: `Please try again in ${remainingTime} minutes.`
      });
      return;
    }
    
    // Rate limiting check
    const loginAttemptKey = `login-${data.email}`;
    if (!rateLimiter.canAttempt(loginAttemptKey, 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes per email
      showToast({
        type: 'error',
        title: 'Too many attempts',
        message: 'Too many login attempts. Please wait 15 minutes before trying again.'
      });
      
      securityUtils.logSecurityEvent('rate_limit_exceeded', {
        email: data.email,
        attemptType: 'login'
      }, 'medium');
      return;
    }

    // Client-side validation
    if (!validateEmail(data.email)) {
      showToast({
        type: 'error',
        title: 'Invalid email',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    // Enhanced security logging
    const loginAttemptId = Date.now().toString();
    securityUtils.logSecurityEvent('authentication_attempt', {
      email: data.email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipAddress: 'client-side',
      attemptId: loginAttemptId
    }, 'low');

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user has MFA enabled (simulation)
      const userMFAEnabled = localStorage.getItem(`mfa-enabled-${data.email}`) === 'true';
      
      if (userMFAEnabled && !data.mfaCode) {
        setRequiresMFA(true);
        setTempSession(loginAttemptId);
        securityUtils.logSecurityEvent('mfa_challenge_sent', {
          email: data.email,
          attemptId: loginAttemptId
        }, 'low');
        return;
      }
      
      // Validate MFA code if provided
      if (userMFAEnabled && data.mfaCode) {
        const isValidMFA = securityUtils.validateMFACode(data.mfaCode, data.email);
        if (!isValidMFA) {
          securityUtils.logSecurityEvent('mfa_validation_failed', {
            email: data.email,
            attemptId: loginAttemptId
          }, 'medium');
          showToast({
            type: 'error',
            title: 'Invalid MFA Code',
            message: 'Please check your authenticator app and try again.'
          });
          return;
        }
      }
      
      // Store user session locally
      const userData = securityUtils.encryptSensitiveData(JSON.stringify({
        email: data.email,
        loginTime: new Date().toISOString(),
        sessionId: loginAttemptId,
        mfaVerified: userMFAEnabled,
        securityLevel: userMFAEnabled ? 'high' : 'standard',
        lastActivity: Date.now(),
        loginAttempts: 0 // Reset on successful login
      }));
      localStorage.setItem('user-session', userData);
      
      // Clear any existing lockout for successful login
      localStorage.removeItem(`account-lockout-${data.email}`);
      
      securityUtils.logSecurityEvent('successful_login', {
        email: data.email,
        mfaUsed: userMFAEnabled,
        attemptId: loginAttemptId
      }, 'low');
      
      showToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in.'
      });
      navigate('/dashboard');
    } catch (error) {
      // Track failed login attempts for this email
      const failedAttempts = JSON.parse(localStorage.getItem(`failed-logins-${data.email}`) || '[]');
      failedAttempts.push(Date.now());
      
      // Keep only last hour of attempts
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const recentAttempts = failedAttempts.filter((time: number) => time > oneHourAgo);
      localStorage.setItem(`failed-logins-${data.email}`, JSON.stringify(recentAttempts));
      
      // Implement progressive lockout
      if (recentAttempts.length >= 5) {
        securityUtils.logSecurityEvent('repeated_failed_login', {
          email: data.email,
          attemptCount: recentAttempts.length
        }, 'high');
      }
      
      console.error('Error signing in:', error);
      securityUtils.logSecurityEvent('login_failed', {
        email: data.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        attemptId: loginAttemptId,
        failedAttemptCount: recentAttempts.length
      }, 'medium');
      showToast({
        type: 'error',
        title: 'Sign in failed',
        message: error instanceof Error ? error.message : 'Invalid credentials. Please try again.'
      });
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <LogIn className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        {requiresMFA && (
          <div>
            <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary-500" />
                <span>Authentication Code</span>
              </div>
            </label>
            <input
              id="mfaCode"
              type="text"
              {...register('mfaCode', {
                required: requiresMFA ? 'Authentication code is required' : false,
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Authentication code must be 6 digits',
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
              placeholder="123456"
              maxLength={6}
            />
            {errors.mfaCode && (
              <p className="mt-2 text-sm text-accent-500">{errors.mfaCode.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        )}

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

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            Sign in
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;