const expressJwt = require('express-jwt');
const { User } = require('../models');
const httpStatus = require('http-status');
const { ApiError } = require('../utils/customErrors');

const roles = {
  admin: ['guest', 'user'],
  user: ['guest'],
  guest: [],
};

const invalidToken = {
  message: 'Invalid token',
  status: httpStatus.UNAUTHORIZED,
};
const userBlocked = {
  message: 'User is blocked',
  status: httpStatus.UNAUTHORIZED,
};
const noPermissions = {
  message: 'Access denied',
  status: httpStatus.FORBIDDEN,
};

function hasPermissions(userRole, allowedRole) {
  return (
    userRole in roles &&
    (userRole === allowedRole || roles[userRole].includes(allowedRole))
  );
}

module.exports = (role = 'guest') => [
  expressJwt({ secret: process.env.SECRET_STRING }),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (role !== 'guest') {
        if (!user) throw new ApiError(invalidToken);
        if (!user.isActive) throw new ApiError(userBlocked);
        if (!hasPermissions(user.role, role)) throw new ApiError(noPermissions);
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  },
];
