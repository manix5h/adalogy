const Task = require('../models/Task');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

const joinTask = async (req, res) => {
  try {
    const { campaignId } = req.body;
    console.log(campaignId);

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        msg: 'Campaign ID is required',
      });
    }
console.log(campaignId);
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        msg: 'Campaign not found',
      });
    }

    const existingTask = await Task.findOne({ campaignId, workerId: req.user.id });
    if (existingTask) {
      return res.status(400).json({
        success: false,
        msg: 'Already joined this campaign',
      });
    }

    const tasksCount = await Task.countDocuments({ campaignId });
    if (tasksCount >= campaign.maxTasks) {
      return res.status(400).json({
        success: false,
        msg: 'Campaign is full',
      });
    }

    const task = await Task.create({
      campaignId,
      workerId: req.user.id,
      status: 'assigned',
      payout: campaign.payoutPerTask
    });

    res.status(201).json({
      success: true,
      msg: 'Task joined successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ workerId: req.user.id })
      .populate('campaignId', 'title payoutPerTask category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const submitProof = async (req, res) => {
  try {
    const { proofUrl, proofDescription } = req.body;

    if (!proofUrl) {
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

    task.proofUrl = proofUrl;
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

// ✅ NEW FUNCTION - Creator के लिए Campaign Tasks
const getCampaignTasks = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    console.log('🔍 Creator fetching tasks for campaign:');

    // 1. Check if campaign belongs to creator
    const campaign = await Campaign.findOne({
      _id: campaignId,
      advertiser: req.user.id  // Only creator can see tasks
    });

    if (!campaign) {
      return res.status(403).json({
        success: false,
        msg: 'Campaign not found or access denied'
      });
    }

    // 2. Get all tasks for this campaign
    const tasks = await Task.find({ campaignId })
      .populate('workerId', 'name email profileImage')  // Worker details
      .populate('campaignId', 'title payoutPerTask')     // Campaign details
      .sort({ createdAt: -1 })                           // Latest first
      .lean();

    // 3. Add stats
    const stats = {
      total: tasks.length,
      assigned: tasks.filter(t => t.status === 'assigned').length,
      submitted: tasks.filter(t => t.status === 'submitted').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      rejected: tasks.filter(t => t.status === 'rejected').length
    };

    console.log(`✅ Found ${tasks.length} tasks. Stats:`, stats);

    res.json({
      success: true,
      tasks,
      stats,
      campaign: {
        _id: campaign._id,
        title: campaign.title,
        payoutPerTask: campaign.payoutPerTask,
        maxTasks: campaign.maxTasks
      }
    });

  } catch (error) {
    console.error('❌ getCampaignTasks error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch campaign tasks'
    });
  }
};


const approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('campaignId workerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: 'Task not found',
      });
    }

    if (task.campaignId.advertiser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: 'Unauthorized',
      });
    }

    task.status = 'approved';
    await task.save();

    const worker = await User.findById(task.workerId);
    worker.balance += task.campaignId.payoutPerTask;
    worker.totalEarned += task.campaignId.payoutPerTask;
    await worker.save();

    res.json({
      success: true,
      msg: 'Task approved and payment processed',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const rejectTask = async (req, res) => {
  try {
    const { reason } = req.body;

    const task = await Task.findById(req.params.id).populate('campaignId');

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: 'Task not found',
      });
    }

    if (task.campaignId.advertiser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: 'Unauthorized',
      });
    }

    task.status = 'rejected';
    task.rejectionReason = reason;
    await task.save();

    res.json({
      success: true,
      msg: 'Task rejected',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

module.exports = {
  joinTask,
  getMyTasks,
  submitProof,
  getCampaignTasks,
  approveTask,
  rejectTask,
};