import { createClient } from '@supabase/supabase-js';
import { securityUtils } from '../utils/securityUtils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up your project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced security wrapper for Supabase operations with schema prefixing
const secureSupabaseWrapper = {
  // Get the full table name with schema prefix
  getTableName(table: string): string {
    // If table already has schema prefix, use as is
    if (table.includes('.')) {
      return table;
    }
    // Otherwise, add the medisoluce schema prefix
    return `medisoluce.${table}`;
  },

  // Encrypt sensitive data before storing
  async insertSecureData(table: string, data: Record<string, unknown>, sensitiveFields: string[] = []) {
    const secureData = { ...data };
    const fullTableName = this.getTableName(table);
    
    // Encrypt sensitive fields
    sensitiveFields.forEach(field => {
      if (secureData[field]) {
        secureData[field] = securityUtils.encryptSensitiveData(secureData[field]);
      }
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_insert', {
      table: fullTableName,
      sensitiveFields,
      recordId: secureData.id
    }, 'low');
    
    return supabase.from(fullTableName).insert(secureData);
  },

  // Decrypt sensitive data after retrieval
  async selectSecureData(table: string, query: { select: string; column: string; value: unknown }, sensitiveFields: string[] = []) {
    const fullTableName = this.getTableName(table);
    const { data, error } = await supabase.from(fullTableName).select(query.select).eq(query.column, query.value);
    
    if (error) return { data: null, error };
    
    // Decrypt sensitive fields
    const decryptedData = data?.map(record => {
      const decrypted = { ...record };
      sensitiveFields.forEach(field => {
        if (decrypted[field]) {
          try {
            decrypted[field] = securityUtils.decryptSensitiveData(decrypted[field]);
          } catch (decryptError) {
            if (!import.meta.env.PROD) {
              console.warn(`Failed to decrypt field ${field}:`, decryptError);
            }
          }
        }
      });
      return decrypted;
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_select', {
      table: fullTableName,
      recordCount: data?.length || 0,
      sensitiveFields
    }, 'low');
    
    return { data: decryptedData, error };
  },

  // Update data with schema prefixing
  async updateSecureData(table: string, data: Record<string, unknown>, query: { column: string; value: unknown }, sensitiveFields: string[] = []) {
    const secureData = { ...data };
    const fullTableName = this.getTableName(table);
    
    // Encrypt sensitive fields
    sensitiveFields.forEach(field => {
      if (secureData[field]) {
        secureData[field] = securityUtils.encryptSensitiveData(secureData[field]);
      }
    });
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_update', {
      table: fullTableName,
      sensitiveFields,
      queryColumn: query.column,
      queryValue: query.value
    }, 'low');
    
    return supabase.from(fullTableName).update(secureData).eq(query.column, query.value);
  },

  // Delete data with schema prefixing
  async deleteSecureData(table: string, query: { column: string; value: unknown }) {
    const fullTableName = this.getTableName(table);
    
    // Log data access for audit trail
    securityUtils.logSecurityEvent('data_delete', {
      table: fullTableName,
      queryColumn: query.column,
      queryValue: query.value
    }, 'medium');
    
    return supabase.from(fullTableName).delete().eq(query.column, query.value);
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

  onAuthStateChange: (callback: (event: { event: string; session: unknown }, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Export secure wrapper for sensitive data operations
export const secureDB = secureSupabaseWrapper;

// Export table name helper for direct Supabase queries
export const getTableName = (table: string): string => {
  if (table.includes('.')) {
    return table;
  }
  return `medisoluce.${table}`;
};