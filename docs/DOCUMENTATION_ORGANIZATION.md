# Documentation organization

Living docs only. Dated session reports live in [archive/](archive/README.md).

## Start here

| File | Purpose |
|------|---------|
| [README.md](../README.md) | Install, env modes, stack |
| [.env.example](../.env.example) | Local template → `.env.local` |
| [.env.production.example](../.env.production.example) | Host / CI checklist |
| [PRODUCTION_REVIEW.md](../PRODUCTION_REVIEW.md) | Current production status |
| [REAL_IMPLEMENTATION_CAPABILITIES.md](REAL_IMPLEMENTATION_CAPABILITIES.md) | What is wired vs local-only vs unused |

## By topic

### Configuration

- [configuration/SUPABASE_CONFIG.md](configuration/SUPABASE_CONFIG.md) — optional Supabase auth (no live keys)
- [configuration/MULTI_PROJECT_SUPABASE_SETUP.md](configuration/MULTI_PROJECT_SUPABASE_SETUP.md)
- [configuration/MONITORING_SETUP_GUIDE.md](configuration/MONITORING_SETUP_GUIDE.md)

### Deployment

- [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)
- [deployment/README_PRODUCTION.md](deployment/README_PRODUCTION.md)
- [deployment/PRODUCTION_DEPLOYMENT.md](deployment/PRODUCTION_DEPLOYMENT.md)

### Implementation

- [implementation/STRIPE_BACKEND_SETUP.md](implementation/STRIPE_BACKEND_SETUP.md)
- [implementation/FREE_TRIAL_IMPLEMENTATION_SUMMARY.md](implementation/FREE_TRIAL_IMPLEMENTATION_SUMMARY.md)

### Testing

- [testing/QUICK_TESTING_GUIDE.md](testing/QUICK_TESTING_GUIDE.md)
- [testing/BROWSER_TESTING_GUIDE.md](testing/BROWSER_TESTING_GUIDE.md)

### Product / schema

- [database/README.md](../database/README.md) — intended `medisoluce` schema (not yet used by UI persistence)
- [public/policies/](../public/policies/) — site policies
- [public/downloads/](../public/downloads/) — toolkit templates

### Archive

[archive/README.md](archive/README.md) — snapshot reports, old Stripe summaries, leftover root reviews.

Agent notes (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`) are for AI tooling, not operator runbooks.
