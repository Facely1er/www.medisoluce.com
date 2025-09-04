import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, Shield, Building, Clock, Phone, Mail, Bell } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { validateSecureHealthcareInput } from '../utils/validation';
import { securityUtils } from '../utils/securityUtils';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: string;
  industry: string;
  certifications: string[];
  preferences: {
    theme: 'light' | 'dark';
    autoSave: boolean;
    language: string;
    reportFormat: 'detailed' | 'summary';
    defaultFramework: string | null;
    emailNotifications: boolean;
    assessmentReminders: boolean;
    defaultReportSections: string[];
    showGuidanceByDefault: boolean;
  };
  avatar?: string;
  timezone: string;
  phone_number?: string;
  department?: string;
  manager?: string;
  created_at: string;
  updated_at: string;
  current_organization_id?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('user-profile', null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
      theme: 'light' as const,
      autoSave: true,
      language: 'en',
      reportFormat: 'detailed' as const,
      defaultFramework: null as string | null,
      emailNotifications: false,
      assessmentReminders: true,
      defaultReportSections: [] as string[],
      showGuidanceByDefault: true
    }
  });

  useEffect(() => {
    if (!profile && user) {
      // Initialize profile with user data
      const initialProfile: UserProfile = {
        id: user.id,
        email: user.email,
        name: '',
        organization: '',
        role: '',
        industry: '',
        certifications: [],
        preferences: {
          theme: 'light',
          autoSave: true,
          language: 'en',
          reportFormat: 'detailed',
          defaultFramework: null,
          emailNotifications: false,
          assessmentReminders: true,
          defaultReportSections: [],
          showGuidanceByDefault: true
        },
        timezone: 'UTC',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(initialProfile);
    }

    if (profile) {
      setFormData({
        name: profile.name || '',
        organization: profile.organization || '',
        role: profile.role || '',
        industry: profile.industry || '',
        department: profile.department || '',
        manager: profile.manager || '',
        phone_number: profile.phone_number || '',
        timezone: profile.timezone || 'UTC',
        certifications: profile.certifications?.join(', ') || '',
        preferences: { ...profile.preferences }
      });
    }
  }, [user, profile, setProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all inputs
      const validationResults = {
        name: validateSecureHealthcareInput(formData.name, 'contact'),
        organization: validateSecureHealthcareInput(formData.organization, 'general'),
        role: validateSecureHealthcareInput(formData.role, 'general'),
        industry: validateSecureHealthcareInput(formData.industry, 'general'),
        department: validateSecureHealthcareInput(formData.department || '', 'general'),
        manager: validateSecureHealthcareInput(formData.manager || '', 'contact'),
        phone_number: validateSecureHealthcareInput(formData.phone_number || '', 'contact')
      };

      const hasSecurityIssues = Object.values(validationResults).some(result => 
        !result.isValid || result.securityAlerts.length > 0
      );

      if (hasSecurityIssues) {
        const allErrors = Object.values(validationResults).flatMap(result => result.errors);
        
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast({
            type: 'error',
            title: 'Profile validation failed',
            message: allErrors[0] || 'Please check your input and try again.'
          });
        }
        return;
      }

      const updatedProfile: UserProfile = {
        ...profile!,
        name: validationResults.name.sanitized,
        organization: validationResults.organization.sanitized,
        role: validationResults.role.sanitized,
        industry: validationResults.industry.sanitized,
        department: validationResults.department.sanitized,
        manager: validationResults.manager.sanitized,
        phone_number: validationResults.phone_number.sanitized,
        timezone: formData.timezone,
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
        preferences: { ...formData.preferences },
        updated_at: new Date().toISOString()
      };

      setProfile(updatedProfile);
      setIsEditing(false);

      securityUtils.logSecurityEvent('profile_updated', {
        userId: profile?.id,
        fieldsUpdated: Object.keys(formData).filter(key => 
          formData[key as keyof typeof formData] !== (profile as any)?.[key]
        )
      }, 'low');

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated.'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Unable to update profile. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!user || !profile) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Not Available
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to view and manage your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Profile Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your account information and preferences
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    icon={<Edit className="h-4 w-4" />}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        if (profile) {
                          setFormData({
                            name: profile.name || '',
                            organization: profile.organization || '',
                            role: profile.role || '',
                            industry: profile.industry || '',
                            department: profile.department || '',
                            manager: profile.manager || '',
                            phone_number: profile.phone_number || '',
                            timezone: profile.timezone || 'UTC',
                            certifications: profile.certifications?.join(', ') || '',
                            preferences: { ...profile.preferences }
                          });
                        }
                      }}
                      icon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      icon={<Save className="h-4 w-4" />}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-500" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-1">
                  {profile.name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {profile.role || 'Healthcare Professional'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.organization || 'No organization set'}
                </p>
                
                <div className="mt-6 space-y-3 text-sm text-left">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{profile.email}</span>
                  </div>
                  {profile.phone_number && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{profile.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{profile.timezone}</span>
                  </div>
                  {profile.department && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{profile.department}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Personal Information */}
                  <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary-500" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Email cannot be changed for security reasons
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={formData.timezone}
                          onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                          disabled={!isEditing}
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
                          Organization
                        </label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="Your organization name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Role/Title
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="Your job title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Industry
                        </label>
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData({...formData, industry: e.target.value})}
                          disabled={!isEditing}
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
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="IT, Administration, Clinical, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Manager/Supervisor
                        </label>
                        <input
                          type="text"
                          value={formData.manager}
                          onChange={(e) => setFormData({...formData, manager: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="Your supervisor's name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          value={formData.certifications}
                          onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="CISSP, CISA, CHPS, etc. (comma-separated)"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Preferences */}
                  <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary-500" />
                      Preferences
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Report Format
                          </label>
                          <select
                            value={formData.preferences.reportFormat}
                            onChange={(e) => setFormData({
                              ...formData, 
                              preferences: {
                                ...formData.preferences, 
                                reportFormat: e.target.value as 'detailed' | 'summary'
                              }
                            })}
                            disabled={!isEditing}
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
                            value={formData.preferences.language}
                            onChange={(e) => setFormData({
                              ...formData, 
                              preferences: {
                                ...formData.preferences, 
                                language: e.target.value
                              }
                            })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          >
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                          </select>
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Notification Preferences
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                Assessment Reminders
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => isEditing && setFormData({
                                ...formData,
                                preferences: {
                                  ...formData.preferences,
                                  assessmentReminders: !formData.preferences.assessmentReminders
                                }
                              })}
                              disabled={!isEditing}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                formData.preferences.assessmentReminders ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                              } ${!isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  formData.preferences.assessmentReminders ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                Auto-save Progress
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => isEditing && setFormData({
                                ...formData,
                                preferences: {
                                  ...formData.preferences,
                                  autoSave: !formData.preferences.autoSave
                                }
                              })}
                              disabled={!isEditing}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                formData.preferences.autoSave ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                              } ${!isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  formData.preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Bell className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                Show Guidance by Default
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => isEditing && setFormData({
                                ...formData,
                                preferences: {
                                  ...formData.preferences,
                                  showGuidanceByDefault: !formData.preferences.showGuidanceByDefault
                                }
                              })}
                              disabled={!isEditing}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                formData.preferences.showGuidanceByDefault ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                              } ${!isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  formData.preferences.showGuidanceByDefault ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Organization Information */}
                  {(profile.organization || isEditing) && (
                    <Card className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-primary-500" />
                        Organization Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Organization Name
                          </label>
                          <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                            placeholder="Hospital, Clinic, Practice, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Industry Type
                          </label>
                          <select
                            value={formData.industry}
                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                            disabled={!isEditing}
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
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                            placeholder="IT, Clinical, Administrative"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Manager/Supervisor
                          </label>
                          <input
                            type="text"
                            value={formData.manager}
                            onChange={(e) => setFormData({...formData, manager: e.target.value})}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                            placeholder="Your direct supervisor"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Professional Certifications
                        </label>
                        <input
                          type="text"
                          value={formData.certifications}
                          onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="CISSP, CISA, CHPS, RN, MD, etc. (comma-separated)"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          List your professional certifications separated by commas
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;