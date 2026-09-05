import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLocalWorkspaceId, LOCAL_WORKSPACE_ID_KEY, resolveAuthProvider } from '../runtimeConfig';

describe('runtimeConfig', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.mocked(localStorage.getItem).mockImplementation((key: string) => storage.get(key) ?? null);
    vi.mocked(localStorage.setItem).mockImplementation((key: string, value: string) => {
      storage.set(key, value);
    });
    vi.mocked(localStorage.removeItem).mockImplementation((key: string) => {
      storage.delete(key);
    });
    vi.mocked(localStorage.clear).mockImplementation(() => {
      storage.clear();
    });
  });

  it('defaults auth provider to local and honors explicit values', () => {
    expect(resolveAuthProvider(undefined)).toBe('local');
    expect(resolveAuthProvider('local')).toBe('local');
    expect(resolveAuthProvider('supabase')).toBe('supabase');
    expect(resolveAuthProvider('okta')).toBe('local');
  });

  it('generates and persists a local workspace id', () => {
    const workspaceId = getLocalWorkspaceId();
    expect(workspaceId).toBeTruthy();
    expect(localStorage.getItem(LOCAL_WORKSPACE_ID_KEY)).toBe(workspaceId);
    expect(getLocalWorkspaceId()).toBe(workspaceId);
  });
});
