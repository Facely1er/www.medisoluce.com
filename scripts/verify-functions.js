/**
 * Parse-check every Vercel and Netlify serverless entry so a syntax error
 * cannot ship to Stripe webhooks or checkout.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const files = [
  'api/webhook.js',
  'api/stripeWebhookCore.cjs',
  'api/stripeCheckoutCore.cjs',
  'api/cspViolationCore.cjs',
  'api/create-checkout-session.js',
  'api/create-portal-session.js',
  'api/csp-violation.js',
  'netlify/functions/webhook.js',
  'netlify/functions/create-checkout-session.js',
  'netlify/functions/create-portal-session.js',
  'netlify/functions/csp-violation.js',
];

let failed = false;

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`missing: ${file}`);
    failed = true;
    continue;
  }

  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
    console.log(`ok: ${file}`);
  } catch {
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
