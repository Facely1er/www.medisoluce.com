/**
 * Vercel Serverless Function - Create Stripe Checkout Session
 * 
 * This endpoint securely creates a Stripe Checkout Session using the server-side secret key.
 * Never expose your Stripe secret key in frontend code.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_... or sk_live_...)
 * - VITE_APP_BASE_URL: Your application base URL (for policy links)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_BASE_URL || 'https://www.medisoluce.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      price_id,
      success_url,
      cancel_url,
      customer_email,
      customer,
      metadata = {},
      allow_promotion_codes = true,
      subscription_data,
      mode = 'subscription', // 'subscription' or 'payment'
    } = req.body;

    // Validate required fields
    if (!price_id) {
      return res.status(400).json({ error: 'price_id is required' });
    }

    if (!success_url || !cancel_url) {
      return res.status(400).json({ error: 'success_url and cancel_url are required' });
    }

    // Get base URL for policy links
    const baseUrl = process.env.VITE_APP_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'https://www.medisoluce.com';

    // Prepare metadata with policy URLs
    const sessionMetadata = {
      ...metadata,
      privacy_policy_url: `${baseUrl}/privacy`,
      terms_url: `${baseUrl}/terms`,
      ecommerce_policy_url: `${baseUrl}/ecommerce-policy`,
    };

    // Create Stripe Checkout Session
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: sessionMetadata,
      allow_promotion_codes: allow_promotion_codes,
      // Include terms URL for Stripe Checkout display
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    };

    // Add customer information if provided
    if (customer_email) {
      sessionParams.customer_email = customer_email;
    }

    if (customer) {
      sessionParams.customer = customer;
    }

    // Add subscription data if provided (for trials, etc.)
    if (subscription_data && mode === 'subscription') {
      sessionParams.subscription_data = subscription_data;
    }

    // Create the session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Return session information
    return res.status(200).json({
      session_id: session.id,
      url: session.url,
      id: session.id,
    });
  } catch (error) {
    console.error('Stripe Checkout Session creation error:', error);
    
    // Return user-friendly error message
    return res.status(500).json({
      error: error.message || 'Failed to create checkout session',
      type: error.type || 'StripeError',
    });
  }
}

