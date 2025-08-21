import { createClient } from '@supabase/supabase-js';
import { securityUtils } from '../utils/securityUtils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up your project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced security wrapper for Supabase operations
const secureSupabaseWrapper = {
  // Encrypt sensitive data before storing
  async insertSecureData(table: string, data: any, sensitiveFields: string[] = []) {
    const secureData = { ...data };
    
    // Encrypt sensitive fields
    sensitiveFields.forEach(field => {
      if (secureData[field]) {
        secureData[field] = securityUtils.encryptSensitiveData(secureData[field]);
      }
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_insert', {
      table,
      sensitiveFields,
      recordId: secureData.id
    }, 'low');
    
    return supabase.from(table).insert(secureData);
  },

  // Decrypt sensitive data after retrieval
  async selectSecureData(table: string, query: any, sensitiveFields: string[] = []) {
    const { data, error } = await supabase.from(table).select(query.select).eq(query.column, query.value);
    
    if (error) return { data: null, error };
    
    // Decrypt sensitive fields
    const decryptedData = data?.map(record => {
      const decrypted = { ...record };
      sensitiveFields.forEach(field => {
        if (decrypted[field]) {
          try {
            decrypted[field] = securityUtils.decryptSensitiveData(decrypted[field]);
          } catch (decryptError) {
            !import.meta.env.PROD && console.warn(`Failed to decrypt field ${field}:`, decryptError);
          }
        }
      });
      return decrypted;
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_select', {
      table,
      recordCount: data?.length || 0,
      sensitiveFields
    }, 'low');
    
    return { data: decryptedData, error };
  }
};

// Helper functions for common Supabase operations
export const auth = {
  signUp: async (email: string, password: string) => {
    securityUtils.logSecurityEvent('signup_attempt', {
      email,
      timestamp: new Date().toISOString()
    }, 'low');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      securityUtils.logSecurityEvent('signup_failed', {
        email,
        error: error.message
      }, 'medium');
      throw error;
    }
    
    securityUtils.logSecurityEvent('successful_signup', {
      email,
      userId: data.user?.id
    }, 'low');
    
    return data;
  },

  signIn: async (email: string, password: string) => {
    securityUtils.logSecurityEvent('signin_attempt', {
      email,
      timestamp: new Date().toISOString()
    }, 'low');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      securityUtils.logSecurityEvent('signin_failed', {
        email,
        error: error.message
      }, 'medium');
      throw error;
    }
    
    securityUtils.logSecurityEvent('successful_signin', {
      email,
      userId: data.user?.id
    }, 'low');
    
    return data;
  },

  signOut: async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      securityUtils.logSecurityEvent('signout_failed', {
        userId,
        error: error.message
      }, 'low');
      throw error;
    }
    
    securityUtils.logSecurityEvent('successful_signout', {
      userId
    }, 'low');
  },

  resetPassword: async (email: string) => {
    securityUtils.logSecurityEvent('password_reset_request', {
      email,
      timestamp: new Date().toISOString()
    }, 'low');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      securityUtils.logSecurityEvent('password_reset_failed', {
        email,
        error: error.message
      }, 'medium');
      throw error;
    }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Export secure wrapper for sensitive data operations
export const secureDB = secureSupabaseWrapper;