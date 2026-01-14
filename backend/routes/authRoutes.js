const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.post('/verify-email', authController.verifyEmail);        // ✅ यह नया है
router.post('/resend-verification', authController.resendVerificationEmail);  // ✅ यह नया है

module.exports = router;
