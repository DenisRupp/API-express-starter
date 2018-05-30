const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/user.controller');
const auth = require('../../middlewares/authorize');
const rules = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router.route('/')
  /**
   * @api {get} v1/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [qty=1]  Users per page
   *
   * @apiSuccess {PaginationObject[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(auth('admin'), validate(rules.listUsers), controller.list)
  /**
   * @api {post} v1/users Create User
   * @apiDescription Create a new user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             email        User's email
   * @apiParam  {String{6..128}}     password     User's password
   * @apiParam  {String{..128}}      firstName   User's first name
   * @apiParam  {String{..128}}      lastName    User's last name
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  firstName User's first name
   * @apiSuccess (Created 201) {String}  lastName  User's last name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(auth('admin'), validate(rules.createUser), controller.create);


router.route('/profile')
  /**
   * @api {get} v1/users/profile User Profile
   * @apiDescription Get logged in user profile information
   * @apiVersion 1.0.0
   * @apiName UserProfile
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  firstName  User's first name
   * @apiSuccess {String}  lastName   User's last name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
  .get(auth('user'), controller.loggedIn);


router.route('/:userId')
  /**
   * @api {get} v1/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  firstName  User's first name
   * @apiSuccess {String}  lastName   User's last name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(auth('admin'), controller.get)
  /**
   * @api {patch} v1/users/:id Update User
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiParam  {String}             email        User's email
   * @apiParam  {String{6..128}}     password     User's password
   * @apiParam  {String{..128}}      firstName   User's first name
   * @apiParam  {String{..128}}      lastName    User's last name
   * @apiParam  {String=user,admin}  [role]       User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  firstName User's first name
   * @apiSuccess {String}  lastName  User's last name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(auth('admin'), validate(rules.updateUser), controller.update)
  /**
   * @api {patch} v1/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(auth('admin'), controller.remove);


module.exports = router;
