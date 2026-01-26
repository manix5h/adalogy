const express = require('express');
const { raiseDispute, getMyDisputes, resolveDispute } = require('../controllers/disputeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/raise', auth, raiseDispute);
router.get('/my-disputes', auth, getMyDisputes);
router.patch('/:id/resolve', auth, roleCheck('admin'), resolveDispute);

module.exports = router;