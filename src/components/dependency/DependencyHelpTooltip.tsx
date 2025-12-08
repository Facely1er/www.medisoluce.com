import React from 'react';
import { HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface HelpTooltipProps {
  field: string;
  variant?: 'info' | 'warning' | 'success';
}

const helpContent: Record<string, { title: string; content: string; variant?: 'info' | 'warning' | 'success' }> = {
  name: {
    title: 'System Name',
    content: 'Enter a clear, descriptive name for the system (e.g., "Epic EHR", "PACS Server", "Network Infrastructure"). Use names that your team will recognize.',
    variant: 'info'
  },
  category: {
    title: 'System Category',
    content: 'Select the category that best describes this system. Categories help organize and filter dependencies. Choose the most specific category available.',
    variant: 'info'
  },
  criticality: {
    title: 'Criticality Level',
    content: 'Assess how critical this system is to patient care and operations. Critical systems require immediate recovery (0-15 min), while Low systems can tolerate longer outages.',
    variant: 'warning'
  },
  riskLevel: {
    title: 'Risk Level',
    content: 'Evaluate the risk of this system failing or being compromised. Consider factors like age, security posture, vendor support, and historical reliability.',
    variant: 'warning'
  },
  dependencies: {
    title: 'Dependencies',
    content: 'List all systems, services, or resources this system depends on. Separate multiple dependencies with commas. Examples: "Network, Database Server, Power Supply, Epic EHR".',
    variant: 'info'
  },
  downtime: {
    title: 'Maximum Downtime Tolerance',
    content: 'The maximum time this system can be unavailable before it significantly impacts patient care or operations. Use specific timeframes (e.g., "15 minutes", "2 hours", "24 hours").',
    variant: 'warning'
  },
  backupProcedures: {
    title: 'Backup Procedures',
    content: 'Describe the backup and recovery procedures for this system. Include backup frequency, recovery time objectives (RTO), and recovery point objectives (RPO).',
    variant: 'info'
  },
  vendor: {
    title: 'Vendor Name',
    content: 'Enter the name of the vendor or manufacturer of this system. This helps track vendor relationships and support contacts.',
    variant: 'info'
  },
  vendorContact: {
    title: 'Vendor Contact',
    content: 'Enter vendor support contact information (email, phone, support portal URL). This is critical for incident response.',
    variant: 'info'
  },
  complianceStatus: {
    title: 'HIPAA Compliance Status',
    content: 'Assess the HIPAA compliance status of this system. Update this regularly as part of your compliance monitoring program.',
    variant: 'warning'
  }
};

const DependencyHelpTooltip: React.FC<HelpTooltipProps> = ({ field, variant }) => {
  const help = helpContent[field];
  if (!help) return null;

  return (
    <Tooltip
      content={`${help.title}: ${help.content}`}
      position="right"
      delay={300}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label={`Help for ${help.title}`}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
    </Tooltip>
  );
};

export default DependencyHelpTooltip;

