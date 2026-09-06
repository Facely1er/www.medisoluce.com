# MediSoluce Healthcare Compliance Platform

A healthcare compliance workspace for HIPAA assessment, technology dependency mapping, business continuity planning, ransomware guidance, staff training, and downloadable policy templates.

Core product data lives in the browser (`localStorage`). Cloud accounts and paid checkout are optional and off by default.

For what is actually wired versus simulated, see [docs/REAL_IMPLEMENTATION_CAPABILITIES.md](docs/REAL_IMPLEMENTATION_CAPABILITIES.md). For launch status, see [PRODUCTION_REVIEW.md](PRODUCTION_REVIEW.md).

## Features

- **HIPAA Compliance Assessment** — 10-question evaluation with scoring and recommendations
- **Technology Dependency Mapping** — Inventory and export critical system relationships
- **Business Impact Analysis** — Operational and financial risk from system failures
- **Business Continuity Planning** — Recovery plans stored locally
- **Ransomware Protection** — Assessment and training module
- **Staff Training** — Four interactive modules with quizzes (HIPAA, dependencies, continuity, ransomware)
- **Resource Toolkit** — Templates and guides in `public/downloads/`

## Privacy-first design

- **Local data storage** — Assessments, plans, and training progress stay on-device in demo mode
- **No account required** — Default `VITE_AUTH_PROVIDER=local` skips sign-in
- **Optional cloud auth** — Set `VITE_AUTH_PROVIDER=supabase` plus project keys for real accounts
- **No tracking by default** — Google Analytics and Sentry load only when enabled and the visitor accepts cookies

This app is designed around HIPAA *workflows* (assessment, training, templates). It is not a certified HIPAA control environment. Browser storage is not treated as encrypted PHI storage.

## Quick start

```bash
# Install dependencies (Node 20.x)
npm install

# Copy env template
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Testing

```bash
npm test
npm run test:watch
npm run test:ui
npm run test:coverage
```

## Tech stack

- **Frontend:** React 18 + TypeScript + Vite 7
- **Routing:** React Router 7
- **Styling:** Tailwind CSS
- **State:** React hooks + context
- **Data:** localStorage (default) + optional Supabase auth
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library
- **PWA:** vite-plugin-pwa (service worker)

## Development

### Environment setup

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Choose a mode in `.env.local`:

   - **Demo (default):**
     ```env
     VITE_AUTH_PROVIDER=local
     VITE_ENABLE_BILLING=false
     ```
   - **Client deploy with accounts and checkout:**
     ```env
     VITE_AUTH_PROVIDER=supabase
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     VITE_ENABLE_BILLING=true
     ```
     Prefer Stripe Payment Links (`VITE_STRIPE_PAYMENT_LINK_*`). Price IDs plus `STRIPE_SECRET_KEY` are the API fallback. See `.env.example`.

3. Get Supabase values from the [project API settings](https://app.supabase.com/project/_/settings/api) when using Supabase mode.

4. `npm install` then `npm run dev`

For production hosts, use `.env.production.example` as the variable checklist. Vite bakes `VITE_*` values at build time, so change env then redeploy.

### Code quality

```bash
npm run type-check
npm run lint
npm run build:analyze
```

## Deployment

See [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md) and `.env.production.example`.

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

Self-host: `npm run build`, then serve `dist` with `index.html` as the SPA fallback.

## Internationalization

English and French are shipped. Locale-aware date/number formatting is enabled. RTL CSS exists for future locales; Arabic and Spanish are not loaded in the i18n bundle.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure `npm test`, `npm run lint`, and `npm run type-check` pass
6. Open a pull request

## Support

- **Email:** support@medisoluce.com
- **Docs in this repo:** [docs/DOCUMENTATION_ORGANIZATION.md](docs/DOCUMENTATION_ORGANIZATION.md)
- **Issues:** [GitHub Issues](https://github.com/Facely1er/www.medisoluce.com/issues)

## License

Copyright © 2026 ERMITS. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
