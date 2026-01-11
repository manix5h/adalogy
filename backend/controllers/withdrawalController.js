const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

const requestWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const user = await User.findById(req.user.id);

    if (amount > user.balance) {
      return res.status(400).json({
        success: false,
        msg: 'Insufficient balance',
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        msg: 'Minimum withdrawal amount is ₹100',
      });
    }

    const withdrawal = await Withdrawal.create({
      userId: req.user.id,
      amount,
      paymentMethod,
      status: 'pending',
    });

    user.balance -= amount;
    await user.save();

    res.status(201).json({
      success: true,
      msg: 'Withdrawal request submitted',
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

module.exports = {
  requestWithdrawal,
  getWithdrawalHistory,
};
