/**
 * Vercel Serverless Function - CSP violation report sink
 * Target of `report-uri /api/csp-violation` in vercel.json.
 */

const { handleCspReport } = require('./cspViolationCore');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const result = handleCspReport(req.body);
  return res.status(result.status).end();
};
