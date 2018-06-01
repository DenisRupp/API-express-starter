const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/auth.controller');
const rules = require('../../validations/auth.validation');
const passport = require('passport');

const router = express.Router();

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}                 email      User's email
 * @apiParam  {String{6..22}}          password   User's password
 * @apiParam  {String}                 firstName User's first name
 * @apiParam  {String}                 lastName  User's last name
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.post('/register', controller.register);

/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String}  password  User's password
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/login').post(validate(rules.login), controller.login);

/**
 * @api {post} v1/auth/logout Logout
 * @apiDescription Delete user's refresh token
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}   refreshToken     User's refresh token
 *
 * @apiSuccess (Success 204)
 */
router.route('/logout').post(controller.logout);

/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token required when user logged in
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router
  .route('/refresh-token')
  .post(validate(rules.refresh), controller.refresh);

router
  .route('/reset-password')
  /**
   * @api {post} v1/auth/reset-password Reset password
   * @apiDescription Send reset password email
   * @apiVersion 1.0.0
   * @apiName ResetPassword
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}  email         User's email
   *
   * @apiSuccess (Success 200) {String}  message    Success message
   *
   * @apiError (Bad Request 400)  ValidationError   Can't find user with this email
   */
  .post(validate(rules.email), controller.reset)
  /**
   * @api {put} v1/auth/reset-password Reset password
   * @apiDescription Set new password after reset
   * @apiVersion 1.0.0
   * @apiName ResetPassword
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}  id          User's id
   * @apiParam  {String}  resetToken Reset token
   * @apiParam  {String}  password    New user password
   *
   * @apiSuccess (Success 200) {String}  message    Success message
   *
   * @apiError (Bad Request 400)  ValidationError   Can't find user with this email
   */
  .put(validate(rules.changePassword), controller.changePassword);

/**
 * @api {post} v1/auth/facebook Facebook Login
 * @apiDescription Login with facebook. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName FacebookLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Facebook's access_token
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router
  .route('/facebook')
  .post(
    validate(rules.oAuth),
    passport.authenticate('facebook', { session: false }),
    controller.oAuth
  );

/**
 * @api {post} v1/auth/google Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router
  .route('/google')
  .post(
    validate(rules.oAuth),
    passport.authenticate('google', { session: false }),
    controller.oAuth
  );

module.exports = router;
