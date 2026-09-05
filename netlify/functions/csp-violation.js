/**
 * Netlify Function - CSP violation report sink
 * Endpoint: /.netlify/functions/csp-violation (also /api/csp-violation via netlify.toml)
 * Target of `report-uri /api/csp-violation` in the CSP header.
 */

const { handleCspReport } = require('../../api/cspViolationCore.cjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: '' };
  }

  const result = handleCspReport(event.body);
  return { statusCode: result.status, body: '' };
};
