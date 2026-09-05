import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authProvider, getLocalWorkspaceId, isSupabaseAuthEnabled } from '../config/runtimeConfig';

interface User {
  id: string;
  email: string;
  loginTime?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authProvider: 'local' | 'supabase';
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(session: Session | null): User | null {
  if (!session?.user?.id || !session.user.email) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    loginTime: session.user.last_sign_in_at ?? undefined,
  };
}

/**
 * AuthProvider never statically imports `@supabase/supabase-js`. In local/demo
 * mode that keeps the ~200 kB supabase client out of the initial bundle; in
 * supabase mode it is fetched once on mount.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseAuthEnabled) {
      getLocalWorkspaceId();
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const initialize = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        if (cancelled) return;

        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;

        if (error) {
          console.error('Failed to fetch Supabase session:', error.message);
          setUser(null);
        } else {
          setUser(toUser(data.session));
        }

        const { data: authStateChange } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!cancelled) {
            setUser(toUser(session));
            setLoading(false);
          }
        });
        unsubscribe = () => authStateChange.subscription.unsubscribe();
      } catch (error) {
        if (!cancelled) {
          console.error('Unexpected session initialization error:', error);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    if (!isSupabaseAuthEnabled) {
      setUser(null);
      return;
    }

    const { supabase } = await import('../lib/supabase');
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authProvider,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
