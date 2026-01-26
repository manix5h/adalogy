const mongoose =  require('mongoose');

const taskSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['assigned', 'submitted', 'approved', 'rejected'],
    default: 'assigned',
  },
  payout: {
    type: Number,
    // required: true,
  },
  proofUrl: String,
  proofDescription: String,
  submittedAt: Date,
  reviewerNotes: String,
  approvedAt: Date,
  rejectionReason: String,
  workerRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  advertiserRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);