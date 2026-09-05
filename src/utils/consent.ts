/**
 * Analytics consent store.
 *
 * MediSoluce is privacy-first: no third-party analytics script may load until
 * the visitor has explicitly opted in. The decision is kept in localStorage
 * (first-party, no cookie) and broadcast via a window event so late-loaded
 * modules (analytics) can react without polling.
 */

export type ConsentState = 'granted' | 'denied' | 'unknown';

export const CONSENT_STORAGE_KEY = 'medisoluce-analytics-consent-v1';
export const CONSENT_CHANGED_EVENT = 'medisoluce:analytics-consent-changed';

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getAnalyticsConsent(): ConsentState {
  if (!hasWindow()) return 'unknown';
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : 'unknown';
  } catch {
    return 'unknown';
  }
}

export function setAnalyticsConsent(state: Exclude<ConsentState, 'unknown'>): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, state);
  } catch {
    // Storage unavailable (private mode / quota) — still notify listeners for this session.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGED_EVENT, { detail: state }));
}

export function resetAnalyticsConsent(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGED_EVENT, { detail: 'unknown' }));
}

/**
 * Subscribe to consent changes. Returns an unsubscribe function.
 */
export function onAnalyticsConsentChange(listener: (state: ConsentState) => void): () => void {
  if (!hasWindow()) return () => undefined;
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ConsentState>).detail;
    listener(detail ?? getAnalyticsConsent());
  };
  window.addEventListener(CONSENT_CHANGED_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handler);
}

/**
 * Whether the deployment has analytics turned on at all. When false there is
 * nothing to consent to and the banner is not shown.
 */
export const isAnalyticsFeatureEnabled: boolean =
  import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && Boolean(import.meta.env.VITE_GA_TRACKING_ID);
