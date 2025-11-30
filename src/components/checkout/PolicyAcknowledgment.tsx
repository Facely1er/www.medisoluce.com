import React from 'react';
import { ExternalLink, FileText, Lock, CreditCard } from 'lucide-react';
import { getPrivacyPolicyUrl, getTermsOfServiceUrl, getECommercePolicyUrl } from '../../utils/policyUrls';

interface PolicyAcknowledgmentProps {
  onAcknowledge?: (acknowledged: boolean) => void;
  required?: boolean;
  className?: string;
}

/**
 * Policy Acknowledgment Component
 * Displays policy links that users must acknowledge before checkout
 * This component should be shown before redirecting to Stripe Checkout
 */
const PolicyAcknowledgment: React.FC<PolicyAcknowledgmentProps> = ({
  onAcknowledge,
  required = true,
  className = '',
}) => {
  const [acknowledged, setAcknowledged] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setAcknowledged(value);
    onAcknowledge?.(value);
  };

  const policyLinks = [
    {
      name: 'Terms of Service',
      url: getTermsOfServiceUrl(),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: 'Privacy Policy',
      url: getPrivacyPolicyUrl(),
      icon: <Lock className="h-4 w-4" />,
    },
    {
      name: 'E-Commerce Policy',
      url: getECommercePolicyUrl(),
      icon: <CreditCard className="h-4 w-4" />,
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="policy-acknowledgment"
          checked={acknowledged}
          onChange={handleChange}
          required={required}
          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="policy-acknowledgment" className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">I acknowledge and agree to the following policies:</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {policyLinks.map((policy) => (
              <a
                key={policy.name}
                href={policy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm underline"
              >
                <span>{policy.icon}</span>
                <span>{policy.name}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </label>
      </div>
      
      {required && !acknowledged && (
        <p className="text-sm text-red-600 dark:text-red-400">
          You must acknowledge the policies to continue.
        </p>
      )}
    </div>
  );
};

export default PolicyAcknowledgment;

