const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor({
    message, errors, status, isPublic, stack,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    this.stack = stack;
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class ApiError extends ExtendableError {
  /**
   * Creates an API error.
   */
  constructor({
    message,
    status = httpStatus.BAD_REQUEST,
    errors,
    stack,
    isPublic = false,
  }) {
    super({ message, errors, status, isPublic, stack });
  }
}

module.exports = { ApiError };
