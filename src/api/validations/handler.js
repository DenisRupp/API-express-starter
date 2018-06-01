/* eslint-disable no-prototype-builtins,no-restricted-syntax */
const { validationResult } = require('express-validator/check');
const httpStatus = require('http-status');

module.exports = rules => [
  rules,
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors = errors.mapped();
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errors[key] = errors[key].msg;
        }
      }
      return res.status(httpStatus.BAD_REQUEST).json({ errors });
    }
    return next();
  },
];
