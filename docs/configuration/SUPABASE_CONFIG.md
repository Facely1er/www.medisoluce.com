# Supabase Configuration

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://nkgekxipzzvceesdjsrh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZ2VreGlwenp2Y2Vlc2Rqc3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MjA3MzQzMzQxNX0.W-598e6_uv5ES9DqgVr9ExdeY4uzZxcIZulrvioGqpA

# Optional: Service role key for admin operations
# Get this from your Supabase Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Updated Files

The following files have been updated with your new Supabase credentials:

- `src/lib/supabase.ts` - Main Supabase client configuration
- `src/services/backendService.ts` - Backend service configuration
- `src/services/apiService.ts` - API service configuration
- `scripts/setup-backend.js` - Backend setup script
- `scripts/test-backend.js` - Backend test script
- `scripts/simple-deploy.js` - Simple deployment script
- `scripts/deploy-database.js` - Database deployment script

## Important Notes

1. **Environment Variables**: The code now reads from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables first, with the provided credentials as fallback values.

2. **Service Role Key**: For admin operations, you'll need to get your service role key from your Supabase dashboard:
   - Go to https://supabase.com/dashboard/project/nkgekxipzzvceesdjsrh/settings/api
   - Copy the `service_role` key
   - Add it to your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`

3. **Local Development**: Make sure to create a `.env` file in the project root for local development. This file should not be committed to version control (it should already be in `.gitignore`).

4. **Production Deployment**: Set these environment variables in your deployment platform (Vercel, Netlify, etc.):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if needed)

## Testing

To verify the configuration is working, you can run:

```bash
npm run dev
```

The application should now connect to your new Supabase project.

