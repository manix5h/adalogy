const express = require('express');
const { requestWithdrawal, getWithdrawalHistory } = require('../controllers/withdrawalController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/request', auth, roleCheck('worker'), requestWithdrawal);
router.get('/history', auth, roleCheck('worker'), getWithdrawalHistory);

module.exports = router;
