const httpStatus = require('http-status');
const { User } = require('../models/index');

/**
 * Get user from database by email and password
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getLocalUser = async (req, res, next) => {
  const authError = { message: 'Invalid email or password', status: httpStatus.BAD_REQUEST };
  const { email, password } = req.body;

  try {
    if (!req.body.email || !req.body.password) throw authError;
    const user = await User.findOne({ where: { email } });
    if (!user) throw authError;

    // Make sure the password is correct
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) { throw authError; }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
