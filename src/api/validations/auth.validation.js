const { body } = require('express-validator/check');

module.exports = {
  // POST /v1/auth/login
  login: [
    body('email', 'Email is invalid').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists(),
  ],

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: [
    body('access_token', 'Access token is required').exists(),
  ],

  // POST /v1/auth/refresh
  refresh: [
    body('refresh_token', 'Refresh token is required').exists(),
  ],
};
