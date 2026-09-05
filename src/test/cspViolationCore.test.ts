import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { extractReports, handleCspReport } = require('../../api/cspViolationCore.cjs');

describe('cspViolationCore', () => {
  it('extracts a legacy csp-report payload', () => {
    const reports = extractReports({
      'csp-report': {
        'document-uri': 'https://www.medisoluce.com/',
        'violated-directive': 'script-src',
        'blocked-uri': 'https://evil.example/x.js',
      },
    });
    expect(reports).toEqual([
      expect.objectContaining({
        documentUri: 'https://www.medisoluce.com/',
        violatedDirective: 'script-src',
        blockedUri: 'https://evil.example/x.js',
      }),
    ]);
  });

  it('extracts reporting-api csp-violation reports', () => {
    const reports = extractReports([
      {
        type: 'csp-violation',
        body: { documentURL: 'https://www.medisoluce.com/pricing', effectiveDirective: 'connect-src' },
      },
      { type: 'other', body: {} },
    ]);
    expect(reports).toHaveLength(1);
    expect(reports[0].violatedDirective).toBe('connect-src');
  });

  it('ignores oversized or unparseable bodies', () => {
    expect(extractReports('{')).toEqual([]);
    expect(extractReports('x'.repeat(20 * 1024))).toEqual([]);
  });

  it('always answers 204', () => {
    expect(handleCspReport(null).status).toBe(204);
    expect(handleCspReport({ 'csp-report': { 'document-uri': 'https://www.medisoluce.com/' } }).status).toBe(204);
  });
});
