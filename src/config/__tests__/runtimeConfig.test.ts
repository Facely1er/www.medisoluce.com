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

  it('defaults auth provider to supabase outside test mode', () => {
    expect(resolveAuthProvider(undefined, 'production')).toBe('supabase');
  });

  it('uses local auth provider in test mode when unset', () => {
    expect(resolveAuthProvider(undefined, 'test')).toBe('local');
  });

  it('generates and persists a local workspace id', () => {
    const workspaceId = getLocalWorkspaceId();
    expect(workspaceId).toBeTruthy();
    expect(localStorage.getItem(LOCAL_WORKSPACE_ID_KEY)).toBe(workspaceId);
    expect(getLocalWorkspaceId()).toBe(workspaceId);
  });
});
