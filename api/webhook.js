/**
 * Vercel Serverless Function - Stripe Webhook Handler
 * 
 * This endpoint handles Stripe webhook events for payment processing,
 * subscription updates, and other payment-related events.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret
 * - VITE_SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Supabase service role key (admin access)
 * 
 * Webhook Setup:
 * 1. In Stripe Dashboard, go to Developers > Webhooks
 * 2. Add endpoint: https://your-domain.com/api/webhook
 * 3. Select events to listen to:
 *    - checkout.session.completed
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_succeeded
 *    - invoice.payment_failed
 * 4. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Admin client using service role key — bypasses RLS for server-side operations
function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin credentials are not configured (VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(url, key);
}

/**
 * Upsert a subscription record in medisoluce.subscriptions.
 * Also updates the user's plan in medisoluce.profiles.
 */
async function upsertSubscription(supabase, subscription) {
  const record = {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    status: subscription.status,
    price_id: subscription.items?.data?.[0]?.price?.id ?? null,
    current_period_start: subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000).toISOString()
      : null,
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('medisoluce.subscriptions')
    .upsert(record, { onConflict: 'stripe_subscription_id' });

  if (error) {
    throw new Error(`Failed to upsert subscription ${subscription.id}: ${error.message}`);
  }

  // Mirror the active/cancelled state on the user profile
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  const { error: profileError } = await supabase
    .from('medisoluce.profiles')
    .update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer);

  if (profileError) {
    // Non-fatal: log and continue — the subscriptions table is the source of truth
    console.error('Failed to update profile for customer', subscription.customer, profileError.message);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error('Supabase admin client unavailable:', err.message);
    return res.status(500).json({ error: 'Database not configured' });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout completed:', session.id);

        if (session.mode === 'subscription' && session.subscription) {
          // Retrieve full subscription details and upsert
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await upsertSubscription(supabase, subscription);

          // Link the Stripe customer ID to the Supabase user via email
          if (session.customer_email) {
            const { error } = await supabase
              .from('medisoluce.profiles')
              .update({
                stripe_customer_id: session.customer,
                updated_at: new Date().toISOString(),
              })
              .eq('email', session.customer_email);

            if (error) {
              console.error('Failed to link Stripe customer to profile:', error.message);
            }
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log(`Subscription ${event.type}:`, subscription.id);
        await upsertSubscription(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        await upsertSubscription(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Invoice payment succeeded:', invoice.id);

        const { error } = await supabase
          .from('medisoluce.invoices')
          .upsert({
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer,
            stripe_subscription_id: invoice.subscription,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            status: 'paid',
            paid_at: invoice.status_transitions?.paid_at
              ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
              : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'stripe_invoice_id' });

        if (error) {
          console.error('Failed to record invoice payment:', error.message);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.error('Invoice payment failed:', invoice.id, 'customer:', invoice.customer);

        const { error } = await supabase
          .from('medisoluce.invoices')
          .upsert({
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer,
            stripe_subscription_id: invoice.subscription,
            amount_due: invoice.amount_due,
            currency: invoice.currency,
            status: 'payment_failed',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'stripe_invoice_id' });

        if (error) {
          console.error('Failed to record failed invoice:', error.message);
        }

        // Update profile to reflect payment failure so the UI can prompt the user
        const { error: profileError } = await supabase
          .from('medisoluce.profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', invoice.customer);

        if (profileError) {
          console.error('Failed to update profile subscription_status to past_due:', profileError.message);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }
}

