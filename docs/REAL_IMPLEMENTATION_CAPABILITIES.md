# Real Implementation Capabilities – Truly Functional vs Not

This document distinguishes what is **truly functional** in the app (works end-to-end with real logic and persistence) from **simulated**, **stub**, **dead**, or **unwired** code.

---

## 1. Fully functional (client-side, no backend required)

| Capability | Where | How it works |
|------------|--------|----------------|
| **HIPAA assessment** | `HIPAACheckPage` → `AssessmentEngine` | User answers 10 questions; `calculateResults()` computes score and recommendations; result saved to `localStorage['hipaa-assessments']`. Tier limit enforced via `useTierLimit`. |
| **Ransomware assessment** | `RansomwareAssessment` (uses `AssessmentEngine`) | Same engine; questions and scoring for ransomware; saves to same `hipaa-assessments` key. |
| **System dependency mapping** | `DependencyManagerPage` | CRUD to `localStorage['system-dependencies']`. Add/edit/delete/bulk import/export. ExportManager for JSON/CSV. Tier limit enforced. |
| **Business impact assessment** | `BusinessImpactPage` | CRUD to `localStorage['business-impact-assessments']`. Scoring and display. Tier limit enforced. |
| **Continuity plans** | `ContinuityPage` | CRUD to `localStorage['continuity-plans']`. Forms, list, delete. Tier limit enforced. |
| **Comprehensive assessment** | `EnhancedAssessmentEngine` | Reads hipaa-assessments, system-dependencies, continuity-plans from localStorage; computes overall score, category scores, ransomware heuristic, recommendations, executive summary; saves to `localStorage['comprehensive-assessments']`. |
| **Dashboard** | `DashboardPage` | Reads hipaa-assessments, system-dependencies, business-impact-assessments, training-progress from localStorage; shows metrics, recent activity, charts (Recharts). |
| **Training (HIPAA Basics)** | `HIPAABasicsModule` | Static content from `hipaaBasicsContent`; progress (lessons, quiz) in `localStorage['training_hipaa_basics_progress']`; quiz and certificate. |
| **Profile (local)** | `ProfilePage` | Form state and persistence in `localStorage['user-profile']`. No server round-trip. |
| **Export (JSON/CSV/report)** | `ExportManager` | Builds blob from in-memory data; triggers browser download. Used on Dashboard, Dependency Manager, etc. |
| **Toolkit downloads** | `ToolkitPage` | Download links point to `/downloads/*.md` and `/downloads/*.csv`; files exist in `public/downloads/`. Preview fetches markdown via `fetch(resource.downloadLink)`. |
| **Pricing calculator** | `pricingCalculator.ts` | Reads factors from localStorage (`getPricingFactorsFromStorage`); returns dynamic prices and recommendations. Used on pricing pages. |
| **Trial management** | `trialService` + `useTrial` | All state in `localStorage['medisoluce-trials']`. Start trial, expiration, notifications – no backend. |
| **Security dashboard** | `SecurityDashboard` | Calls `advancedSecurityScanner.performSecurityScan()` and `securityUtils.generateAdvancedSecurityReport()` – client-side DOM/security checks and threat history. |
| **Security utils** | `securityUtils.ts` | Encryption, MFA simulation, password strength, PHI detection, audit logging to localStorage – all client-side. |
| **Journey progress** | `JourneyProgress` + pages | Steps 1–4 completed state in `localStorage['journey-completed-steps']`; steps unlock sequentially. |
| **Policy pages** | `PrivacyPage`, `TermsPage`, `CookiePolicyPage` | Load markdown from `/policies/*.md` via fetch. |
| **Contact form (local)** | `ContactPage` | Validation and rate limit; then **simulated** 1s delay; submission stored in `localStorage['contact-submissions']`; redirect to `/thanks`. No email or server. |
| **Tier limits** | `useTierLimit` + config | Reads from `tierLimits.ts`; effective tier from auth/trial; blocks save and shows toast when at limit. |

---

## 2. Simulated (no real server/backend)

| Capability | Where | What’s simulated |
|------------|--------|-------------------|
| **Login** | `Login.tsx` | `await new Promise(resolve => setTimeout(resolve, 1000))` then writes encrypted session to `localStorage['user-session']`. No Supabase (or any) auth call. |
| **Register** | `Register.tsx` | Same: 1s delay, then write to `user-session`. MFA key stored locally. No backend signup. |
| **Forgot password** | `ForgotPassword.tsx` | 1s delay; append to `localStorage['password-resets']`; toast “Check your email” – no email sent. |
| **Contact submission** | `ContactPage` | 1s delay; save to `localStorage['contact-submissions']`; redirect to thanks. No server, no email. |

