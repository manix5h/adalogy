const mongoose =  require('mongoose');  

const withdrawalSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [500, 'Minimum withdrawal is 500'],
  },
  payoutMethod: {
    type: String,
    enum: ['upi', 'bank'],
    required: true,
  },
  upiId: String,
  bankAccount: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  transactionId: String,
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
