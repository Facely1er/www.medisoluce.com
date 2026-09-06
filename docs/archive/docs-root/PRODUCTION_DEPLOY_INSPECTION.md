# Production Deployment Inspection – End Users

Inspection date: 2025-02-27. This document summarizes production readiness for deploying to end users.

---

## 1. Build & scripts

| Item | Status | Notes |
|------|--------|------|
| **Build** | OK | `npm run build` / `build:prod`; Vite outputs to `dist/` |
| **Source maps** | OK | Disabled in production (`sourcemap: process.env.NODE_ENV !== 'production'`) |
| **Console stripping** | OK | Terser drops `console` and `pure_funcs` in production |
| **Minification** | OK | Terser with 2 passes, legal comments removed |
| **Chunking** | OK | Manual chunks for vendor, ui, charts, i18n, supabase, forms, security, performance |
| **Pre-deploy** | OK | `predeploy` runs `scripts/pre-deployment-check.js` (env, build size, console, security config, localStorage, schema, sync) |
| **Deploy targets** | OK | `deploy:vercel`, `deploy:netlify`, `deploy:staging`; Vercel/Netlify configs present |

**Recommendation:** Run `npm run predeploy` (or `npm run build:prod && npm run pre-deployment-check`) before each production release.

---

## 2. Environment & backend

| Item | Status | Notes |
|------|--------|------|
| **Supabase (backend)** | **BLOCKER** | `backendService.ts` runs `validateEnvVars()` on **module load** and **throws in production** if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing. Any code path that loads `backendService` (e.g. via `supabase.ts` → used by `database.ts`, `schemaDifferentiation.ts`; and `comprehensiveHealthManager` in prod monitoring in `main.tsx`) will crash. |
| **Optional backend** | Inconsistent | `envValidation.ts` treats all vars as optional (required: []). Backend is effectively **required** in production unless you make backend loading conditional and stop throwing in `backendService`. |
| **Stripe** | OK | Uses `VITE_STRIPE_PUBLISHABLE_KEY`; `getStripePublicKey()` throws only when checkout is used; `isStripeConfigured()` used to guard UI. |
| **API URL** | OK | `VITE_API_URL` for checkout/portal; defaults to `/api`. |
| **Sentry** | Optional | `VITE_SENTRY_DSN`; error handler uses it in prod with sampling. |
| **Analytics** | Bug risk | `analytics.ts` uses `process.env.NODE_ENV === 'production'`. In Vite client bundle, `process.env.NODE_ENV` may be undefined; use `import.meta.env.PROD` so production analytics/error tracking enable correctly. |
| **Env files** | OK | `.env.example`, `.env.production.example`; pre-deploy checks `.env.production.local`. |

**Recommendation (critical):**  
- Either set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in production env for every deploy, **or**  
- Make backend optional: e.g. in `backendService.ts`, do not throw when URL/key are missing; treat as “local-only” and guard/lazy-load any code that uses Supabase so it never runs when backend is disabled.  
- In `analytics.ts`, replace `process.env.NODE_ENV === 'production'` with `import.meta.env.PROD`.

---

## 3. Security

| Item | Status | Notes |
|------|--------|------|
| **Vercel** | OK | `vercel.json`: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, COOP; SPA rewrite to `/index.html`; asset cache headers. |
| **Netlify** | OK | `netlify.toml`: same security headers, redirects for SPA; `/api/*` to Netlify functions. |
| **index.html** | OK | Meta: X-Content-Type-Options, X-XSS-Protection, Referrer-Policy. |
| **Vite dev/preview** | OK | Same security headers on server/preview. |
| **CSP reporting** | Optional | `report-uri` / `report-to` point to `/api/csp-violation`; need a serverless function or backend to receive reports. |
| **Secrets** | OK | No secrets in repo; `SUPABASE_SERVICE_ROLE_KEY` must be server-side only (not in Vite env). |

---

## 4. PWA & manifest

| Item | Status | Notes |
|------|--------|------|
| **VitePWA** | OK | `registerType: 'autoUpdate'`, Workbox, runtime caching (Supabase, network-first). |
| **Manifest (vite)** | OK | name, short_name, theme_color, display standalone, start_url `/app`, scope `/app`. |
| **public/manifest.json** | OK | Rich icons, shortcuts to /app/hipaa-check, dependency-manager, dashboard. |
| **Scope** | Note | PWA scope is `/app`; app routes are `/`, `/hipaa-check`, etc., with redirects from `/app` to `/dashboard` etc. Install flow works; deep links under `/app/*` are in-scope. |
| **Icons** | OK | vite.config references medisoluce.png; public manifest references /icons/* and favicon. |

---

## 5. i18n & locale

| Item | Status | Notes |
|------|--------|------|
| **Locales** | OK | EN and FR under `src/i18n/locales/`; loaded synchronously. |
| **Debug** | OK | i18n debug off in production (`debug: !import.meta.env.PROD`). |
| **TranslationGuard** | OK | `showMissingKeys={!import.meta.env.PROD}` so missing keys only shown in dev. |

---

## 6. Production-only behavior

| Item | Status | Notes |
|------|--------|------|
| **Monitoring (main.tsx)** | Runs in PROD | `initializeMonitoring()` in prod dynamically imports `comprehensiveHealthManager` → pulls in Supabase/backendService. If Supabase env is missing, this path throws. |
| **Dev-only UI** | OK | PerformanceMonitor, HealthOptimizer, ProductionReadinessIndicator, HealthEnhancementDashboard only when `!import.meta.env.PROD`. |
| **Error/Sentry** | OK | Sentry and sampling only in prod; error handler respects PROD. |

---

## 7. Checklist before going live

- [ ] **Env:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in production for cloud sync (optional: app runs in local-only mode without them).
- [ ] **Optional:** Set `VITE_SENTRY_DSN`, `VITE_GA_TRACKING_ID` if using Sentry/GA.
- [ ] **Stripe:** Set `VITE_STRIPE_PUBLISHABLE_KEY` and ensure backend `/api/create-checkout-session` and `/api/create-portal-session` exist and use secret key server-side.
- [x] **Done:** `src/utils/analytics.ts` uses `import.meta.env.PROD`; `backendService` no longer throws when Supabase env missing; `ErrorBoundary` uses `import.meta.env.PROD`.
- [ ] Run `npm run predeploy` (or build + pre-deployment-check) and fix any failures.
- [ ] Run `npm run build` and smoke-test `npm run preview` (and test with missing Supabase env if you support local-only).
- [ ] Confirm CSP and security headers in browser (e.g. Response headers on deployed origin).
- [ ] If offering “no backend” tier: make backend optional and avoid loading `backendService`/Supabase when env is not set; ensure HealthDashboard and prod monitoring handle missing backend.

---

## 8. Summary

| Area | Verdict |
|------|--------|
| Build & deploy config | Ready; use predeploy and existing deploy scripts. |
| Security headers & CSP | Configured on Vercel and Netlify. |
| PWA & manifest | Ready for install and deep links. |
| i18n | Production-safe. |
| **Backend requirement** | **Must** set Supabase env in production or make backend optional and stop throwing. |
| **Analytics production flag** | Fix `process.env.NODE_ENV` → `import.meta.env.PROD` for reliable prod behavior. |

The main risk for production deploy to end users is the **hard dependency on Supabase** in production: if env is missing, the app will throw once monitoring (or any code that imports supabase/backendService) runs. Either configure Supabase for all deploys or implement and test an optional-backend path and then deploy.
