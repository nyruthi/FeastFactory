require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// In-memory payment status store (use a DB in production)
const paymentStatus = {};

// POST /api/create-order
// Body: { amount: number (in rupees), currency: 'INR', receipt: string }
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount is required' });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    paymentStatus[order.id] = { status: 'created', orderId: order.id };
    res.json({ success: true, order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/verify-payment
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      paymentStatus[razorpay_order_id] = {
        status: 'paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      };
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      paymentStatus[razorpay_order_id] = { status: 'failed' };
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payment-status/:orderId
app.get('/api/payment-status/:orderId', (req, res) => {
  const status = paymentStatus[req.params.orderId];
  if (!status) return res.status(404).json({ error: 'Order not found' });
  res.json(status);
});

// GET /payment — serves the Razorpay web checkout page
app.get('/payment', (req, res) => {
  const { order_id, amount, name = 'The Feast Factory', description = 'Food Catering Order' } = req.query;

  if (!order_id || !amount) {
    return res.status(400).send('Missing order_id or amount');
  }

  const options = {
    key: process.env.RAZORPAY_KEY_ID,
    amount: Math.round(parseFloat(amount) * 100),
    currency: 'INR',
    name,
    description,
    order_id,
    theme: { color: '#8B1A1A' },
  };

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Payment — The Feast Factory</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #FFF8F0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 32px 24px;
      text-align: center;
      max-width: 380px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    }
    .logo { font-size: 40px; margin-bottom: 12px; }
    h2 { font-size: 20px; color: #2C1810; margin-bottom: 8px; }
    .amount { font-size: 32px; font-weight: 900; color: #8B1A1A; margin: 16px 0; }
    .sub { font-size: 14px; color: #8B6F5E; margin-bottom: 24px; }
    .btn {
      background: #8B1A1A;
      color: white;
      border: none;
      border-radius: 14px;
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      width: 100%;
    }
    .btn:disabled { background: #ccc; cursor: not-allowed; }
    .success { color: #4CAF50; }
    .error { color: #E53935; }
    .status { font-size: 16px; margin-top: 16px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card" id="card">
    <div class="logo">🍽️</div>
    <h2>The Feast Factory</h2>
    <div class="amount">₹${parseFloat(amount).toLocaleString('en-IN')}</div>
    <div class="sub">${description}</div>
    <button class="btn" id="payBtn" onclick="openRazorpay()">Pay Securely</button>
    <p class="status" id="status"></p>
  </div>

  <script>
    var options = ${JSON.stringify(options)};

    options.handler = async function(response) {
      document.getElementById('payBtn').disabled = true;
      document.getElementById('status').textContent = 'Verifying payment...';

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        const data = await res.json();

        if (data.success) {
          document.getElementById('card').innerHTML =
            '<div class="logo">✅</div>' +
            '<h2 class="success">Payment Successful!</h2>' +
            '<p class="sub" style="margin-top:12px">Your order has been confirmed.<br>You can close this window.</p>' +
            '<p style="font-size:12px;color:#ccc;margin-top:16px">Payment ID: ' + response.razorpay_payment_id + '</p>';
        } else {
          document.getElementById('status').innerHTML = '<span class="error">Verification failed. Please contact support.</span>';
          document.getElementById('payBtn').disabled = false;
        }
      } catch(e) {
        document.getElementById('status').innerHTML = '<span class="error">Network error. Please try again.</span>';
        document.getElementById('payBtn').disabled = false;
      }
    };

    options.modal = {
      ondismiss: function() {
        document.getElementById('status').textContent = 'Payment cancelled.';
        document.getElementById('payBtn').disabled = false;
      }
    };

    function openRazorpay() {
      document.getElementById('payBtn').disabled = true;
      document.getElementById('status').textContent = 'Opening payment...';
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(response) {
        document.getElementById('status').innerHTML =
          '<span class="error">Payment failed: ' + response.error.description + '</span>';
        document.getElementById('payBtn').disabled = false;
      });
      rzp.open();
    }

    // Auto-open on load
    window.onload = function() { openRazorpay(); };
  </script>
</body>
</html>`;

  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🍽️  Feast Factory Backend running on port ${PORT}`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Payment: http://localhost:${PORT}/payment?order_id=TEST&amount=500`);
  console.log('\n   Find your local IP with: ipconfig (Windows)\n');
});
