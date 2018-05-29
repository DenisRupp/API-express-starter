/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
const UserFactory = require('../factories/user.factory');
const { User } = require('../../models');
const getAuthorizedUser = require('../helpers/user.auth');
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');

const sandbox = sinon.createSandbox();

describe('Authentication', () => {
  beforeEach(async () => {
    await User.destroy({
      where: {},
      truncate: true,
    });
  });

  afterEach(() => sandbox.restore());

  describe('Registration via email', () => {
    it('should register a new user when request is ok', async () => {
      const {
        email, password, firstName, lastName,
      } = UserFactory();
      const req = {
        email, password, firstName, lastName,
      };
      const res = await request(app)
        .post('/v1/auth/register')
        .send(req);
      delete req.password;
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.tokens).to.have.a.property('refreshToken');
      expect(res.body.tokens).to.have.a.property('accessToken');
      expect(res.body.user).to.include(req);
    });

    it('should show error when emails has already taken', async () => {
      const user = UserFactory().save();
      const res = await request(app)
        .post('/v1/auth/register')
        .send(user);
      expect(res.status).to.eq(httpStatus.BAD_REQUEST);
      expect(res.body.errors).to.have.a.property('email');
    });

    it('should show errors for required fields', async () => {
      const req = {};

      const res = await request(app)
        .post('/v1/auth/register')
        .send(req);
      expect(res.status).to.eq(httpStatus.BAD_REQUEST);
      expect(res.body.errors).to.have.a.property('email');
      expect(res.body.errors).to.have.a.property('firstName');
      expect(res.body.errors).to.have.a.property('lastName');
      expect(res.body.errors).to.have.a.property('password');
    });
  });

  describe('Login via email', async () => {
    it('should show success login', async () => {
      let user = UserFactory();
      const { email, password } = user;
      user = await user.save();
      const res = await request(app)
        .post('/v1/auth/login')
        .send({ email, password });
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.tokens).to.have.a.property('refreshToken');
      expect(res.body.tokens).to.have.a.property('accessToken');
      expect(res.body.user.email).to.equal(user.email);
    });

    it('should show error with empty email and password', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send({});
      expect(res.status).to.eq(httpStatus.BAD_REQUEST);
      expect(res.body.errors).to.have.a.property('email');
      expect(res.body.errors).to.have.a.property('password');
    });
  });

  describe('Refresh token route', async () => {
    it('should return tokens for valid refresh token', async () => {
      const userAuth = await getAuthorizedUser();
      const res = await request(app)
        .post('/v1/auth/refresh-token')
        .send({ refreshToken: userAuth.user.refreshToken.token });

      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.tokens).to.have.a.property('accessToken');
      expect(res.body.tokens).to.have.a.property('refreshToken');
      expect(res.body.user.email).to.be.eq(userAuth.user.email);
    });

    it('should return errors for invalid refresh token', async () => {
      await request(app)
        .post('/v1/auth/refresh-token')
        .send({ refreshToken: 'wrong token' })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('Reset password', () => {
    it('should send email with reset password token', async () => {
      const transport = {
        sendMail: () => Promise.resolve('Success'),
        use: () => this,
        close: () => Promise.resolve('Success'),
      };
      const sendMailSpy = sinon.spy(transport, 'sendMail');
      const user = await UserFactory().save();

      sandbox.stub(nodemailer, 'createTransport').returns(transport);

      const res = await request(app)
        .post('/v1/auth/reset-password')
        .send({ email: user.email });

      sinon.assert.callCount(sendMailSpy, 1);
      expect(res.body.message).to.eq('Email successfully send');
      sandbox.restore();
    });

    it('should show error on invalid email', async () => {
      const res = await request(app)
        .post('/v1/auth/reset-password')
        .send({ email: 'some@email.com' })
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).to.eq('Can\'t find user with this email');
    });

    it('should set new password and delete  after reset', async () => {
      const newUser = await UserFactory();
      newUser.resetToken = uuidv4();
      const user = await newUser.save();
      const { resetToken, id } = user;
      const res = await request(app)
        .put('/v1/auth/reset-password')
        .send({ resetToken, id, password: 'some_new_pass' })
        .expect(httpStatus.OK);

      expect(res.body.tokens).to.have.a.property('accessToken');
      expect(res.body.tokens).to.have.a.property('refreshToken');
      expect(res.body.user.id).to.equal(id);
    });

    it('should show error with invalid token', async () => {
      const newUser = await UserFactory();
      newUser.resetToken = uuidv4();
      const user = await newUser.save();
      const { id } = user;
      await request(app)
        .put('/v1/auth/reset-password')
        .send({ resetToken: 'some_token', id, password: 'some_new_pass' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
