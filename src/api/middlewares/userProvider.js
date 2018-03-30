const httpStatus = require('http-status');
const FB = require('fb');
const { User } = require('../models');

/**
 * Get user from database by email and password
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getLocalUser = async (req, res, next) => {
  const authError = { message: 'Invalid email or password', status: httpStatus.BAD_REQUEST };
  const { email, password } = req.body;

  try {
    if (!req.body.email || !req.body.password) throw authError;
    const user = await User.findOne({ where: { email } });
    if (!user) throw authError;

    // Make sure the password is correct
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) { throw authError; }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Get user from facebook by fb access token
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getFacebookUser = async (req, res, next) => {
  const authFacebookError = { message: 'Can\'t find user by facebook token', status: httpStatus.BAD_REQUEST };
  const emailNotFound = { message: 'Sorry, but your facebook account haven\'t email', status: httpStatus.BAD_REQUEST };
  const { facebookToken } = req.body;

  try {
    if (!facebookToken) throw authFacebookError;

    const fb = new FB.Facebook({
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_SECRET,
      version: 'v2.4',
    });

    fb.setAccessToken(facebookToken);
    const facebookUser = await fb.api(
      'me',
      { fields: ['id', 'email', 'first_name', 'last_name', 'picture.width(320)'] },
    );

    if (facebookUser.error) throw facebookUser.error;
    if (!facebookUser.email) throw emailNotFound;
    if (!facebookUser.picture.data.is_silhouette) {
      facebookUser.picture = facebookUser.picture.data.url;
    }

    facebookUser.facebook_id = facebookUser.id;
    delete facebookUser.id;
    req.facebookUser = facebookUser;

    const user = await User.findOne({ where: { facebook_id: facebookUser.facebook_id } });
    if (user) { req.user = user; }
    next();
  } catch (error) {
    next(error);
  }
};
