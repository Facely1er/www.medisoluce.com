import React from 'react';
import { User, Mail, Phone, Building, Clock, MapPin } from 'lucide-react';
import Card from '../ui/Card';

interface ProfileCardProps {
  profile: {
    name?: string;
    email: string;
    role?: string;
    organization?: string;
    phone_number?: string;
    timezone?: string;
    department?: string;
    created_at: string;
    certifications?: string[];
  };
  compact?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, compact = false }) => {
  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {profile.name || 'User'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {profile.role || 'Healthcare Professional'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
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
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {profile.organization || 'No organization set'}
      </p>
      
      <div className="space-y-3 text-sm text-left">
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

        {profile.certifications && profile.certifications.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Certifications
            </h4>
            <div className="flex flex-wrap gap-1">
              {profile.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;