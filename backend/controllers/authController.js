const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
require('dotenv').config();

// ✅ Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',  // या अपना email service
  auth: {
    user: process.env.EMAIL_USER,      // environment variable
    pass: process.env.EMAIL_PASSWORD,  // environment variable
  },
});

// ✅ Email भेजने का function438453de82ce691e3409659efd6d5b18f7a01e53398129318f11877b65405961


const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
  
 
   const mailOptions = {
    from: `"Logo Promo" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Verify Your Logo Promo Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #007bff;">Welcome to Logo Promo! 🎉</h2>
        <p>Hi,</p>
        <p>Your account has been created! Click the button below to verify your email:</p>
        
        <!-- ✅ ONE CLICK BUTTON -->
        <a href="${verificationUrl}" 
           style="background: linear-gradient(45deg, #007bff, #0056b3); color: white; padding: 15px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
          Verify Email Address
        </a>
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          <strong>Or copy this link:</strong><br>
          <code style="word-break: break-all; background: #f8f9fa; padding: 5px 10px; border-radius: 5px;">${token}</code>
        </p>
        
        <p>This link expires in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
          © 2026 Logo Promo Platform
        </p>
      </div>
    `,
  };
  
  return transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
    try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    // Hash password BEFORE creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

       // ✅ Verification token generate करो
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'advertiser',
        isEmailVerified: false,              // ✅ Initially false
      emailVerificationToken: verificationToken,
      emailVerificationExpire,
    });

    await user.save();

    const token = generateToken(user);
        // ✅ Verification email भेजो
    try {
      await sendVerificationEmail(email, verificationToken);
      console.log('✅ Verification email sent');
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

  res.status(201).json({
      success: true,
      msg: 'Registration successful! Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};


// ✅ Email verify करने का route
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, msg: 'Token required' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() },  // Token expire नहीं हुआ
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid or expired verification token' 
      });
    }

    // ✅ Email verify करो
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({
      success: true,
      msg: '✅ Email verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Error: ' + error.message });
  }
};


// ✅ Token resend करने के लिए
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: 'Email required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, msg: 'Email already verified' });
    }

    // ✅ नया token generate करो
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // ✅ Email भेजो
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('❌ Email error:', emailError);
    }

    res.json({
      success: true,
      msg: 'Verification email resent! Check your inbox.',
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Error: ' + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};


 const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Email and password are required',
      });
    }
    console.log(req.body);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid email or password',
      });
    }
    console.log(user);
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid email or password',
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        msg: 'Account has been banned: ' + user.banReason,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        totalEarned: user.totalEarned,
        rating: user.rating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Login error: ' + error.message,
    });
  }
};

 const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error: ' + error.message,
    });
  }
};
module.exports = {
  register,
  login,
  getProfile,
    verifyEmail,
  resendVerificationEmail,
};