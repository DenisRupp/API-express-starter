const moment = require('moment-timezone');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.refreshToken = (user, remember) => {
  const token = `${user._id}.${crypto.randomBytes(40).toString('hex')}`;
  const days = (remember) ? process.env.REFRESH_TOKEN_LIFE_LONG : process.env.REFRESH_TOKEN_LIFE;
  const expires = moment().add(days, 'days').toDate();
  return { token, expires, remember };
};

exports.authToken = user => jwt.sign(
  { id: user._id },
  process.env.SECRET_STRING,
  { expiresIn: process.env.AUTH_TOKEN_LIFE },
);
