const httpStatus = require('http-status');
const User = require('../models/user.model');
const userProvider = require('../middlewares/user-provider');
const { generateRefreshToken, generateAuthToken } = require('../services/tokenGenerator');

/**
 * Generate response with refresh and auth tokens
 * @private
 */
const authResponse = async (req, res, next) => {
  try {
    const auth = generateAuthToken(req.user);

    req.user.refresh_token = generateRefreshToken(req.user);
    const user = await req.user.save();

    res.json({
      tokens: {
        refresh: user.refresh_token.token,
        auth,
      },
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = [
  async (req, res, next) => {
    try {
      req.user = await new User(req.body).save();
      return next();
    } catch (error) {
      return next(error);
    }
  },
  authResponse,
];

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = [userProvider.getLocalUser, authResponse];

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {

};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = [
  async (req, res, next) => {
    try {
      const user = await User.getByRefreshToken(req.bosy.token);
      if (!user) return next({ status: httpStatus.UNAUTHORIZED, message: 'Refresh token is invalid' });
      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  }, authResponse,
];
