import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { securityUtils } from '../utils/securityUtils';
import { isSupabaseAuthEnabled } from '../config/runtimeConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Service role key for admin operations (only set via environment variable)
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

const createDisabledClient = (clientName: 'public' | 'admin'): SupabaseClient => (
  new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(
        `Supabase ${clientName} client is unavailable because VITE_AUTH_PROVIDER is set to "local".`
      );
    }
  })
);

if (isSupabaseAuthEnabled && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    'Supabase auth is enabled but required env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or switch VITE_AUTH_PROVIDER=local for demo/trial mode.'
  );
}

export const supabase: SupabaseClient = isSupabaseAuthEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDisabledClient('public');

// Admin client for service operations
export const supabaseAdmin: SupabaseClient = isSupabaseAuthEnabled
  ? (supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : supabase)
  : createDisabledClient('admin');

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
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
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
