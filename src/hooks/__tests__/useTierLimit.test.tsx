import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { useTierLimit } from '../useTierLimit';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useTierLimit', () => {
  it('returns free tier when no user (no auth)', () => {
    const { result } = renderHook(
      () => useTierLimit({ limitKey: 'hipaaAssessments', currentCount: 0 }),
      { wrapper }
    );
    expect(result.current.tier).toBe('free');
    expect(result.current.limit).toBe(3);
    expect(result.current.canSave).toBe(true);
    expect(result.current.atLimit).toBe(false);
    expect(result.current.isUnlimited).toBe(false);
  });

  it('reports atLimit when currentCount >= free limit', () => {
    const { result } = renderHook(
      () => useTierLimit({ limitKey: 'hipaaAssessments', currentCount: 3 }),
      { wrapper }
    );
    expect(result.current.tier).toBe('free');
    expect(result.current.limit).toBe(3);
    expect(result.current.atLimit).toBe(true);
    expect(result.current.canSave).toBe(false);
  });

  it('returns correct limit for systemDependencies on free tier', () => {
    const { result } = renderHook(
      () => useTierLimit({ limitKey: 'systemDependencies', currentCount: 5 }),
      { wrapper }
    );
    expect(result.current.tier).toBe('free');
    expect(result.current.limit).toBe(10);
    expect(result.current.canSave).toBe(true);
  });

  it('accepts productId without affecting free tier result', () => {
    const { result } = renderHook(
      () =>
        useTierLimit({
          productId: 'hipaa',
          limitKey: 'hipaaAssessments',
          currentCount: 1,
        }),
      { wrapper }
    );
    expect(result.current.tier).toBe('free');
    expect(result.current.canSave).toBe(true);
  });
});
