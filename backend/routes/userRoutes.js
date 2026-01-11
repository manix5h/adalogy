const express = require('express');
const { getProfile, updateProfile, updatePaymentDetails, getUserStats, getPublicProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.patch('/payment-details', auth, updatePaymentDetails);
router.get('/stats', auth, getUserStats);
router.get('/public/:userId', getPublicProfile);

module.exports = router;
