const Dispute = require('../models/Dispute');
const Task = require('../models/Task');

const raiseDispute = async (req, res) => {
  try {
    const { taskId, reason, description } = req.body;

    if (!taskId || !reason) {
      return res.status(400).json({
        success: false,
        msg: 'Task ID and reason are required',
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        msg: 'Task not found',
      });
    }

    const dispute = await Dispute.create({
      taskId,
      raisedBy: req.user.id,
      reason,
      description,
      status: 'open',
    });

    res.status(201).json({
      success: true,
      msg: 'Dispute raised successfully',
      dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getMyDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user.id })
      .populate('taskId', 'campaignId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      disputes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const resolveDispute = async (req, res) => {
  try {
    const { resolution, winner } = req.body;

    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        msg: 'Dispute not found',
      });
    }

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.winner = winner;
    dispute.resolvedAt = Date.now();
    await dispute.save();

    res.json({
      success: true,
      msg: 'Dispute resolved',
      dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

module.exports = {
  raiseDispute,
  getMyDisputes,
  resolveDispute,
};
