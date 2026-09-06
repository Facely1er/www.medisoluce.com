const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin credentials are not configured (VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(url, key, { db: { schema: 'medisoluce' } });
}

async function upsertInvoice(supabase, invoice, status) {
  const record = {
    stripe_invoice_id: invoice.id,
    stripe_customer_id: invoice.customer,
    stripe_subscription_id: invoice.subscription,
    amount_paid: invoice.amount_paid ?? null,
    amount_due: invoice.amount_due ?? null,
    currency: invoice.currency,
    status,
    paid_at:
      status === 'paid' && invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
        : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('invoices')
    .upsert(record, { onConflict: 'stripe_invoice_id' });

  if (error) {
    throw new Error(`Failed to upsert invoice ${invoice.id} (status=${status}): ${error.message}`);
  }
}

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
    .from('subscriptions')
    .upsert(record, { onConflict: 'stripe_subscription_id' });

  if (error) {
    throw new Error(
      `Failed to upsert subscription ${subscription.id} (status=${subscription.status}): ${error.message}`
    );
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer);

  if (profileError) {
    console.error('Failed to update profile for customer', subscription.customer, profileError.message);
  }
}

async function handleStripeEvent(stripe, supabase, event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await upsertSubscription(supabase, subscription);

        if (session.customer_email) {
          const { error } = await supabase
            .from('profiles')
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
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      await upsertSubscription(supabase, event.data.object);
      break;
    }

    case 'invoice.payment_succeeded': {
      await upsertInvoice(supabase, event.data.object, 'paid');
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await upsertInvoice(supabase, invoice, 'payment_failed');

      const { data: updatedProfiles, error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', invoice.customer)
        .select('id');

      if (profileError) {
        console.error('Failed to update profile subscription_status to past_due:', profileError.message);
      } else if (!updatedProfiles || updatedProfiles.length === 0) {
        console.warn('invoice.payment_failed: no profile found for Stripe customer', invoice.customer);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

module.exports = {
  getSupabaseAdmin,
  handleStripeEvent,
};
