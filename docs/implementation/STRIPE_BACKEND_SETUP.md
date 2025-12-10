# Stripe Backend Implementation - Setup Guide

## ✅ Implementation Complete

The Stripe backend has been fully implemented with support for both Vercel and Netlify deployments.

## 📁 Files Created

### Backend API Functions

**Vercel Serverless Functions:**
- `api/create-checkout-session.js` - Creates Stripe Checkout Sessions
- `api/create-portal-session.js` - Creates Customer Portal sessions
- `api/webhook.js` - Handles Stripe webhook events

**Netlify Functions:**
- `netlify/functions/create-checkout-session.js` - Creates Stripe Checkout Sessions
- `netlify/functions/create-portal-session.js` - Creates Customer Portal sessions
- `netlify/functions/webhook.js` - Handles Stripe webhook events

### Frontend Updates

- `src/services/stripeService.ts` - Updated with API URL support and portal session function
- `src/pages/CheckoutSuccessPage.tsx` - Success page after payment
- `src/pages/CheckoutCancelPage.tsx` - Cancellation page
- `src/App.tsx` - Added checkout routes

### Configuration

- `vercel.json` - Updated with API route handling
- `env.example` - Updated with Stripe configuration
- `env.production.example` - Updated with production Stripe configuration

## 🚀 Setup Instructions

### Step 1: Install Dependencies

Stripe has been added to `package.json`. If you need to reinstall:

```bash
npm install
```

### Step 2: Configure Stripe Account

1. **Create/Login to Stripe Account**
   - Go to https://dashboard.stripe.com
   - Create account or login

2. **Get API Keys**
   - Go to Developers > API Keys
   - Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - ⚠️ **Never expose the Secret Key in frontend code!**

3. **Create Products and Prices**
   - Go to Products in Stripe Dashboard
   - Create products for your pricing tiers
   - Create prices for each product (one-time or recurring)
   - Copy the Price IDs (starts with `price_`)

### Step 3: Configure Environment Variables

#### For Vercel Deployment:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add the following variables:

```
# Frontend (Public)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
VITE_APP_BASE_URL=https://www.medisoluce.com
VITE_API_URL= (leave empty for same-domain API)

# Backend (Private - Server-side only)
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (after webhook setup)
```

#### For Netlify Deployment:

1. Go to your Netlify site
2. Site Settings → Environment Variables
3. Add the same variables as above

#### For Local Development:

1. Copy `env.example` to `.env.local`
2. Fill in your Stripe keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_BASE_URL=http://localhost:5173
VITE_API_URL=
STRIPE_SECRET_KEY=sk_test_...
```

### Step 4: Set Up Stripe Webhook

1. **In Stripe Dashboard:**
   - Go to Developers > Webhooks
   - Click "Add endpoint"

2. **For Vercel:**
   - Endpoint URL: `https://your-domain.com/api/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **For Netlify:**
   - Endpoint URL: `https://your-domain.com/.netlify/functions/webhook`
   - Select the same events as above

4. **Copy Webhook Secret:**
   - After creating the webhook, click on it
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 5: Update Pricing Pages

Update your pricing pages to use the Stripe service:

```typescript
import { redirectToCheckout } from '../services/stripeService';

// In your pricing component
const handleCheckout = async (priceId: string) => {
  try {
    await redirectToCheckout({
      priceId: priceId,
      successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
      customerEmail: user?.email,
      mode: 'subscription', // or 'payment' for one-time
    });
  } catch (error) {
    console.error('Checkout error:', error);
    // Show error to user
  }
};
```

### Step 6: Test the Integration

1. **Test Mode:**
   - Use Stripe test mode keys (`pk_test_` and `sk_test_`)
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC

2. **Test Flow:**
   - Click "Buy" on a pricing page
   - Complete checkout with test card
   - Verify redirect to success page
   - Check Stripe Dashboard for successful payment

3. **Test Webhook:**
   - Use Stripe CLI for local testing:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhook
     ```
   - Or use Stripe Dashboard webhook testing

## 🔒 Security Best Practices

1. **Never expose Secret Key:**
   - ✅ Secret key only in backend environment variables
   - ❌ Never in frontend code
   - ❌ Never in git repository

2. **Use HTTPS:**
   - Always use HTTPS in production
   - Stripe requires HTTPS for webhooks

3. **Validate Webhook Signatures:**
   - Webhook handler verifies signatures
   - Prevents unauthorized webhook calls

4. **Environment Variables:**
   - Use different keys for test and production
   - Rotate keys regularly
   - Use secrets management in production

## 📝 API Endpoints

### Create Checkout Session
- **Endpoint:** `POST /api/create-checkout-session`
- **Body:**
  ```json
  {
    "price_id": "price_...",
    "success_url": "https://...",
    "cancel_url": "https://...",
    "customer_email": "user@example.com",
    "mode": "subscription",
    "metadata": {}
  }
  ```

### Create Portal Session
- **Endpoint:** `POST /api/create-portal-session`
- **Body:**
  ```json
  {
    "customer_id": "cus_...",
    "return_url": "https://..."
  }
  ```

### Webhook
- **Endpoint:** `POST /api/webhook` (Vercel) or `POST /.netlify/functions/webhook` (Netlify)
- **Headers:** `stripe-signature` (verified automatically)

## 🐛 Troubleshooting

### Checkout Not Working

1. **Check Environment Variables:**
   - Verify `STRIPE_SECRET_KEY` is set
   - Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set

2. **Check API Endpoint:**
   - Verify API functions are deployed
   - Check browser console for errors
   - Check server logs

3. **Check CORS:**
   - API functions include CORS headers
   - Verify API URL is correct

### Webhook Not Receiving Events

1. **Check Webhook Secret:**
   - Verify `STRIPE_WEBHOOK_SECRET` is set
   - Verify it matches Stripe Dashboard

2. **Check Webhook URL:**
   - Verify URL is correct in Stripe Dashboard
   - Test with Stripe CLI locally

3. **Check Logs:**
   - Check server logs for webhook errors
   - Check Stripe Dashboard webhook logs

## 📚 Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Products and prices created in Stripe
- [ ] Environment variables configured
- [ ] Webhook endpoint created
- [ ] Webhook secret added to environment
- [ ] Pricing pages updated with checkout buttons
- [ ] Test checkout flow
- [ ] Test webhook events
- [ ] Switch to live mode keys (when ready)

---

**Implementation Date:** December 2024  
**Status:** ✅ Complete and Ready for Testing

