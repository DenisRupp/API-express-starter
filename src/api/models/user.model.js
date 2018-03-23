const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const uniqueValidator = require('mongoose-unique-validator');

const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
* User Roles
*/
const roles = ['user', 'admin'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  services: {
    facebook: String,
    google: String,
  },
  refresh_token: {
    type: mongoose.Schema.Types.Mixed,
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
  picture: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

//  transform object in json responses
userSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret.password;
    delete ret.refresh_token;
    delete ret.notification;
    return ret;
  },
};
userSchema.options.toJObject = userSchema.options.toJSON;


userSchema.plugin(uniqueValidator, { message: 'That {PATH} is taken, try again' });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    this.password = await bcrypt.hash(this.password, rounds);
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  },

  generateRefreshToken() {
    const user = this;
    const token = `${user._id}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    user.refresh_token = { token, expires };
    return user;
  },
});

/**
 * Statics
 */
userSchema.statics = {
  async getByRefreshToken(token) {
    const user = await this.find({ refresh_token: { $elemMatch: { token } } });
    if (user && moment().isBefore(moment(user.refresh_token.expires))) {
      return user;
    }
    return false;
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, name, email, role,
  }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async oAuthLogin({
    service, id, email, name, picture,
  }) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
