const express = require('express');
const { createCampaign, getMyCampaigns,
   getPublicCampaigns, getCampaignById, 
   updateCampaignStatus, deleteCampaign } = require('../controllers/campaignController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', auth, roleCheck('advertiser'), createCampaign);
router.get('/my-campaigns', auth, roleCheck('advertiser'), getMyCampaigns);
router.get('/public', getPublicCampaigns);
router.get('/:id', getCampaignById);
router.patch('/:id/status', auth, roleCheck('advertiser'), updateCampaignStatus);
router.delete('/:id', auth, roleCheck('advertiser'), deleteCampaign);

module.exports = router;
