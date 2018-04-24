/* eslint-disable no-param-reassign */
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const { omit } = require('lodash');
const mailer = require('../services/mailer');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'First Name is required' },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'Last Name is required' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      unique: { msg: 'Email already exists' },
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Email is not valid' },
      },
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: '',
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: {
          args: [6],
          msg: 'Password should be more then 6 chars',
        },
      },
    },
    services: {
      type: DataTypes.JSONB,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    refresh_token: DataTypes.JSONB,
    reset_token: {
      type: DataTypes.STRING,
      unique: true,
    },
    is_active: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
  });

  /** Models Hooks */
  User.beforeSave(async (user) => {
    try {
      if (user._changed.email) {
        user.email = user.email.toLowerCase();
      }
      if (user._changed.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      return user;
    } catch (error) {
      return sequelize.Promise.reject(error);
    }
  });

  /** Static methods */

  /**
   * Find user by refresh token
   * @param token
   * @returns {Promise<*>}
   */
  User.getByRefreshToken = async function (token) {
    const user = await this.findOne({ where: { 'refresh_token.token': token } });
    return (user && moment().isBefore(moment(user.refresh_token.expires))) ? user : false;
  };

  /**
   * Return count of all users and rows with offset
   * @param page
   * @param limit
   * @returns {Promise<*>}
   */
  User.paginate = async function (page = 1, limit = 10) {
    const offset = limit * (page - 1);
    const result = await this.findAndCountAll({ limit, offset });
    result.rows.map(user => user.transform());
    return result;
  };

  User.oAuthLogin = async function ({
    service, id, email, first_name, last_name,
  }) {
    const user = await this.findOne({ where: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.first_name) user.first_name = first_name;
      if (!user.last_name) user.last_name = last_name;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, first_name, last_name,
    });
  };

  /** Object methods */
  const objectMethods = {
    /**
     * Prepare object to serialization
     * @returns {Object}
     */
    transform() {
      return omit(
        this.get({ plain: true }),
        ['password', 'refresh_token', 'reset_token'],
      );
    },

    /**
     * Compare hashed passwords
     * @param password
     * @returns {Promise}
     */
    async verifyPassword(password) {
      return bcrypt.compare(password, this.password);
    },

    /**
     * Create reset password token and send email
     * @returns {Promise}
     */
    async resetPassword() {
      this.reset_token = uuidv4();
      const user = await this.save();
      return mailer(user.email, 'Reset password email', 'reset-password', { user });
    },
  };

  User.prototype = Object.assign(User.prototype, objectMethods);
  return User;
};
