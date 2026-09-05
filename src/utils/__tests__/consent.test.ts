import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  getAnalyticsConsent,
  onAnalyticsConsentChange,
  resetAnalyticsConsent,
  setAnalyticsConsent,
} from '../consent';

describe('analytics consent store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('defaults to unknown when nothing is stored', () => {
    expect(getAnalyticsConsent()).toBe('unknown');
  });

  it('persists granted and denied decisions', () => {
    setAnalyticsConsent('granted');
    expect(getAnalyticsConsent()).toBe('granted');
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('granted');

    setAnalyticsConsent('denied');
    expect(getAnalyticsConsent()).toBe('denied');
  });

  it('treats corrupted storage values as unknown', () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'maybe');
    expect(getAnalyticsConsent()).toBe('unknown');
  });

  it('notifies subscribers and supports unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = onAnalyticsConsentChange(listener);

    setAnalyticsConsent('granted');
    expect(listener).toHaveBeenCalledWith('granted');

    resetAnalyticsConsent();
    expect(listener).toHaveBeenCalledWith('unknown');
    expect(getAnalyticsConsent()).toBe('unknown');

    unsubscribe();
    setAnalyticsConsent('denied');
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe('analytics bootstrap', () => {
  it('does not inject the Google Analytics script without consent', async () => {
    window.localStorage.clear();
    const { analytics } = await import('../analytics');

    analytics.init('G-TESTTEST');

    expect(analytics.isActive()).toBe(false);
    expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).toBeNull();
  });
});