---

## 3. Backend present but not used for persistence

| Capability | Where | Reality |
|------------|--------|---------|
| **Supabase / backendService** | `backendService.ts`, `supabase.ts`, `database.ts` | `validateEnvVars()` runs on load and **throws in production** if Supabase env missing. `saveAssessment`, `getAssessments`, `saveTrainingProgress`, `getTrainingProgress` all use **localStorage only**. `syncToBackend` / `syncFromBackend` call `supabase.auth.getUser()` but contain **TODO: Implement actual backend sync** – no DB writes. So: auth/sync **not** used for persistence; only getSession used by health manager. |
| **database.ts** | `lib/database.ts` | Exposes secureDB/Supabase for profiles, assessments, training, audit logs, etc. **No page or component imports it** – dead for UI. |
| **Data sync** | `dataSynchronization.ts` | `DataSynchronizationManager` and `useDataSync` exist but **no file imports them** – sync is dead code. When sync would run, it would call `schemaManager` (Supabase RPCs) and `secureDB` – so sync-to-cloud is unimplemented and unused. |

---

## 4. Implemented but not wired in UI

| Capability | Where | Status |
|------------|--------|--------|
| **Stripe checkout** | `stripeService.ts` | `createCheckoutSession()` and `redirectToCheckout()` call `VITE_API_URL/create-checkout-session`. **No component or page imports or calls them** – no “Subscribe” / “Buy” button triggers checkout. Payment collection is implemented in service layer only. |
| **Stripe portal** | `stripeService.ts` | `createPortalSession()` same: backend call exists, no UI calls it. |

---

## 5. Partial / heuristic (functional but not “real” data)

| Capability | Where | Note |
|------------|--------|------|
| **Comprehensive assessment – ransomware score** | `EnhancedAssessmentEngine` | `calculateRansomwareScore()` is a **heuristic** (e.g. “has backup” from dependency names/procedures, risk level). Comment: “Simulate ransomware assessment based on common vulnerabilities”. Rest of comprehensive result (HIPAA, dependency, continuity scores, recommendations) is from real stored data. |
| **Security scanner** | `advancedSecurityScanner.ts` | Real client-side checks (DOM, headers, localStorage, input patterns). No server; findings are local only. |

---

## 6. Conditional / external dependency

| Capability | Where | Requirement |
|------------|--------|--------------|
| **Stripe (if wired)** | `stripeService` | `VITE_STRIPE_PUBLISHABLE_KEY`; backend at `VITE_API_URL` with `/create-checkout-session` and `/create-portal-session` using Stripe secret. |
| **Production run** | `backendService` | `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set or app throws when any code path loads backendService (e.g. prod monitoring in main.tsx). |
| **Analytics** | `analytics.ts` | `VITE_GA_TRACKING_ID` optional; init wrapped in try/catch. |
| **Sentry** | `errorHandler` | `VITE_SENTRY_DSN` optional; used in prod for error reporting. |

---

## 7. Summary table

| Category | Examples |
|----------|----------|
| **Truly functional** | HIPAA + Ransomware assessments, dependency map, business impact, continuity plans, comprehensive assessment, dashboard, training, profile (local), export, toolkit downloads, pricing calculator, trials, security dashboard, journey, tier limits, policy pages. |
| **Simulated** | Login, register, forgot password, contact form (local storage only, no server/email). |
| **Backend not used for data** | Supabase/backendService/database – no UI persistence to DB; sync TODOs; database.ts unused. |
| **Dead code** | `useDataSync` / `dataSyncManager`; no importer. |
| **Unwired** | Stripe checkout/portal – no UI calls. |
| **Partial/heuristic** | Ransomware score in comprehensive assessment. |

---

## 8. Quick reference: what works without any backend

- All assessments (HIPAA, ransomware, comprehensive) and their storage.
- Dependency manager, business impact, continuity plans (full CRUD and export).
- Dashboard, training, profile, toolkit downloads, pricing calculator, trials.
- Security dashboard and security utils.
- Journey progress and tier limits.
- Policy and contact (contact only stores locally; no email).
- “Login” and “register” create a local session only; no server auth.

What **does not** work or is **not** used: real auth, real contact delivery, cloud sync, Stripe payments (no UI trigger), any persistence to Supabase tables from the current UI.
