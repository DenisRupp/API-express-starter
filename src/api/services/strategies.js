const axios = require('axios');
const { User } = require('../models');
const authErrors = require('../utils/customErrors/authErrors');

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
    console.error(e);
    throw authErrors.INVALID_SOCIAL('facebook');
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
    throw authErrors.INVALID_SOCIAL('google');
  }
};

exports.local = async (email, password) => {
  if (email && password) {
    const user = await User.findOne({ where: { email } });
    if (user && (await user.verifyPassword(password))) {
      return user;
    }
  }

  throw authErrors.INVALID_CREDENTIALS;
};
