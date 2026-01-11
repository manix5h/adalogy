const express = require('express');
const { getDashboard, getAllUsers, banUser, unbanUser } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.get('/dashboard', auth, roleCheck('admin'), getDashboard);
router.get('/users', auth, roleCheck('admin'), getAllUsers);
router.patch('/users/:id/ban', auth, roleCheck('admin'), banUser);
router.patch('/users/:id/unban', auth, roleCheck('admin'), unbanUser);
module.exports = router;