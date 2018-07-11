const BearerStrategy = require('passport-http-bearer');
const strategies = require('../api/services/strategies');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const { User } = require('../api/models');

const LocalStrategy = passportLocal.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const oAuth = service => async (token, cb) => {
  try {
    const userData = await strategies[service](token);
    const user = await User.oAuthLogin(userData);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
};

/**
 * Provide user by auth token, user can be empty
 */
exports.jwt = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_STRING,
  },
  async (jwtPayload, cb) => {
    try {
      const user = await User.findById(jwtPayload.id);
      cb(null, user);
    } catch (e) {
      cb(e);
    }
  },
);

/**
 * Provide user by email and password, user can't be empty
 */
exports.local = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, cb) => {
    try {
      const user = await strategies.local(email, password);
      cb(null, user);
    } catch (e) {
      cb(e);
    }
  },
);

exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
