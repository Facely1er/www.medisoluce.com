import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { validateSecureHealthcareInput, rateLimiter } from '../utils/validation';
import { securityUtils } from '../utils/securityUtils';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Enhanced security validation for contact form
    const validationResults = {
      name: validateSecureHealthcareInput(data.name, 'contact'),
      email: validateSecureHealthcareInput(data.email, 'contact'),
      phone: validateSecureHealthcareInput(data.phone || '', 'contact'),
      organization: validateSecureHealthcareInput(data.organization || '', 'general'),
      message: validateSecureHealthcareInput(data.message, 'general')
    };
    
    // Check for validation failures
    const hasSecurityIssues = Object.values(validationResults).some(result => 
      !result.isValid || result.securityAlerts.length > 0
    );
    
    if (hasSecurityIssues) {
      const allErrors = Object.values(validationResults).flatMap(result => result.errors);
      const securityAlerts = Object.values(validationResults).flatMap(result => result.securityAlerts);
      
      if (typeof window !== 'undefined' && (window as Window & { showToast?: (toast: { type: string; title: string; message: string }) => void }).showToast) {
        (window as Window & { showToast: (toast: { type: string; title: string; message: string }) => void }).showToast({
          type: 'error',
          title: t('contact_page.validation.message_failed'),
          message: allErrors[0] || 'Please check your message and try again.'
        });
      }
      
      securityUtils.logSecurityEvent('contact_form_security_violation', {
        fieldErrors: Object.entries(validationResults).reduce((acc, [field, result]) => {
          if (!result.isValid) acc[field] = result.errors;
          return acc;
        }, {} as Record<string, string[]>),
        securityAlerts: securityAlerts
      }, securityAlerts.length > 0 ? 'high' : 'medium');
      
      return;
    }
    
    // Rate limiting for contact form submissions
    const contactAttemptKey = `contact-${data.email}`;
    if (!rateLimiter.canAttempt(contactAttemptKey, 3, 60 * 60 * 1000)) { // 3 submissions per hour per email
      if (typeof window !== 'undefined' && (window as Window & { showToast?: (toast: { type: string; title: string; message: string }) => void }).showToast) {
        (window as Window & { showToast: (toast: { type: string; title: string; message: string }) => void }).showToast({
          type: 'error',
          title: t('contact_page.validation.submission_limit'),
          message: 'Too many contact form submissions. Please wait an hour before trying again.'
        });
      }
      
      securityUtils.logSecurityEvent('contact_form_rate_limit_exceeded', {
        email: data.email
      }, 'medium');
      return;
    }
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store sanitized form submission locally for privacy
      const submissions = JSON.parse(localStorage.getItem('contact-submissions') || '[]');
      const newSubmission = {
        name: validationResults.name.sanitized,
        email: validationResults.email.sanitized,
        phone: validationResults.phone.sanitized,
        organization: validationResults.organization.sanitized,
        message: validationResults.message.sanitized,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };
      submissions.push(newSubmission);
      localStorage.setItem('contact-submissions', JSON.stringify(submissions));
      
      // Log successful contact form submission
      securityUtils.logSecurityEvent('contact_form_submitted', {
        organizationName: newSubmission.organization.substring(0, 50),
        messageLength: newSubmission.message.length
      }, 'low');
      
      // Track form submission
      analytics.trackFormSubmit('Contact Form');
      
      if (!import.meta.env.PROD) {
        console.log($1);
      }
      window.location.href = '/thanks';
    } catch (error) {
      securityUtils.logSecurityEvent('contact_form_submission_failed', {
        email: data.email,
        error: error instanceof Error ? error.message : t('contact_page.form.unknown_error')
      }, 'low');
      console.error('Error submitting form:', error);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: t('contact.phone'),
      description: t('contact.phone_desc'),
      contact: '+1 (240) 599-0102',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: t('contact.email'),
      description: t('contact.email_desc'),
      contact: 'support@medisoluce.com',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('contact.office'),
      description: t('contact.office_desc'),
      contact: '8300 McCullough Lane Suite 203, Gaithersburg, MD 20877',
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="flex justify-center mb-4">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-500">
                      {method.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {method.description}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.contact}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <MessageSquare className="h-8 w-8 text-primary-500 mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {t('contact.send_message')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('contact.send_message_desc')}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: t('contact_page.validation.name_required') })}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-accent-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: t('contact_page.validation.email_required'),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t('contact_page.validation.invalid_email'),
                        },
                      })}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-accent-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('contact.phone_field')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('contact.organization')}
                    </label>
                    <input
                      type="text"
                      id="organization"
                      {...register('organization')}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message', { required: t('contact_page.validation.message_required') })}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700"
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-accent-500">{errors.message.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    icon={<Mail className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    {t('contact.send')}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;