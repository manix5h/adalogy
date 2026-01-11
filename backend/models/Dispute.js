const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  raisedAgainst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    enum: ['poor_quality', 'incomplete', 'proof_invalid', 'other'],
    required: true,
  },
  description: String,
  attachments: [String],
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved'],
    default: 'open',
  },
  decision: {
    type: String,
    enum: ['approved', 'rejected', 'partial_payout', 'full_refund'],
  },
  decisionAmount: Number,
  decisionReason: String,
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
