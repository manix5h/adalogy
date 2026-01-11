const User = require('../models/User');

const roleCheck = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          msg: 'User not found',
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          msg: `Access denied - Only ${allowedRoles.join(', ')} can access`,
        });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: 'Error: ' + error.message,
      });
    }
  };
};

module.exports = roleCheck;
