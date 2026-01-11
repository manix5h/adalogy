const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, phone },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      msg: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const updatePaymentDetails = async (req, res) => {
  try {
    const { bankAccount, upiId, phonepe } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bankAccount, upiId, phonepe },
      { new: true }
    );

    res.json({
      success: true,
      msg: 'Payment details updated',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    const stats = {
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      totalEarned: user.totalEarned,
      totalSpent: user.totalSpent,
      rating: user.rating,
      tasksCompleted: user.tasksCompleted,
      campaignsCreated: user.campaignsCreated,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -email -phone -bankAccount');

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePaymentDetails,
  getUserStats,
  getPublicProfile,
};
  