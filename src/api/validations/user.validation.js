const { query, body, param } = require('express-validator/check');

module.exports = {

  // GET /v1/users
  listUsers: [
    query('page', 'Page is required').exists().toInt(),
    query('qty', 'Qty is required').exists().toInt(),
  ],

  // POST /v1/users
  createUser: [
    body('email', 'Invalid email').isEmail().normalizeEmail(),
    body('password', 'Passwords must be at least 8 chars long').isLength({ min: 8 }),
  ],

  // PATCH /v1/users/:userId
  updateUser: [
    body('email', 'Invalid email').isEmail().normalizeEmail(),
    body('password', 'Passwords must be at least 8 chars long').isLength({ min: 8 }),
    param('userId', 'User id is required').exists(),
  ],
};
