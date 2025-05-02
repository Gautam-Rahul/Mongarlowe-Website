const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount is required and must be greater than 0' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId || '',
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Server error processing payment', error: error.message });
  }
});

// @desc    Get payment config
// @route   GET /api/payments/config
// @access  Public
router.get('/config', (req, res) => {
  res.status(200).json({
    publishableKey: 'pk_test_51RJ24mQ9qgsjkLMN6jtXQlfcwsUfglwCBBkGsegK72Yfr30l9lyEioNzganNOQ7BrsFAm18iQF4xn5wru6NusBz800cNnFmLnZ'
  });
});

// @desc    Webhook for Stripe events
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // This is just a placeholder. In a real application, you would verify the signature
    // with a webhook secret: event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    event = JSON.parse(req.body);
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update order status to paid
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router; 