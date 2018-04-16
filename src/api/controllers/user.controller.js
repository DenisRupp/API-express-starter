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
  } catch (error) {
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
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = [async (req, res, next) => {
  try {
    const { page, qty } = req.query;
    req.pagination = await User.paginate(page, qty);
    next();
  } catch (error) {
    next(error);
  }
}, paginate];

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.destroy()
    .then(() => res.status(httpStatus.NO_CONTENT).json({ result: 'delete' }))
    .catch(e => next(e));
};
