/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');

/**
 * Change sequelize validation errors
 */
const formValidation = (err, req, res, next) => {
  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    const errors = {};

    for (const error of err.errors) {
      errors[error.path] = error.message;
    }

    return res.status(400).json({ name: err.name, errors });
  }
  return next(err);
};

/**
 * Catch invalid token error
 */
const invalidToken = (err, req, res, next) => {
  if (err.name !== 'UnauthorizedError') return next(err);
  const message =
    err.message === 'jwt expired' ? 'Token has been expired' : 'Invalid token';
  return res.status(httpStatus.UNAUTHORIZED).json({ message });
};

/**
 * Catch not found elements
 */
const wrongUrlParam = (err, req, res, next) => {
  if (err.name !== 'CastError') return next(err);
  return res
    .status(404)
    .json({ message: `Can't find element with ${err.path} ${err.value}` });
};

/**
 * Unexpected errors handler
 */
const other = (err, req, res, next) => {
  if (!err.isOperational) {
    next(err);
    return;
  }

  const response = {
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  };

  if (process.env.NODE_ENV !== 'development') delete response.stack;
  res.status(response.status).json(response);
};

module.exports = [formValidation, invalidToken, wrongUrlParam, other];
