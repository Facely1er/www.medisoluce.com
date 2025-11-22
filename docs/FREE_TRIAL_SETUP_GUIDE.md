# Free Trial System Setup Guide

## Overview

The MediSoluce free trial system provides automated, tailored trial experiences with:
- **Automated trial tracking** per user/product
- **Tailored onboarding** based on user role and use case
- **Automatic notifications** (3 days and 1 day before expiration)
- **Payment method collection** for automatic conversion
- **One trial per user per product** enforcement

## Quick Start

### 1. Enable Trial on Pricing Pages

Update your pricing page components to trigger trial activation:

```typescript
import TrialActivationModal from '../components/trial/TrialActivationModal';
import { useTrial } from '../hooks/useTrial';

// In your pricing component
const { isEligible } = useTrial(userId);
const [showTrialModal, setShowTrialModal] = useState(false);

// Update CTA button
<Button
  onClick={() => {
    if (isEligible('hipaa')) {
      setShowTrialModal(true);
    } else {
      // Redirect to purchase or show upgrade message
    }
  }}
>
  Start Free Trial
</Button>

<TrialActivationModal
  isOpen={showTrialModal}
  onClose={() => setShowTrialModal(false)}
  productId="hipaa"
  productName="HIPAA Compliance"
  tier="professional"
  userId={userId}
  userEmail={userEmail}
  onTrialStarted={(trialId) => {
    // Redirect to dashboard or show onboarding
    navigate('/dashboard');
  }}
/>
```

### 2. Display Trial Status Banner

Add trial status to your dashboard or main pages:

```typescript
import TrialBanner from '../components/trial/TrialBanner';
import { useTrial } from '../hooks/useTrial';

// In your dashboard component
const { activeTrial } = useTrial(userId, 'hipaa');

{activeTrial && (
  <TrialBanner
    trial={activeTrial}
    onDismiss={() => {
      // Store dismissal preference
      localStorage.setItem(`trial-banner-dismissed-${activeTrial.productId}`, 'true');
    }}
  />
)}
```

### 3. Show Tailored Onboarding

Display personalized onboarding after trial starts:

```typescript
import TrialOnboarding from '../components/trial/TrialOnboarding';
import { useTrial } from '../hooks/useTrial';

// In your dashboard or after trial activation
const { activeTrial } = useTrial(userId, 'hipaa');
const [showOnboarding, setShowOnboarding] = useState(false);

useEffect(() => {
  // Show onboarding if trial just started
  const onboardingShown = localStorage.getItem(`onboarding-shown-${activeTrial?.productId}`);
  if (activeTrial && !onboardingShown) {
    setShowOnboarding(true);
  }
}, [activeTrial]);

{showOnboarding && activeTrial && (
  <TrialOnboarding
    trial={activeTrial}
    onComplete={() => {
      localStorage.setItem(`onboarding-shown-${activeTrial.productId}`, 'true');
      setShowOnboarding(false);
    }}
    onSkip={() => {
      localStorage.setItem(`onboarding-shown-${activeTrial.productId}`, 'true');
      setShowOnboarding(false);
    }}
  />
)}
```

## Integration with Stripe

### Collect Payment Method for Trial

For Professional and Enterprise tiers, collect payment method during trial activation:

```typescript
import { redirectToCheckout } from '../services/stripeService';

// In TrialActivationModal or after trial starts
const handleAddPaymentMethod = async () => {
  try {
    await redirectToCheckout({
      priceId: 'price_trial_professional', // Your Stripe price ID
      successUrl: `${window.location.origin}/dashboard?payment=success`,
      cancelUrl: `${window.location.origin}/dashboard?payment=cancelled`,
      customerEmail: userEmail,
      metadata: {
        trial_id: `${userId}-${productId}`,
        product: productId,
        tier: tier
      },
      subscriptionData: {
        trialPeriodDays: tier === 'professional' ? 30 : 30
      }
    });
  } catch (error) {
    console.error('Failed to redirect to checkout:', error);
  }
};
```

### Auto-Convert Trial to Paid Subscription

When trial expires, automatically convert to paid:

```typescript
import { trialService } from '../services/trialService';

// Check for expired trials and convert
useEffect(() => {
  const expiredTrials = trialService.checkTrialExpiration();
  
  expiredTrials.forEach(trial => {
    if (trial.paymentMethodOnFile && trial.autoConvert) {
      // Convert to paid subscription via Stripe
      // This should be handled by your backend webhook
      convertTrialToPaid(trial.userId, trial.productId, subscriptionId);
    }
  });
}, []);
```

