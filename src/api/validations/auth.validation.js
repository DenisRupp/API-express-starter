const { body } = require('express-validator/check');

module.exports = {
  // POST /v1/auth/login
  login: [
    body('email', 'Invalid email').isEmail().normalizeEmail(),
    body('password', 'Passwords must be at least 8 chars long').isLength({ min: 8 }),
  ],

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: [
    body('access_token', 'Access token is required').exists(),
  ],

  // POST /v1/auth/refresh
  refresh: [
    body('refreshToken', 'Refresh token is required').exists(),
  ],
};
