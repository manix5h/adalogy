// const mongoose =  require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: 6,
//     select: false,
//   },
//   role: {
//     type: String,
//     enum: ['worker', 'advertiser', 'admin'],
//     default: 'worker',
//   },
//   profileImage: String,
//   bio: String,
//   phone: String,
//   totalTasksCompleted: {
//     type: Number,
//     default: 0,
//   },
//   totalEarned: {
//     type: Number,
//     default: 0,
//   },
//   balance: {
//     type: Number,
//     default: 0,
//   },
//   rating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5,
//   },
//   skills: [String],
//   businessName: String,
//   businessWebsite: String,
//   totalCampaignsCreated: {
//     type: Number,
//     default: 0,
//   },
//   totalSpent: {
//     type: Number,
//     default: 0,
//   },
//   isBanned: {
//     type: Boolean,
//     default: false,
//   },
//   banReason: String,
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   verificationToken: String,
//   bankAccount: {
//     accountHolder: String,
//     accountNumber: String,
//     ifscCode: String,
//     bankName: String,
//   },
//   upiId: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
 
//   try {
//     if (!this.isModified('password')) {
//       return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.comparePassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['worker', 'advertiser', 'admin'],
    default: 'worker',
  },
  profileImage: String,
  bio: String,
  phone: String,
  totalTasksCompleted: {
    type: Number,
    default: 0,
  },
  totalEarned: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  skills: [String],
  businessName: String,
  businessWebsite: String,
  totalCampaignsCreated: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  banReason: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  bankAccount: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },
  upiId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Compare password method only - NO pre-save hook
userSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
