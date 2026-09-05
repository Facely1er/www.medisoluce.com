#!/usr/bin/env node
/**
 * Production smoke checks for MediSoluce.
 *
 * Usage:
 *   node scripts/smoke-production.js
 *   BASE_URL=https://www.medisoluce.com node scripts/smoke-production.js
 *
 * Exit 0 only when every check passes. CORS checks that require a live
 * function response still pass when the deployment returns 503 (Stripe not
 * configured) as long as Access-Control-Allow-Origin does not reflect an
 * attacker origin.
 */

const BASE = (process.env.BASE_URL || 'https://www.medisoluce.com').replace(/\/+$/, '');
const EVIL = 'https://evil.example';

const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function fetchRaw(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE}${path}`, { method, headers, body, redirect: 'follow' });
  const text = await res.text();
  const hdrs = Object.fromEntries([...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]));
  return { status: res.status, headers: hdrs, text };
}

async function main() {
  console.log(`Smoke testing ${BASE}\n`);

  // 1. Key SPA routes
  for (const path of ['/', '/pricing', '/pricing/hipaa', '/cookie-policy', '/dashboard', '/contact', '/faq', '/hipaa-check', '/privacy']) {
    const r = await fetchRaw(path);
    record(`route ${path}`, r.status === 200, `HTTP ${r.status}`);
  }

  // 2. CSP header + report-uri
  const home = await fetchRaw('/');
  const csp = home.headers['content-security-policy'] || '';
  record('CSP header present', Boolean(csp), csp ? `${csp.slice(0, 80)}…` : 'missing');
  record('CSP report-uri /api/csp-violation', csp.includes('report-uri /api/csp-violation'));
  record('X-Frame-Options DENY', (home.headers['x-frame-options'] || '').toUpperCase() === 'DENY');

  // 3. No inline GA in index.html
  const html = home.text;
  record('no inline googletagmanager script', !/googletagmanager\.com\/gtag\/js/.test(html));
  record('no hardcoded G-VEQXJHYNHG in HTML', !html.includes('G-VEQXJHYNHG'));
  record('analytics deferral comment present', html.includes('Analytics is loaded at runtime'));

  // 4. CSP violation sink
  const cspPost = await fetchRaw('/api/csp-violation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/csp-report' },
    body: JSON.stringify({
      'csp-report': {
        'document-uri': `${BASE}/`,
        'violated-directive': 'script-src',
        'blocked-uri': `${EVIL}/x.js`,
      },
    }),
  });
  record('CSP report endpoint', cspPost.status === 204, `HTTP ${cspPost.status}`);

  // 5. Checkout CORS — evil origin must never be reflected
  const evilOpt = await fetchRaw('/api/create-checkout-session', {
    method: 'OPTIONS',
    headers: {
      Origin: EVIL,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type',
    },
  });
  const evilAco = evilOpt.headers['access-control-allow-origin'] || '';
  record(
    'OPTIONS checkout: evil Origin not reflected',
    evilAco !== EVIL && evilOpt.status !== 502,
    `HTTP ${evilOpt.status} ACO=${evilAco || '(none)'}`
  );

  const evilPost = await fetchRaw('/api/create-checkout-session', {
    method: 'POST',
    headers: { Origin: EVIL, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_id: 'price_test',
      success_url: `${EVIL}/s`,
      cancel_url: `${EVIL}/c`,
    }),
  });
  const evilPostAco = evilPost.headers['access-control-allow-origin'] || '';
  record(
    'POST checkout: evil Origin not reflected',
    evilPostAco !== EVIL && evilPost.status !== 502,
    `HTTP ${evilPost.status} ACO=${evilPostAco || '(none)'} body=${evilPost.text.slice(0, 80)}`
  );

  const okPost = await fetchRaw('/api/create-checkout-session', {
    method: 'POST',
    headers: { Origin: BASE, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_id: 'price_not_allowed',
      success_url: `${BASE}/checkout/success`,
      cancel_url: `${BASE}/checkout/cancel`,
    }),
  });
  const okAco = okPost.headers['access-control-allow-origin'] || '';
  record(
    'POST checkout: same-origin ACO is BASE (or 503 without Stripe)',
    okPost.status !== 502 && (okAco === BASE || okAco === ''),
    `HTTP ${okPost.status} ACO=${okAco || '(none)'} body=${okPost.text.slice(0, 100)}`
  );

  // 6. Portal + webhook must not 502 on missing Stripe (after boot fix: 503)
  const portal = await fetchRaw('/api/create-portal-session', {
    method: 'POST',
    headers: { Origin: EVIL, 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: 'cus_test' }),
  });
  record(
    'POST portal: not a cold-start 502',
    portal.status !== 502,
    `HTTP ${portal.status} ACO=${portal.headers['access-control-allow-origin'] || '(none)'}`
  );

  const webhook = await fetchRaw('/api/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  record(
    'POST webhook: not a cold-start 502',
    webhook.status !== 502,
    `HTTP ${webhook.status} body=${webhook.text.slice(0, 80)}`
  );

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.error('\nFailures:');
    for (const f of failed) console.error(`  - ${f.name}: ${f.detail || ''}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
