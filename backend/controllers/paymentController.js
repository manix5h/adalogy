const Payment = require('../models/Payment');
const User = require('../models/User');
const Razorpay = require('razorpay');

const id = process.env.RAZORPAY_KEY_ID || 'rzp_test_abcd1234567890';
  const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_abcd1234567890';
const razorpay = new Razorpay({
  
  key_id: id,
  key_secret: secret,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        msg: 'Minimum amount is ₹100',
      });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid signature',
      });
    }

    const payment = await Payment.create({
      userId: req.user.id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: req.body.amount,
      status: 'completed',
    });

    const user = await User.findById(req.user.id);
    user.totalSpent += req.body.amount;
    user.balance += req.body.amount;
    await user.save();

    res.json({
      success: true,
      msg: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
};
