const moment = require('moment-timezone');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
  generateRefreshToken: (user) => {
    const token = `${user._id}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(process.env.REFRESH_TOKEN_LIFE, 'days').toDate();
    return { token, expires };
  },
  generateAuthToken: user => jwt.sign(
    { id: user._id },
    process.env.SECRET_STRING,
    { expiresIn: process.env.AUTH_TOKEN_LIFE },
  ),
};
