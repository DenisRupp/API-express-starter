const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const { omit } = require('lodash');

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
      unique: { msg: 'Email already exists' },
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Email is not valid' },
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: DataTypes.JSONB,
    is_active: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
  });

  /** Models Hooks */
  User.beforeCreate(async (user) => {
    try {
      if (user._changed.password) {
        // eslint-disable-next-line no-param-reassign
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

  /** Object methods */
  const objectMethods = {
    /**
     * Prepare object to serialization
     * @returns {Object}
     */
    serialize() {
      return omit(
        this.get({ plain: true }),
        ['password', 'refresh_token'],
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
  };

  User.prototype = Object.assign(User.prototype, objectMethods);
  return User;
};
