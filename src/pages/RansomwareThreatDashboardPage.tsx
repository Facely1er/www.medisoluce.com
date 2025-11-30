import React from 'react';
import RansomwareThreatDashboard from '../components/ransomware/RansomwareThreatDashboard';

const RansomwareThreatDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RansomwareThreatDashboard 
        autoRefresh={true}
        refreshInterval={300000} // 5 minutes
      />
    </div>
  );
};

export default RansomwareThreatDashboardPage;

