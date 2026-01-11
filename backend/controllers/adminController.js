const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Task = require('../models/Task');
const Payment = require('../models/Payment');

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isBanned: false });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalCampaigns = await Campaign.countDocuments();
    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      bannedUsers,
      totalCampaigns,
      totalPayments: totalPayments[0]?.total || 0,
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { banReason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true, banReason },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.json({
      success: true,
      msg: 'User banned successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false, banReason: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.json({
      success: true,
      msg: 'User unbanned successfully',
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
  getDashboard,
  getAllUsers,
  banUser,
  unbanUser,
};
const submitProof = async (req, res) => {
  try {
    const { proofLink, proofDescription } = req.body;

    if (!proofLink) {
      return res.status(400).json({
        success: false,
        msg: 'Proof link is required',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: 'Task not found',
      });
    }

    if (task.workerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: 'Unauthorized',
      });
    }

    task.proofLink = proofLink;
    task.proofDescription = proofDescription;
    task.status = 'submitted';
    await task.save();

    res.json({
      success: true,
      msg: 'Proof submitted successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};