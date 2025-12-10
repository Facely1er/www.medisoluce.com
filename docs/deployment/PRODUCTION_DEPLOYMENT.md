# Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.production`
- [ ] Set `VITE_SUPABASE_URL` to your production Supabase URL
- [ ] Set `VITE_SUPABASE_ANON_KEY` to your production Supabase anon key
- [ ] Set `VITE_GA_TRACKING_ID` if using Google Analytics
- [ ] Set `VITE_SENTRY_DSN` if using Sentry for error tracking
- [ ] Verify all required environment variables are set

### 2. Security Audit
- [ ] Run `npm run security:check`
- [ ] Review security audit report
- [ ] Fix any high/critical vulnerabilities
- [ ] Update dependencies if needed

### 3. Code Quality
- [ ] Run `npm run lint` and fix any issues
- [ ] Run `npm run type-check` to ensure TypeScript compilation
- [ ] Run `npm run test` to ensure all tests pass
- [ ] Review console logs and remove any sensitive information

### 4. Build Verification
- [ ] Run `npm run build:prod` locally
- [ ] Verify build output in `dist/` directory
- [ ] Test the built application locally with `npm run preview`

## 🏗️ Build Commands

### Production Build
```bash
# Clean previous builds
npm run clean

# Production build with security checks
npm run build:prod

# Preview production build locally
npm run preview
```

### Build Analysis
```bash
# Analyze bundle size and dependencies
npm run build:analyze
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Deploy to Vercel
npm run deploy:vercel

# Or manually
vercel --prod
```

### Option 2: Netlify
```bash
# Deploy to Netlify
npm run deploy:netlify

# Or manually
netlify deploy --prod --dir=dist
```

### Option 3: Docker
```bash
# Build and run with Docker
docker-compose up -d

# Or manually
docker build -t medisoluce-app .
docker run -p 80:80 -p 443:443 medisoluce-app
```

### Option 4: Custom Server (Nginx)
1. Copy `nginx.conf` to your server
2. Update server_name and SSL certificate paths
3. Build the application: `npm run build:prod`
4. Copy `dist/` contents to your web server directory
5. Restart nginx

## 🔒 Security Configuration

### SSL/TLS
- [ ] Obtain SSL certificate (Let's Encrypt recommended)
- [ ] Configure HTTPS redirects
- [ ] Enable HSTS headers
- [ ] Use strong cipher suites

### Security Headers
- [ ] Content Security Policy (CSP)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- [ ] Configure API rate limiting
- [ ] Set login attempt limits
- [ ] Monitor for suspicious activity

## 📊 Monitoring & Analytics

### Health Checks
- [ ] Configure health check endpoint (`/health`)
- [ ] Set up uptime monitoring
- [ ] Configure alerting for downtime

### Performance Monitoring
- [ ] Enable Sentry error tracking
- [ ] Configure Google Analytics
- [ ] Set up performance monitoring
- [ ] Monitor Core Web Vitals

### Logging
- [ ] Configure structured logging
- [ ] Set up log aggregation
- [ ] Monitor error rates
- [ ] Track user interactions

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run deploy:check
      - run: npm run build:prod
      - run: npm run deploy:vercel
```

## 🧪 Post-Deployment Testing

### Functionality Tests
- [ ] Test all major user flows
- [ ] Verify authentication works
- [ ] Test form submissions
- [ ] Verify API integrations
- [ ] Test responsive design

### Performance Tests
- [ ] Measure page load times
- [ ] Test on slow connections
- [ ] Verify caching works
- [ ] Check bundle sizes

### Security Tests
- [ ] Verify HTTPS enforcement
- [ ] Test security headers
- [ ] Verify CSP restrictions
- [ ] Test rate limiting

## 📈 Performance Optimization

### Caching Strategy
- [ ] Static assets: 1 year
- [ ] HTML files: 1 hour
- [ ] API responses: 24 hours
- [ ] Fonts: 1 year

### Compression
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Use CDN for static assets

### Bundle Optimization
- [ ] Code splitting enabled
- [ ] Tree shaking active
- [ ] Vendor chunking
- [ ] Lazy loading for routes

## 🚨 Troubleshooting

### Common Issues
1. **Build fails**: Check environment variables and dependencies
2. **Runtime errors**: Verify production environment configuration
3. **Performance issues**: Check bundle size and caching
4. **Security warnings**: Review CSP and security headers

### Debug Commands
```bash
# Check build output
ls -la dist/

# Analyze bundle
npm run build:analyze

# Check security
npm run security:scan

# Test locally
npm run build:preview
```

## 📞 Support

For deployment issues:
1. Check the build logs
2. Verify environment variables
3. Review security audit results
4. Test locally before deploying
5. Check deployment platform documentation

## 🔄 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review security audit reports
- [ ] Monitor performance metrics
- [ ] Backup environment configurations
- [ ] Test disaster recovery procedures

### Updates
- [ ] Test updates in staging environment
- [ ] Plan maintenance windows
- [ ] Communicate changes to users
- [ ] Monitor post-update performance