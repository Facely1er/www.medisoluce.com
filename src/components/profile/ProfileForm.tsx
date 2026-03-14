import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Building, Shield, Bell } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ProfileFormData {
  name: string;
  organization: string;
  role: string;
  industry: string;
  department: string;
  manager: string;
  phone_number: string;
  timezone: string;
  certifications: string;
  preferences: {
    theme: 'light' | 'dark';
    autoSave: boolean;
    language: string;
    reportFormat: 'detailed' | 'summary';
    emailNotifications: boolean;
    assessmentReminders: boolean;
    showGuidanceByDefault: boolean;
  };
}

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => void;
  isLoading?: boolean;
  readOnly?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  readOnly = false
}) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      organization: '',
      role: '',
      industry: '',
      department: '',
      manager: '',
      phone_number: '',
      timezone: 'UTC',
      certifications: '',
      preferences: {
        theme: 'light',
        autoSave: true,
        language: 'en',
        reportFormat: 'detailed',
        emailNotifications: false,
        assessmentReminders: true,
        showGuidanceByDefault: true
      },
      ...initialData
    }
  });

  const watchedPreferences = watch('preferences');

  const industries = [
    'Hospital/Health System',
    'Medical Practice',
    'Long-term Care',
    'Mental Health',
    'Dental Practice',
    'Pharmacy',
    'Medical Device',
    'Healthcare Technology',
    'Consulting',
    'Other'
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris'
  ];

  const togglePreference = (key: keyof ProfileFormData['preferences']) => {
    if (readOnly) return;
    
    setValue(`preferences.${key}`, !watchedPreferences[key]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-primary-500" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-accent-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone_number')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              {...register('timezone')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Professional Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-primary-500" />
          Professional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization *
            </label>
            <input
              type="text"
              {...register('organization', { required: 'Organization is required' })}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="Your organization name"
            />
            {errors.organization && (
              <p className="mt-1 text-sm text-accent-500">{errors.organization.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role/Title
            </label>
            <input
              type="text"
              {...register('role')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="Your job title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry
            </label>
            <select
              {...register('industry')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <input
              type="text"
              {...register('department')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="IT, Clinical, Administrative"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Professional Certifications
            </label>
            <input
              type="text"
              {...register('certifications')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              placeholder="CISSP, CISA, CHPS, RN, MD, etc. (comma-separated)"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              List your professional certifications separated by commas
            </p>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary-500" />
          Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Format
            </label>
            <select
              {...register('preferences.reportFormat')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="detailed">Detailed Reports</option>
              <option value="summary">Summary Reports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              {...register('preferences.language')}
              disabled={readOnly}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Bell className="h-4 w-4 mr-2 text-primary-500" />
            Notification Preferences
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Assessment Reminders
              </span>
              <button
                type="button"
                onClick={() => togglePreference('assessmentReminders')}
                disabled={readOnly}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  watchedPreferences.assessmentReminders ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                } ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    watchedPreferences.assessmentReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Auto-save Progress
              </span>
              <button
                type="button"
                onClick={() => togglePreference('autoSave')}
                disabled={readOnly}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  watchedPreferences.autoSave ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                } ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    watchedPreferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show Guidance by Default
              </span>
              <button
                type="button"
                onClick={() => togglePreference('showGuidanceByDefault')}
                disabled={readOnly}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  watchedPreferences.showGuidanceByDefault ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                } ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    watchedPreferences.showGuidanceByDefault ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {!readOnly && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            icon={<Shield className="h-4 w-4" />}
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;