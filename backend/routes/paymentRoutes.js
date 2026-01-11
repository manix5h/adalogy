const express = require('express');
const { createOrder, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const router = express.Router();

router.post('/create-order', auth, roleCheck('advertiser'), createOrder);
router.post('/verify', auth, verifyPayment);
router.get('/history', auth, getPaymentHistory);

module.exports = router;
