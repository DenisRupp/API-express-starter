const httpStatus = require('http-status');
const { ApiError } = require('./baseError');

exports.INVALID_CREDENTIALS = new ApiError({
  message: 'Invalid email or password',
  status: httpStatus.UNAUTHORIZED,
  name: 'INVALID_CREDENTIALS',
});

exports.INVALID_SOCIAL = name =>
  new ApiError({
    message: `Invalid ${name} access token`,
    status: httpStatus.UNAUTHORIZED,
    name: 'INVALID_SOCIAL',
  });

exports.INVALID_TOKEN = new ApiError({
  message: 'Invalid token',
  status: httpStatus.UNAUTHORIZED,
  name: 'INVALID_TOKEN',
});

exports.BLOCKED_USER = new ApiError({
  message: 'User is blocked',
  status: httpStatus.UNAUTHORIZED,
  name: 'BLOCKED_USER',
});

exports.ACCESS_DENIED = new ApiError({
  message: 'Access denied',
  status: httpStatus.FORBIDDEN,
  name: 'ACCESS_DENIED',
});

exports.USER_NOT_FOUND = new ApiError({
  message: "Can't find user with this email",
  status: 400,
  name: 'USER_NOT_FOUND',
});

exports.RESET_TOKEN_INVALID = new ApiError({
  message: 'Reset password token is invalid',
  status: 400,
  name: 'RESET_TOKEN_INVALID',
});

exports.REFRESH_TOKEN_INVALID = new ApiError({
  status: httpStatus.UNAUTHORIZED,
  message: 'Refresh token is invalid',
  name: 'REFRESH_TOKEN_INVALID',
});
