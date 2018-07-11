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
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
};

const localAuth = async (email, password, cb) => {
  try {
    const user = await strategies.local();
    return cb(null, user);
  } catch (e) {
    return cb(e);
  }
};

const jwtAuth = async (jwtPayload, cb) => {
  try {
    const user = await strategies.jwt(jwtPayload.id);
    return cb(null, user);
  } catch (e) {
    return cb(e);
  }
};

exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
exports.jwt = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_STRING,
  },
  jwtAuth,
);
exports.local = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  localAuth,
);
