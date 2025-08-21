import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Download, Eye, Calendar } from 'lucide-react';
import { validateSecureHealthcareInput } from '../../utils/validation';
import { securityUtils } from '../../utils/securityUtils';
import { analytics } from '../../utils/analytics';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Tooltip from '../ui/Tooltip';
import useLocalStorage from '../../hooks/useLocalStorage';

interface AssessmentFormData {
  organizationName: string;
  assessmentType: string;
  conductedBy: string;
  department: string;
  reviewDate: string;
  notes: string;
}

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void;
  initialData?: Partial<AssessmentFormData>;
  isLoading?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false
}) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<AssessmentFormData>({
    defaultValues: {
      organizationName: '',
      assessmentType: 'hipaa-compliance',
      conductedBy: '',
      department: '',
      reviewDate: '',
      notes: '',
      ...initialData
    }
  });

  const [savedDrafts, setSavedDrafts] = useLocalStorage('assessment-drafts', []);

  const saveDraft = () => {
    const formData = watch();
    const draft = {
      id: Date.now().toString(),
      ...formData,
      savedAt: new Date().toISOString()
    };
    
    setSavedDrafts([...savedDrafts, draft]);
    
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'success',
        title: 'Draft Saved',
        message: 'Your assessment has been saved as a draft.'
      });
    // Enhanced security validation for all form inputs
    const validationResults = {
      organizationName: validateSecureHealthcareInput(data.organizationName, 'general'),
      conductedBy: validateSecureHealthcareInput(data.conductedBy, 'contact'),
      department: validateSecureHealthcareInput(data.department || '', 'general'),
      notes: validateSecureHealthcareInput(data.notes || '', 'general')
    };
    
    // Check for any validation failures
    const hasSecurityIssues = Object.values(validationResults).some(result => 
      !result.isValid || result.securityAlerts.length > 0
    );
    
    if (hasSecurityIssues) {
      const allErrors = Object.values(validationResults).flatMap(result => result.errors);
      const securityAlerts = Object.values(validationResults).flatMap(result => result.securityAlerts);
      
      // Show user-friendly error
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'error',
          title: 'Input validation failed',
          message: allErrors[0] || 'Please check your input and try again.'
        });
      }
      
      // Log security event
      securityUtils.logSecurityEvent('assessment_form_security_violation', {
        fieldErrors: Object.entries(validationResults).reduce((acc, [field, result]) => {
          if (!result.isValid) acc[field] = result.errors;
          return acc;
        }, {} as Record<string, string[]>),
        securityAlerts: securityAlerts
      }, securityAlerts.length > 0 ? 'high' : 'medium');
      
      return;
    }
    
    // Use sanitized data for submission
    const sanitizedData: AssessmentFormData = {
      organizationName: validationResults.organizationName.sanitized,
      assessmentType: data.assessmentType, // Dropdown value, already safe
      conductedBy: validationResults.conductedBy.sanitized,
      department: validationResults.department.sanitized,
      reviewDate: data.reviewDate, // Date input, already safe
      notes: validationResults.notes.sanitized
    };
    
    // Log successful form submission
    securityUtils.logSecurityEvent('assessment_form_submitted', {
      organizationName: sanitizedData.organizationName.substring(0, 50), // Log partial for audit
      assessmentType: sanitizedData.assessmentType
    }, 'low');
    
    return;
  }
  
  // Use sanitized data for submission
  const sanitizedData: AssessmentFormData = {
    organizationName: validationResults.organizationName.sanitized,
    assessmentType: data.assessmentType, // Dropdown value, already safe
    conductedBy: validationResults.conductedBy.sanitized,
    department: validationResults.department.sanitized,
    reviewDate: data.reviewDate, // Date input, already safe
    notes: validationResults.notes.sanitized
  };
  
  // Log successful form submission
  securityUtils.logSecurityEvent('assessment_form_submitted', {
    organizationName: sanitizedData.organizationName.substring(0, 50), // Log partial for audit
    assessmentType: sanitizedData.assessmentType
  }, 'low');
  
  // Call the onSubmit prop with sanitized data
  onSubmit(sanitizedData);
  };

  const assessmentTypes = [
    { value: 'hipaa-compliance', label: 'HIPAA Compliance Assessment' },
    { value: 'security-risk', label: 'Security Risk Assessment' },
    { value: 'business-impact', label: 'Business Impact Analysis' },
    { value: 'vendor-risk', label: 'Vendor Risk Assessment' },
    { value: 'technical-audit', label: 'Technical Security Audit' }
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Assessment Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Complete the information below to begin your assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization Name *
              <Tooltip content="Enter the full legal name of your healthcare organization">
                <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
              </Tooltip>
            </label>
            <input
              type="text"
              {...register('organizationName', { 
                required: 'Organization name is required',
                minLength: { value: 2, message: 'Organization name must be at least 2 characters' }
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., City General Hospital"
            />
            {errors.organizationName && (
              <p className="mt-1 text-sm text-accent-500">{errors.organizationName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assessment Type *
            </label>
            <select
              {...register('assessmentType', { required: 'Assessment type is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {assessmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conducted By *
            </label>
            <input
              type="text"
              {...register('conductedBy', { required: 'Conductor name is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., John Smith, Compliance Officer"
            />
            {errors.conductedBy && (
              <p className="mt-1 text-sm text-accent-500">{errors.conductedBy.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department/Unit
            </label>
            <input
              type="text"
              {...register('department')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., IT Department, Administration"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Next Review Date
              <Tooltip content="When should this assessment be reviewed or updated?">
                <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
              </Tooltip>
            </label>
            <input
              type="date"
              {...register('reviewDate')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Any additional context or specific areas of focus for this assessment..."
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={saveDraft}
              icon={<Save className="h-4 w-4" />}
            >
              Save Draft
            </Button>
            {savedDrafts.length > 0 && (
              <Tooltip content={`${savedDrafts.length} draft(s) saved locally`}>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {savedDrafts.length} draft(s)
                </span>
              </Tooltip>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            icon={<Calendar className="h-4 w-4" />}
          >
            {isLoading ? 'Starting...' : 'Begin Assessment'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AssessmentForm;