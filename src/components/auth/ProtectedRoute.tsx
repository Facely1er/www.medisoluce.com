import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Privacy-by-design: No authentication required
// All data stored locally using localStorage
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;