# Supabase Configuration

Supabase is **optional**. The default demo uses `VITE_AUTH_PROVIDER=local` and does not create a client.

Use this guide only when you want real sign-in (`VITE_AUTH_PROVIDER=supabase`).

## Environment variables

Copy `.env.example` to `.env.local` (development) or set the same keys on the host (production). Do not commit real values.

```env
VITE_AUTH_PROVIDER=supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get the URL and anon key from [Supabase → Project Settings → API](https://app.supabase.com/project/_/settings/api).

Server-only (never a `VITE_` prefix, never in frontend bundles):

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

There are **no hardcoded project URL or key fallbacks** in `src/lib/supabase.ts`. Missing keys in Supabase mode block startup with a visible configuration error.

## What Supabase is used for today

- Auth: `signInWithPassword`, `signUp`, `resetPasswordForEmail`, session in `AuthContext`
- Not used for product persistence: assessments, training, and plans still write to `localStorage`

Schema files under `database/` describe a `medisoluce` schema if you later enable cloud sync. That sync path is not wired in the UI.

## Local vs production files

| File | Use |
|------|-----|
| `.env.example` | Local demo template → copy to `.env.local` |
| `.env.production.example` | Host checklist (Netlify / Vercel / CI) |

Do not create a committed `.env` with live credentials.

## Related

- [docs/REAL_IMPLEMENTATION_CAPABILITIES.md](../REAL_IMPLEMENTATION_CAPABILITIES.md)
- [database/README.md](../../database/README.md)
- [docs/configuration/MULTI_PROJECT_SUPABASE_SETUP.md](MULTI_PROJECT_SUPABASE_SETUP.md)
