# Stripe Checkout Policies Setup Guide

This guide explains how to configure Stripe Checkout to display the E-Commerce Policy along with Privacy Policy and Terms of Service.

## Overview

Stripe Checkout supports displaying terms and conditions during the checkout process. However, Stripe's native `terms` parameter accepts a single URL. For multiple policies (Privacy, Terms, E-Commerce), you have several options:

1. **Option 1: Combined Terms Page** (Recommended)
   - Create a single page that links to all policies
   - Use this URL in Stripe's `terms` parameter

2. **Option 2: Policy Acknowledgment Before Checkout**
   - Show policy acknowledgment in your app before redirecting to Stripe
   - Use Stripe's `terms` parameter for the primary terms page

3. **Option 3: Custom Checkout Fields**
   - Use Stripe's custom fields to display policy links
   - More complex but provides full control

## Implementation

### Step 1: Environment Variables

Add to your `.env.local` and production environment:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
VITE_APP_BASE_URL=https://www.medisoluce.com # Your production domain

# Backend API (for creating checkout sessions)
VITE_API_URL=https://api.medisoluce.com # Your backend API URL
```

### Step 2: Backend API Endpoint

Create a backend endpoint to securely create Stripe Checkout Sessions:

**Example: `/api/create-checkout-session` (Node.js/Express)**

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  const {
    price_id,
    success_url,
    cancel_url,
    customer_email,
    metadata = {},
  } = req.body;

  // Get policy URLs (from your frontend or generate server-side)
  const baseUrl = process.env.APP_BASE_URL || 'https://www.medisoluce.com';
  const termsUrl = `${baseUrl}/terms`;
  const privacyUrl = `${baseUrl}/privacy`;
  const ecommercePolicyUrl = `${baseUrl}/ecommerce-policy`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription', // or 'payment' for one-time
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: customer_email,
      metadata: {
        ...metadata,
        privacy_policy_url: privacyUrl,
        terms_url: termsUrl,
        ecommerce_policy_url: ecommercePolicyUrl,
      },
      // Option 1: Use combined terms page
      // terms: {
      //   type: 'one_time', // or 'recurring' for subscriptions
      //   url: `${baseUrl}/terms-combined`, // Combined page with all policies
      // },
      
      // Option 2: Use primary terms URL
      // Stripe will show this in checkout
      // For multiple policies, create a combined page or use custom fields
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    res.json({
      session_id: session.id,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 3: Create Combined Terms Page (Optional but Recommended)

Create a page that links to all policies for Stripe's `terms` parameter:

**File: `src/pages/TermsCombinedPage.tsx`**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const TermsCombinedPage: React.FC = () => {
  return (
    <div className="py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-4">Terms and Policies</h1>
        <p className="mb-6">
          By using our services, you agree to the following policies:
        </p>
        <ul className="space-y-3">
          <li>
            <Link to="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/ecommerce-policy" className="text-primary-600 hover:underline">
              E-Commerce Policy (Subscription & Payment Terms, Refund & Cancellation Policy)
            </Link>
          </li>
          <li>
            <Link to="/cookie-policy" className="text-primary-600 hover:underline">
              Cookie Policy
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default TermsCombinedPage;
```

Add route in `App.tsx`:
```tsx
<Route path="/terms-combined" element={<TermsCombinedPage />} />
```

### Step 4: Use Policy Acknowledgment Component

Before redirecting to Stripe Checkout, show the policy acknowledgment:

**Example: `src/components/checkout/CheckoutButton.tsx`**

```tsx
import React, { useState } from 'react';
import { redirectToCheckout } from '../../services/stripeService';
import PolicyAcknowledgment from './PolicyAcknowledgment';

const CheckoutButton: React.FC<{ priceId: string }> = ({ priceId }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCheckout = async () => {
    if (!acknowledged) {
      alert('Please acknowledge the policies to continue');
      return;
    }

    try {
      await redirectToCheckout({
        priceId,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <PolicyAcknowledgment
        onAcknowledge={setAcknowledged}
        required={true}
      />
      <button
        onClick={handleCheckout}
        disabled={!acknowledged}
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};
```

### Step 5: Update Stripe Service

The `stripeService.ts` file is already configured to include policy URLs in metadata. Update your backend to use the combined terms page:

```typescript
// In your backend API endpoint
const baseUrl = process.env.APP_BASE_URL;
const session = await stripe.checkout.sessions.create({
  // ... other params
  terms: {
    type: 'recurring', // or 'one_time' for one-time payments
    url: `${baseUrl}/terms-combined`, // Combined page
  },
});
```

## Stripe Checkout Configuration Options

### Option A: Single Terms URL (Simplest)

```javascript
terms: {
  type: 'recurring',
  url: 'https://www.medisoluce.com/terms-combined',
}
```

### Option B: Custom Fields (More Control)

Stripe Checkout supports custom fields where you can add policy links:

```javascript
custom_fields: [
  {
    key: 'policy_acknowledgment',
    label: {
      type: 'custom',
      custom: 'I agree to the Terms, Privacy Policy, and E-Commerce Policy',
    },
    type: 'text',
    optional: false,
  },
],
```

### Option C: Metadata + Pre-Checkout Acknowledgment (Recommended)

1. Show policy acknowledgment in your app (using `PolicyAcknowledgment` component)
2. Include policy URLs in Stripe metadata
3. Use Stripe's terms parameter for primary terms

This approach:
- ✅ Ensures users see all policies before checkout
- ✅ Meets legal requirements
- ✅ Provides best user experience
- ✅ Works with Stripe's native terms display

## Testing

1. **Test in Stripe Test Mode:**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Verify Policy URLs:**
   - All policy pages should be publicly accessible
   - URLs should be absolute (include domain)
   - Test that links open correctly

3. **Test Checkout Flow:**
   - Policy acknowledgment should be required
   - Stripe Checkout should display terms link
   - Success/cancel URLs should work correctly

## Production Checklist

- [ ] Set `VITE_STRIPE_PUBLISHABLE_KEY` in production environment
- [ ] Set `VITE_APP_BASE_URL` to production domain
- [ ] Configure backend API endpoint with Stripe secret key
- [ ] Ensure all policy pages are publicly accessible
- [ ] Test checkout flow end-to-end
- [ ] Verify policy links work in Stripe Checkout
- [ ] Test with real payment method (in test mode)
- [ ] Verify metadata includes policy URLs

## Security Notes

⚠️ **Never expose your Stripe secret key in frontend code**

- Always create checkout sessions via your backend API
- Use environment variables for sensitive keys
- Validate all checkout session parameters server-side
- Use HTTPS for all policy URLs

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Terms Parameter](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-terms)
- [Stripe Custom Fields](https://stripe.com/docs/payments/checkout/custom-fields)

