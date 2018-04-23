/* eslint-disable camelcase */
const axios = require('axios');

exports.facebook = async (access_token) => {
  const fields = 'id, name, email, picture';
  const url = 'https://graph.facebook.com/me';
  const params = { access_token, fields };
  const response = await axios.get(url, { params });
  const {
    id, email, first_name, last_name,
  } = response.data;
  return {
    service: 'facebook',
    id,
    first_name,
    last_name,
    email,
  };
};

exports.google = async (access_token) => {
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const params = { access_token };
  const response = await axios.get(url, { params });
  const {
    sub, email, given_name: first_name, family_name: last_name,
  } = response.data;
  return {
    service: 'google',
    id: sub,
    first_name,
    last_name,
    email,
  };
};
