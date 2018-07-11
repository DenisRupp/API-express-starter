const axios = require('axios');
const httpStatus = require('http-status');
const { User } = require('../models');
const { ApiError } = require('../utils/customErrors');

class StrategiesError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthStrategiesError';
    this.status = httpStatus.UNAUTHORIZED;
  }
}

const authError = new ApiError({
  message: 'Invalid email or password',
  status: httpStatus.BAD_REQUEST,
});

exports.facebook = async accessToken => {
  try {
    const fields = 'id, name, email, picture';
    const url = 'https://graph.facebook.com/me';
    const params = { access_token: accessToken, fields };
    const response = await axios.get(url, { params });
    const {
      id,
      email,
      first_name: firstName,
      last_name: lastName,
    } = response.data;
    return {
      service: 'facebook',
      id,
      firstName,
      lastName,
      email,
    };
  } catch (e) {
    throw new StrategiesError('Invalid facebook access token');
  }
};

exports.google = async accessToken => {
  try {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const params = { access_token: accessToken };
    const response = await axios.get(url, { params });
    const {
      sub,
      email,
      given_name: firstName,
      family_name: lastName,
    } = response.data;
    return {
      service: 'google',
      id: sub,
      firstName,
      lastName,
      email,
    };
  } catch (e) {
    throw new StrategiesError('Invalid google access token');
  }
};

exports.local = async (email, password) => {
  if (!email || !password) throw authError;
  const user = await User.findOne({ where: { email } });
  if (!user) throw authError;

  // Make sure the password is correct
  const isMatch = await user.verifyPassword(password);
  if (!isMatch) throw authError;
  return user;
};
