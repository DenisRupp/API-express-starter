/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
const UserFactory = require('../factories/user.factory');
const { User } = require('../../models');
const authProviders = require('../../services/userProvider');

const sandbox = sinon.createSandbox();

const fakeOAuthRequest = () => Promise.resolve({
  service: 'facebook',
  id: '123',
  name: 'user',
  email: 'test@test.com',
  picture: 'test.jpg',
});

describe('Authentication', () => {
  let refreshToken;

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
        email, password, first_name, last_name,
      } = UserFactory();
      const req = {
        email, password, first_name, last_name,
      };
      const res = await request(app)
        .post('/v1/auth/register')
        .send(req);
      delete req.password;
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.tokens).to.have.a.property('refresh');
      expect(res.body.tokens).to.have.a.property('auth');
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
      expect(res.body.errors).to.have.a.property('first_name');
      expect(res.body.errors).to.have.a.property('last_name');
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
      expect(res.body.tokens).to.have.a.property('refresh');
      expect(res.body.tokens).to.have.a.property('auth');
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
});
