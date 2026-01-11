const Campaign = require('../models/Campaign');
const Task = require('../models/Task');

const createCampaign = async (req, res) => {
  try {
    const { title, description, category, payoutPerTask, maxTasks, deadline, requirements } = req.body;

    if (!title || !description || !payoutPerTask || !maxTasks) {
      return res.status(400).json({
        success: false,
        msg: 'All fields are required',
      });
    }

    const campaign = await Campaign.create({
      title,
      description,
      category,
      payoutPerTask,
      maxTasks,
      deadline,
      requirements,
      createdBy: req.user.id,
      totalBudget: payoutPerTask * maxTasks,
      status: 'active',
        advertiser: req.user.id,
    });

    res.status(201).json({
      success: true,
      msg: 'Campaign created successfully',
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ advertiser: req.user.id });
    console.log(campaigns);

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getPublicCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' }).populate('advertiser', 'name rating');

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('advertiser', 'name email rating');
console.log(campaign.advertiser);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        msg: 'Campaign not found',
      });
    }

    const tasksCount = await Task.countDocuments({ campaignId: req.params.id });

    res.json({
      success: true,
      campaign,
      tasksCompleted: tasksCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
 console.log('Received status:', status); // Yeh dekho kya aa raha hai
    console.log('Campaign ID:', req.params.id);
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        msg: 'Campaign not found',
      });
    }

    if (campaign.advertiser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: 'Unauthorized',
      });
    }
      // Direct update karo - yeh zyada reliable hai
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { 
        new: true,           // Updated document return karega
        runValidators: true  // Schema validation run karega
      }
    );
        console.log('Updated status:', updatedCampaign.status); // Verify karo

    // campaign.status = status;
    // await campaign.save();

    res.json({
      success: true,
      msg: 'Campaign status updated',
       campaign: updatedCampaign,
    });
  } catch (error) {
     console.error('Update error:', error); // Full error dekho
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    

    if (!campaign) {
      return res.status(404).json({
        success: false,
        msg: 'Campaign not found',
      });
    }

    if (campaign.advertiser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: 'Unauthorized',
      });
    }

    await Campaign.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      msg: 'Campaign deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};

module.exports = {
  createCampaign,
  getMyCampaigns,
  getPublicCampaigns,
  getCampaignById,
  updateCampaignStatus,
  deleteCampaign,
};