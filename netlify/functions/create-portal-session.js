/**
 * Netlify Serverless Function - Create Stripe Customer Portal Session
 * 
 * This endpoint creates a session for the Stripe Customer Portal,
 * allowing customers to manage their subscriptions and billing.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
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
    const { customer_id, return_url } = body;

    // Validate required fields
    if (!customer_id) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'customer_id is required' }),
      };
    }

    // Get return URL
    const portalReturnUrl = return_url || 
                           process.env.VITE_APP_BASE_URL || 
                           process.env.URL ||
                           'https://www.medisoluce.com';

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: portalReturnUrl,
    });

    // Return session information
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Stripe Portal Session creation error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'Failed to create portal session',
        type: error.type || 'StripeError',
      }),
    };
  }
};

