# 📊 MediSoluce Monitoring Setup Guide

This guide provides step-by-step instructions for setting up comprehensive monitoring for the MediSoluce Healthcare Compliance Platform in production.

## 🎯 Overview

The platform now includes:
- ✅ Error tracking (Sentry integration)
- ✅ CSP violation reporting
- ✅ Environment variable validation
- ✅ Centralized logging
- ✅ Health check endpoints

## 🔧 Setup Instructions

### 1. Error Tracking (Sentry) - REQUIRED

#### Step 1: Create Sentry Account
1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project for "MediSoluce"
3. Select "React" as the platform
4. Copy your DSN (Data Source Name)

#### Step 2: Configure Environment Variable
Add to your production environment (Vercel, Netlify, or `.env.production`):

```bash
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### Step 3: Verify Setup
After deployment, check Sentry dashboard for incoming errors. The ErrorHandler will automatically:
- Capture JavaScript errors
- Track security events
- Log CSP violations
- Monitor application health

### 2. Uptime Monitoring - REQUIRED

#### Option A: UptimeRobot (Free)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create a new monitor:
   - **Type:** HTTPS
   - **URL:** `https://your-domain.com/health`
   - **Interval:** 5 minutes
   - **Alert Contacts:** Add your email/SMS
3. Configure alerts for downtime

#### Option B: Pingdom
1. Go to [pingdom.com](https://pingdom.com)
2. Create a new check:
   - **URL:** `https://your-domain.com/health`
   - **Check Interval:** 1 minute
   - **Alert Settings:** Configure notifications

#### Option C: Better Uptime
1. Go to [betteruptime.com](https://betteruptime.com)
2. Create a new monitor:
   - **URL:** `https://your-domain.com/health`
   - **Check Interval:** 30 seconds
   - **Alert Policy:** Configure escalation

### 3. Analytics (Google Analytics) - OPTIONAL

#### Step 1: Create Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new property for your domain
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

#### Step 2: Configure Environment Variable
Add to your production environment:

```bash
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

#### Step 3: Verify Setup
After deployment, check Google Analytics Real-Time reports to verify tracking.

### 4. CSP Violation Reporting - AUTOMATIC

CSP violation reporting is automatically configured. Violations will be:
- Logged to console (development)
- Sent to `/api/csp-violation` endpoint (if configured)
- Reported to error tracking (Sentry) for critical violations

#### Setting Up CSP Violation Endpoint (Optional)

If you want to collect CSP violations on your server:

**Vercel:**
Create `api/csp-violation.js`:
```javascript
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const violation = req.body;
    // Log to your logging service
    console.log('CSP Violation:', violation);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}
```

**Netlify:**
Create `netlify/functions/csp-violation.js`:
```javascript
exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const violation = JSON.parse(event.body);
    // Log to your logging service
    console.log('CSP Violation:', violation);
    return { statusCode: 204 };
  }
  return { statusCode: 405 };
};
```

### 5. Environment Variable Validation - AUTOMATIC

Environment variable validation runs automatically on app startup. Check browser console for:
- ✅ Validation passed messages
- ⚠️ Warnings for missing optional variables
- ❌ Errors for missing required variables

### 6. Health Check Endpoint

The platform includes a health check endpoint at `/health` that returns:
```
healthy
```

Use this endpoint for:
- Uptime monitoring
- Load balancer health checks
- Container orchestration health checks

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] Sentry DSN configured (`VITE_SENTRY_DSN`)
- [ ] Uptime monitoring service configured
- [ ] Google Analytics ID configured (optional)
- [ ] All environment variables validated
- [ ] Health check endpoint tested
- [ ] Error tracking verified in Sentry
- [ ] CSP violation reporting tested

## 🔍 Post-Deployment Verification

### 1. Verify Error Tracking
1. Trigger a test error (e.g., visit a non-existent route)
2. Check Sentry dashboard for the error
3. Verify error context and stack traces

### 2. Verify Uptime Monitoring
1. Check your uptime monitoring service
2. Verify it's receiving responses from `/health`
3. Test alert notifications

### 3. Verify Analytics
1. Visit your production site
2. Check Google Analytics Real-Time reports
3. Verify page views are being tracked

### 4. Verify CSP Violation Reporting
1. Open browser console
2. Look for CSP violation warnings
3. Check Sentry for critical violations

### 5. Verify Environment Validation
1. Check browser console on page load
2. Verify no validation errors
3. Check for any warnings

## 📊 Monitoring Dashboard

### Key Metrics to Monitor

1. **Error Rate**
   - Target: < 0.1% of page views
   - Monitor in: Sentry

2. **Uptime**
   - Target: > 99.9%
   - Monitor in: Uptime monitoring service

3. **Response Time**
   - Target: < 2s for page load
   - Monitor in: Google Analytics, Sentry Performance

4. **CSP Violations**
   - Target: 0 critical violations
   - Monitor in: Sentry, CSP violation logs

5. **Health Check Status**
   - Target: Always "healthy"
   - Monitor in: Uptime monitoring service

## 🚨 Alert Configuration

### Critical Alerts (Immediate Response)
- Application downtime
- Error rate spike (> 1%)
- Critical CSP violations
- Health check failures

### Warning Alerts (Review Within 24h)
- Warning-level errors
- Performance degradation
- CSP violations (non-critical)
- Missing optional environment variables

## 📝 Maintenance

### Daily
- Review error logs in Sentry
- Check uptime status
- Monitor error rates

### Weekly
- Review CSP violation reports
- Analyze performance metrics
- Check for new error patterns

### Monthly
- Review and update monitoring thresholds
- Audit log retention policies
- Review and optimize alert rules

## 🔗 Resources

- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/react/)
- [Google Analytics Documentation](https://developers.google.com/analytics)
- [CSP Violation Reporting](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Health Check Best Practices](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)

## 🆘 Troubleshooting

### Errors Not Appearing in Sentry
1. Verify `VITE_SENTRY_DSN` is set correctly
2. Check browser console for Sentry initialization errors
3. Verify Sentry project settings allow your domain

### Health Check Failing
1. Verify `/health` endpoint is accessible
2. Check server logs for errors
3. Verify routing configuration

### CSP Violations Not Reporting
1. Check browser console for CSP errors
2. Verify CSP headers are set correctly
3. Check network tab for violation report requests

### Environment Validation Errors
1. Check browser console for specific missing variables
2. Verify environment variables are set in deployment platform
3. Check variable names match exactly (case-sensitive)

---

**Last Updated:** December 2024  
**Version:** 1.0.0