## Backend Webhook Setup

Set up Stripe webhooks to handle trial conversion:

```javascript
// Backend webhook handler (Node.js example)
app.post('/webhooks/stripe', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const trialId = session.metadata.trial_id;
    
    // Update trial with payment method
    trialService.addPaymentMethod(
      session.metadata.user_id,
      session.metadata.product,
      session.payment_method
    );
  }
  
  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object;
    const trialId = subscription.metadata.trial_id;
    
    // Convert trial to paid
    trialService.convertTrialToPaid(
      subscription.metadata.user_id,
      subscription.metadata.product,
      subscription.id
    );
  }
  
  res.json({ received: true });
});
```

## Automated Notifications

The system automatically sends notifications:
- **3 days before expiration**: Reminder to add payment method
- **1 day before expiration**: Final reminder
- **On expiration**: Notification that trial has expired

Notifications are stored in localStorage and can be displayed in your UI:

```typescript
// Get pending notifications
const notifications = JSON.parse(
  localStorage.getItem('trial-notifications') || '[]'
);

// Display notifications
notifications.forEach(notification => {
  showToast({
    type: notification.type === 'expired' ? 'error' : 'warning',
    title: 'Trial Notification',
    message: notification.message
  });
});

// Clear displayed notifications
localStorage.removeItem('trial-notifications');
```

## Tailored Onboarding

The system provides personalized onboarding based on:

### Role-Based Recommendations
- **Compliance Officer**: HIPAA assessment, policy templates, training tracking
- **IT Director/CISO**: Dependency mapping, security assessment, threat analysis
- **Operations Manager**: Continuity planning, impact analysis, recovery procedures
- **Practice Manager**: Basic assessments, templates, documentation
- **Executive**: ROI reporting, business impact, compliance overview

### Use Case-Based Recommendations
- **Audit Readiness**: HIPAA assessment, documentation review, gap analysis
- **Ransomware Protection**: Ransomware playbook, incident response, backup verification
- **HIPAA Compliance**: Full compliance suite recommendations
- **Business Continuity**: Continuity planning, impact analysis, recovery procedures

## Configuration

### Trial Duration by Tier
- **Essential**: 14 days
- **Professional**: 30 days
- **Enterprise**: 30 days

To customize, update `DEFAULT_TRIAL_DAYS` in `trialService.ts`:

```typescript
private readonly DEFAULT_TRIAL_DAYS = {
  essential: 14,
  professional: 30,
  enterprise: 30
};
```

### Product IDs

Use consistent product IDs across your application:
- `hipaa` - HIPAA Compliance
- `ransomware` - Ransomware Protection
- `continuity` - Business Continuity
- `dependency` - Dependency Management

## Testing

### Test Trial Activation
```typescript
const trial = trialService.startTrial({
  userId: 'test-user-123',
  email: 'test@example.com',
  productId: 'hipaa',
  productName: 'HIPAA Compliance',
  tier: 'professional',
  tailoredData: {
    role: 'compliance-officer',
    useCase: 'audit-readiness'
  }
});
```

### Test Trial Expiration
```typescript
// Manually set trial end date to past
const trial = trialService.getActiveTrial(userId, productId);
trial.endDate = new Date(Date.now() - 1000).toISOString();
trialService.saveTrial(trial);

// Check expiration
const expired = trialService.checkTrialExpiration();
```

## Best Practices

1. **Always check eligibility** before showing trial CTA
2. **Collect payment method early** for Professional/Enterprise tiers
3. **Show onboarding immediately** after trial starts
4. **Display trial status** prominently in dashboard
5. **Send email notifications** in addition to in-app notifications
6. **Track trial conversion rates** for analytics
7. **Personalize experience** based on role and use case

## Troubleshooting

### Trial Not Starting
- Check if user already has a trial for that product
- Verify userId is correctly passed
- Check browser console for errors

### Notifications Not Showing
- Request browser notification permission
- Check localStorage for notification data
- Verify notification triggers are firing

### Payment Method Not Saving
- Verify Stripe webhook is configured
- Check webhook payload structure
- Ensure metadata includes trial_id

## Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage data structure
3. Review trial service logs
4. Test with different user roles and use cases

