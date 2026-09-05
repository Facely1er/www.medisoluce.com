/**
 * Shared handler for Content-Security-Policy violation reports.
 *
 * Browsers POST to the `report-uri` / `report-to` endpoint declared in the
 * CSP header (netlify.toml / vercel.json) with either:
 *   - application/csp-report: { "csp-report": { ... } }
 *   - application/reports+json: [ { type: "csp-violation", body: { ... } } ]
 *
 * We log a compact, bounded summary so the CSP can be tuned from production
 * telemetry, and always answer 204. No PHI is ever present in these reports.
 */

const MAX_BODY_BYTES = 16 * 1024;
const MAX_REPORTS = 10;

function summarise(report) {
  if (!report || typeof report !== 'object') return null;
  return {
    documentUri: report['document-uri'] || report.documentURL || null,
    violatedDirective: report['violated-directive'] || report.effectiveDirective || null,
    blockedUri: report['blocked-uri'] || report.blockedURL || null,
    sourceFile: report['source-file'] || report.sourceFile || null,
    lineNumber: report['line-number'] || report.lineNumber || null,
    disposition: report.disposition || null,
  };
}

/**
 * Normalise a raw body (string or object) into an array of summaries.
 * Returns [] for unparseable or oversized payloads.
 */
function extractReports(rawBody) {
  if (rawBody == null) return [];

  let text = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
  if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) {
    return [];
  }

  let parsed;
  try {
    parsed = typeof rawBody === 'string' ? JSON.parse(text) : rawBody;
  } catch {
    return [];
  }

  if (Array.isArray(parsed)) {
    return parsed
      .filter((entry) => entry && entry.type === 'csp-violation')
      .slice(0, MAX_REPORTS)
      .map((entry) => summarise(entry.body))
      .filter(Boolean);
  }

  if (parsed && parsed['csp-report']) {
    const summary = summarise(parsed['csp-report']);
    return summary ? [summary] : [];
  }

  return [];
}

function handleCspReport(rawBody) {
  const reports = extractReports(rawBody);
  for (const report of reports) {
    console.warn('[csp-violation]', JSON.stringify(report));
  }
  return { status: 204 };
}

module.exports = { extractReports, handleCspReport, MAX_BODY_BYTES };
