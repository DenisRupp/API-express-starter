const BearerStrategy = require('passport-http-bearer');
const strategies = require('../api/services/strategies');
const { User } = require('../api/models');

const oAuth = service => async (token, done) => {
  try {
    const userData = await strategies[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
