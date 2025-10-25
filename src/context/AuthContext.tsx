import React, { createContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  loginTime?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { AuthContextType };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedSession = localStorage.getItem('user-session');
    if (storedSession) {
      const userData = JSON.parse(storedSession);
      setUser({
        id: userData.sessionId,
        email: userData.email,
        loginTime: userData.loginTime || userData.registrationTime
      });
    }
    setLoading(false);
  }, []);
  
  // Listen for storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-session') {
        if (e.newValue) {
          const userData = JSON.parse(e.newValue);
          setUser({
            id: userData.sessionId,
            email: userData.email,
            loginTime: userData.loginTime || userData.registrationTime
          });
        } else {
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);





  const signOut = () => {
    localStorage.removeItem('user-session');
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook moved to src/hooks/useAuth.ts to fix fast refresh warning