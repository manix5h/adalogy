const express = require('express');
const { joinTask, getMyTasks, submitProof,getCampaignTasks, approveTask, rejectTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/join', auth, joinTask);
router.get('/my-tasks', auth, getMyTasks);
router.patch('/:id/proof', auth, submitProof);
router.get('/campaign/:campaignId', auth, getCampaignTasks); 
router.patch('/:id/approve', auth, approveTask);
router.patch('/:id/reject', auth, rejectTask);

module.exports = router;
