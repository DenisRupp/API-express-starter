const { body } = require('express-validator');
const emailNormalizeRules = require('../utils/emailNormalizeRules');

module.exports = {
  // POST /v1/auth/login
  login: [
    body('email', 'Email is invalid')
      .exists({ checkFalsy: true })
      .isEmail()
      .normalizeEmail(emailNormalizeRules),
    body('password', 'Password is required').exists({ checkFalsy: true }),
  ],
  // POST /v1/auth/reset-password
  email: [
    body('email', 'Email is invalid')
      .exists()
      .isEmail(),
  ],
  changePassword: [
    body('id', 'User id is required').exists({ checkFalsy: true }),
    body('resetToken', 'Reset is required').exists({ checkFalsy: true }),
    body('password', 'Password is required').exists({ checkFalsy: true }),
  ],
  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: [
    body('access_token', 'Access token is required').exists({
      checkFalsy: true,
    }),
  ],

  // POST /v1/auth/refresh
  refresh: [
    body('refreshToken', 'Refresh token is required').exists({
      checkFalsy: true,
    }),
  ],
};
