const mongoose =  require('mongoose');  

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['social_media', 'website_visit', 'app_download', 'video_view', 'review', 'feedback'],
    required: [true, 'Category is required'],
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payoutPerTask: {
    type: Number,
    required: [true, 'Payout per task is required'],
    min: [1, 'Minimum payout is 1'],
  },
  maxTasks: {
    type: Number,
    required: [true, 'Max tasks is required'],
    min: [1, 'Minimum tasks is 1'],
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  totalBudget: {
    type: Number,
    required: [true, 'Total budget is required'],
  },
  spentAmount: {
    type: Number,
    default: 0,
  },
    status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'active',
  },
  taskDeadline: Date,
  requirements: String,
  imageUrl: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
