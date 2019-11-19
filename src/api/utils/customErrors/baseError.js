const { BAD_REQUEST } = require('http-status');

class ApiError extends Error {
  /**
   * Creates an API error.
   */
  constructor({
    message,
    status = BAD_REQUEST,
    errors,
    stack,
    name,
    isPublic = false,
  }) {
    super(message);
    this.name = name || this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    this.stack = stack;
  }
}

module.exports = { ApiError };
