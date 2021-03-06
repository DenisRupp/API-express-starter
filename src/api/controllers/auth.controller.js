const httpStatus = require('http-status');
const passport = require('passport');
const { User } = require('../models');
const authErrors = require('../utils/customErrors/authErrors');
const {
  generateRefreshToken,
  generateAccessToken,
} = require('../services/tokenGenerator');

/**
 * Generate response with refresh and auth tokens
 * @private
 */
const authResponse = async (req, res, next) => {
  try {
    const accessToken = generateAccessToken(req.user);

    req.user.refreshToken = generateRefreshToken(req.user);
    const user = await req.user.save();

    res.json({
      tokens: {
        refreshToken: user.refreshToken.token,
        accessToken,
      },
      user: user.transform(),
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = [
  async (req, res, next) => {
    try {
      req.user = await User.create(req.body);
      return next();
    } catch (e) {
      return next(e);
    }
  },
  authResponse,
];

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = [
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: err ? err.message : 'Login failed',
          user,
        });
      }

      return req.login(user, { session: false }, error => next(error));
    })(req, res, next);
  },
  authResponse,
];

/**
 * Delete refresh token
 * @public
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await User.update(
      { refreshToken: null },
      { where: { 'refreshToken.token': refreshToken }, limit: 1 },
    );
  }

  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = authResponse;

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = [
  async (req, res, next) => {
    try {
      const user = await User.getByRefreshToken(req.body.refreshToken);
      if (!user) return next(authErrors.REFRESH_TOKEN_INVALID);
      req.user = user;
      return next();
    } catch (e) {
      return next(e);
    }
  },
  authResponse,
];

/**
 * Send reset password email
 * @public
 */
exports.reset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw authErrors.USER_NOT_FOUND;
    await user.resetPassword();
    res.json({ message: 'Email successfully send' });
  } catch (e) {
    next(e);
  }
};

/**
 * Change password after reset
 * @public
 */
exports.changePassword = [
  async (req, res, next) => {
    try {
      const { resetToken, id, password } = req.body;
      const user = await User.findOne({ where: { resetToken, id } });
      if (!user) throw authErrors.RESET_TOKEN_INVALID;
      req.user = await user.update({ password, resetToken: null });
      next();
    } catch (e) {
      next(e);
    }
  },
  authResponse,
];
