const passport = require('passport');
const httpStatus = require('http-status');
const { ApiError } = require('../utils/customErrors/baseError');

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

module.exports = (role = 'guest') => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) {
      return next(new ApiError(invalidToken));
    }
    if (role !== 'guest') {
      if (!user.isActive) {
        return next(new ApiError(userBlocked));
      }
      if (!hasPermissions(user.role, role)) {
        return next(new ApiError(noPermissions));
      }
    }

    return req.login(user, { session: false }, err => next(err));
  })(req, res, next);
};
