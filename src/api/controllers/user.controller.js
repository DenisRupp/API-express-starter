const httpStatus = require('http-status');
const { omit } = require('lodash');
const { User } = require('../models');
const paginate = require('../middlewares/paginationResponse');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    req.locals = { user };
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(httpStatus.CREATED).json(user.transform());
  } catch (e) {
    next(e);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  let user = Object.assign(req.locals.user, updatedUser);
  user = await user.save();
  try {
    res.json(user.transform());
  } catch (e) {
    next(e);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = [
  async (req, res, next) => {
    try {
      const { page, qty } = req.query;
      req.pagination = await User.paginate(page, qty);
      next();
    } catch (e) {
      next(e);
    }
  },
  paginate,
];

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  const { user } = req.locals;

  try {
    await user.destroy();
    res.status(httpStatus.NO_CONTENT).json({ result: 'delete' });
  } catch (e) {
    next(e);
  }
};
