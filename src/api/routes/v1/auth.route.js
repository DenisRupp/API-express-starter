const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/auth.controller');
const rules = require('../../validations/auth.validation');

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
 * @apiParam  {String}                 first_name User's first name
 * @apiParam  {String}                 last_name  User's last name
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
router.route('/login')
  .post(validate(rules.login), controller.login);


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
router.route('/refresh-token')
  .post(validate(rules.refresh), controller.refresh);


/**
 * TODO: POST /v1/auth/reset-password
 */


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
router.route('/facebook')
  .post(validate(rules.oAuth), controller.oAuth);


module.exports = router;
