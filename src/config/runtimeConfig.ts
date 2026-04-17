export type AuthProvider = 'local' | 'supabase';

export const LOCAL_WORKSPACE_ID_KEY = 'local-workspace-id';

export function resolveAuthProvider(rawProvider?: string, mode?: string): AuthProvider {
  if (rawProvider === 'local' || rawProvider === 'supabase') {
    return rawProvider;
  }

  if (rawProvider) {
    console.warn(`Invalid VITE_AUTH_PROVIDER value "${rawProvider}". Falling back to default.`);
  }

  if ((mode ?? import.meta.env.MODE) === 'test') {
    return 'local';
  }

  return 'supabase';
}

export const authProvider = resolveAuthProvider(import.meta.env.VITE_AUTH_PROVIDER, import.meta.env.MODE);
export const isSupabaseAuthEnabled = authProvider === 'supabase';
export const isBillingEnabled = import.meta.env.VITE_ENABLE_BILLING === 'true';

export function getLocalWorkspaceId(): string {
  if (typeof window === 'undefined') {
    return 'server-workspace';
  }

  const existingWorkspaceId = localStorage.getItem(LOCAL_WORKSPACE_ID_KEY);
  if (existingWorkspaceId) {
    return existingWorkspaceId;
  }

  const generatedWorkspaceId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `workspace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(LOCAL_WORKSPACE_ID_KEY, generatedWorkspaceId);
  return generatedWorkspaceId;
}
