const Task = require('../models/Task');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

const joinTask = async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        msg: 'Campaign ID is required',
      });
    }

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

const approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('campaignId workerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: 'Task not found',
      });
    }

    if (task.campaignId.createdBy.toString() !== req.user.id) {
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

    if (task.campaignId.createdBy.toString() !== req.user.id) {
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
  approveTask,
  rejectTask,
};
