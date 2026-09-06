# Real Implementation Capabilities

Last verified: 5 September 2026 against `921c063`.

This is the living map of what the app actually does. For production launch status, see `PRODUCTION_REVIEW.md`. For env flags, copy `.env.example` to `.env.local`.

Default runtime is **local demo mode**: `VITE_AUTH_PROVIDER=local` and `VITE_ENABLE_BILLING=false`. Assessments, training, and plans persist in the browser. Cloud auth and paid checkout are opt-in.

---

## 1. Functional without a backend

| Capability | Where | How it works |
|------------|--------|----------------|
| **HIPAA assessment** | `HIPAACheckPage` → `AssessmentEngine` | 10 questions, options scored 0–5, max 50. Result saved to `localStorage['hipaa-assessments']`. Question copy is translated; recommendation strings in `calculateResults()` are still English. Tier limit via `useTierLimit`. |
| **Ransomware assessment** | `RansomwareAssessment` | Same engine; saves to `hipaa-assessments`. |
| **System dependency mapping** | `DependencyManagerPage` | CRUD on `localStorage['system-dependencies']`. Import/export. Tier limit. |
| **Business impact assessment** | `BusinessImpactPage` | CRUD on `localStorage['business-impact-assessments']`. |
| **Continuity plans** | `ContinuityPage` | CRUD on `localStorage['continuity-plans']`. |
| **Comprehensive assessment** | `EnhancedAssessmentEngine` | Reads HIPAA, dependency, and continuity data from localStorage; computes category scores and recommendations; ransomware portion is a name/procedure heuristic. Saves to `localStorage['comprehensive-assessments']`. |
| **Dashboard** | `DashboardPage` | Reads localStorage keys for assessments, dependencies, impact, and training. Behind `ProtectedRoute` (open in local mode). |
| **Training (4 modules)** | `TrainingModulePage` | HIPAA Basics, dependency management, business continuity, ransomware. Lessons/quizzes in `src/data/training/`. Progress in `localStorage['training_<moduleId>_progress']`. |
| **Profile (local)** | `ProfilePage` | `localStorage['user-profile']`. Behind `ProtectedRoute`. |
| **Export** | `ExportManager` | JSON/CSV/report download from in-memory data. |
| **Toolkit downloads** | `ToolkitPage` | Files in `public/downloads/`. |
| **Pricing calculator** | `pricingCalculator.ts` | Reads factors from localStorage; used on pricing pages. |
| **Trials** | `trialService` + `useTrial` | `localStorage['medisoluce-trials']`. |
| **Security dashboard** | `SecurityDashboard` | Client-side DOM/header/localStorage checks only. |
| **Journey progress** | `JourneyProgress` | Steps 1–4 in `localStorage['journey-completed-steps']`. |
| **Policy pages** | Privacy / Terms / Cookie | Markdown from `public/policies/`. |
| **Tier limits** | `useTierLimit` | From `tierLimits.ts` and effective auth/trial tier. |

---

## 2. Auth (mode-dependent)

| Mode | Behavior |
|------|----------|
| `VITE_AUTH_PROVIDER=local` (default) | Login, register, and password reset screens are disabled. Dashboard remains usable. No Supabase client. |
| `VITE_AUTH_PROVIDER=supabase` | `Login` / `Register` / `ForgotPassword` call `supabase.auth`. Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` or startup shows a config error. |

`AuthContext` uses `getSession` / `onAuthStateChange` only in Supabase mode. There is no fake 1-second login that writes `user-session` anymore.

---

## 3. Billing (mode-dependent)

UI entry point: `useCheckout` on `HIPAAPricingPage`, `RansomwarePricingPage`, and `ContinuityPricingPage`.

| Path | When | What happens |
|------|------|----------------|
| Off | `VITE_ENABLE_BILLING` is not `true` | Upgrade buttons do not start checkout. |
| **Preferred: Payment Links** | `VITE_STRIPE_PAYMENT_LINK_<PRODUCT>_<TIER>` | Browser redirect to `buy.stripe.com`. No serverless call. |
| Fallback: Checkout Session | Price IDs set, no Payment Link | `redirectToCheckout` → `/api/create-checkout-session` (needs `STRIPE_SECRET_KEY` on the host). |
| Unconfigured with billing on | Billing true, no link or price | Toast and navigate to `/contact`. |

Customer portal (`createPortalSession`) exists in `stripeService` and API functions. No page calls it.

`PolicyAcknowledgment` exists but is not imported by any page.

---

## 4. Backend present but not used for product data

| Capability | Reality |
|------------|---------|
| **backendService persistence** | `saveAssessment` / `getAssessments` / training helpers use localStorage. `syncToBackend` / `syncFromBackend` still have TODOs. Missing Supabase env logs a warning; it does not throw. |
| **src/lib/database.ts** | No UI import. |
| **dataSynchronization.ts** | `useDataSync` / `dataSyncManager` have no importers. |
| **Contact form** | 1s delay, then `localStorage['contact-submissions']`. No email. |

---

## 5. Client-side security (not a HIPAA control plane)

| Claim people assume | Actual behavior |
|---------------------|-----------------|
| Encryption at rest | `encryptSensitiveData` is Base64 wrapping, commented as demo-only. |
| Audit trail | `securityUtils.logSecurityEvent` writes to localStorage. |
| Rate limiting | Login and contact `rateLimiter` is localStorage, not a server. |
| Push notifications | Not implemented. PWA service worker handles updates. |
| Analytics / Sentry | Optional. Load when `VITE_ENABLE_ANALYTICS` / error tracking flags, IDs, and cookie consent are set. |

---

## 6. i18n

Shipped locales: English and French (`src/i18n/locales/`). `i18nUtils` also defines Spanish and Arabic (including RTL helpers and `rtl.css`). Those locales are not loaded in `src/i18n/index.ts`.

---

## 7. Quick reference

Works with no backend: assessments, dependency map, impact, continuity, four training modules, dashboard, toolkit, trials, journey, local profile.

Needs env to work: Supabase auth, Stripe Payment Links or Checkout Sessions, GA, Sentry.

Does not work today: contact email delivery, cloud sync of assessments, Stripe customer portal UI, production-grade encryption of localStorage.
