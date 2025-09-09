# MediSoluce Deployment Guide

## 🚀 Production Deployment Guide

### Prerequisites

1. **Environment Variables**: Create a `.env.production` file based on `.env.example`
2. **Supabase Project**: Set up your Supabase project at https://supabase.com
3. **Domain**: Have your custom domain ready
4. **SSL Certificate**: Ensure SSL is configured (automatic with Vercel/Netlify)

### Build Summary

The production build has been optimized with:
- ✅ Code splitting for better performance
- ✅ PWA support with service workers
- ✅ Minified and compressed assets
- ✅ Security headers configured
- ✅ Total build size: ~1.6MB (before gzip)

### Deployment Options

## 1. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

**Environment Variables to Set in Vercel Dashboard:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GA_TRACKING_ID` (optional)
- `VITE_SENTRY_DSN` (optional)

## 2. Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

**Environment Variables to Set in Netlify Dashboard:**
- Same as above

## 3. Manual Deployment

If deploying to your own server:

1. Copy the `dist` folder to your web server
2. Configure your web server to:
   - Serve `index.html` for all routes (SPA routing)
   - Set proper security headers
   - Enable gzip compression
   - Configure SSL

### Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test authentication flow
- [ ] Check PWA installation
- [ ] Verify security headers (use https://securityheaders.com)
- [ ] Test performance (use Lighthouse)
- [ ] Monitor error tracking (if Sentry is configured)
- [ ] Set up monitoring alerts

### Security Considerations

1. **CSP Headers**: Already configured in `vercel.json` and `netlify.toml`
2. **HTTPS**: Ensure all traffic is over HTTPS
3. **API Keys**: Never expose sensitive keys in frontend code
4. **Regular Updates**: Keep dependencies updated

### Performance Monitoring

After deployment, monitor:
- Core Web Vitals
- Bundle size
- Error rates
- User analytics

### Rollback Procedure

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
Use the Netlify dashboard to restore a previous deployment

### Troubleshooting

**Issue: Blank page after deployment**
- Check browser console for errors
- Verify environment variables are set
- Check network tab for failed requests

**Issue: PWA not installing**
- Ensure HTTPS is enabled
- Check manifest.json is accessible
- Verify service worker registration

**Issue: Authentication not working**
- Verify Supabase URL and keys
- Check Supabase project settings
- Ensure redirect URLs are configured

### Support

For deployment issues:
1. Check deployment logs
2. Verify build output
3. Test locally with `npm run preview`
4. Check browser console for errors

## 🎉 Deployment Complete!

Your MediSoluce Healthcare Compliance Platform is now live!