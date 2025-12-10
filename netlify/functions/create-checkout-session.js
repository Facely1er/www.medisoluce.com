/**
 * Netlify Serverless Function - Create Stripe Checkout Session
 * 
 * This endpoint securely creates a Stripe Checkout Session using the server-side secret key.
 * Never expose your Stripe secret key in frontend code.
 * 
 * Environment Variables Required (set in Netlify dashboard):
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_... or sk_live_...)
 * - VITE_APP_BASE_URL: Your application base URL (for policy links)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
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
    } = body;

    // Validate required fields
    if (!price_id) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'price_id is required' }),
      };
    }

    if (!success_url || !cancel_url) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'success_url and cancel_url are required' }),
      };
    }

    // Get base URL for policy links
    const baseUrl = process.env.VITE_APP_BASE_URL || 
                    process.env.URL || 
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
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        session_id: session.id,
        url: session.url,
        id: session.id,
      }),
    };
  } catch (error) {
    console.error('Stripe Checkout Session creation error:', error);
    
    // Return user-friendly error message
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'Failed to create checkout session',
        type: error.type || 'StripeError',
      }),
    };
  }
};

