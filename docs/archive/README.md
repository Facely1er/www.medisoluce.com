# Archived documentation

Frozen session reports and superseded write-ups, moved on 5 September 2026 so living docs stay findable.

These files are **not** source of truth. They can contradict the current app (auth modes, Stripe Payment Links, test counts, env templates).

## Use instead

| Need | File |
|------|------|
| What the code actually does | [docs/REAL_IMPLEMENTATION_CAPABILITIES.md](../REAL_IMPLEMENTATION_CAPABILITIES.md) |
| Launch / production status | [PRODUCTION_REVIEW.md](../../PRODUCTION_REVIEW.md) |
| Local env | [.env.example](../../.env.example) |
| Host env | [.env.production.example](../../.env.production.example) |
| Stripe | [docs/implementation/STRIPE_BACKEND_SETUP.md](../implementation/STRIPE_BACKEND_SETUP.md) |
| Deploy | [docs/deployment/DEPLOYMENT.md](../deployment/DEPLOYMENT.md) |
| Index | [docs/DOCUMENTATION_ORGANIZATION.md](../DOCUMENTATION_ORGANIZATION.md) |

## Layout

- `reports/` — status, completion, and production-ready snapshots
- `root/` — leftover project reviews that sat in the repo root
- `implementation/` — Stripe summaries from before Payment Links + `useCheckout`
- `testing/` — dated test-count and verification reports
- `deployment/` — deployment-complete / remaining-tasks snapshots
