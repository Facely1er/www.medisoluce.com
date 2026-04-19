/**
 * Vercel Serverless Function - Create Stripe Customer Portal Session
 * 
 * This endpoint creates a session for the Stripe Customer Portal,
 * allowing customers to manage their subscriptions and billing.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
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
    const { customer_id, return_url } = req.body;

    // Validate required fields
    if (!customer_id) {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    // Get return URL
    const portalReturnUrl = return_url || 
                           process.env.VITE_APP_BASE_URL || 
                           'https://www.medisoluce.com';

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: portalReturnUrl,
    });

    // Return session information
    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe Portal Session creation error:', error);
    
    return res.status(500).json({
      error: error.message || 'Failed to create portal session',
      type: error.type || 'StripeError',
    });
  }
}

