/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
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

describe('Authentication API', () => {
  let dbUser;
  let user;
  let refreshToken;

  beforeEach(async () => {
    dbUser = {
      email: 'branstark@gmail.com',
      password: 'mypassword',
      name: 'Bran Stark',
      role: 'admin',
    };

    user = {
      email: 'some.mail@gmail.com',
      password: '12345678',
      first_name: 'BoB',
      last_name: 'Dilan',
    };

    await User.sync({ force: true });
    await User.destroy({
      where: {},
      truncate: true,
    });
    await new User(dbUser);
  });

  afterEach(() => sandbox.restore());

  describe('POST /v1/auth/register', () => {
    it('should register a new user when request is ok', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(user);
      delete user.password;
      expect(res.status).to.eq(200);
      expect(res.body.tokens).to.have.a.property('refresh');
      expect(res.body.tokens).to.have.a.property('auth');
      expect(res.body.user).to.include(user);
    });

    /*it('should report error when email already exists', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(dbUser)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" already exists');
        });
    });

    it('should report error when the email provided is not valid', () => {
      user.email = 'this_is_not_an_email';
      return request(app)
        .post('/v1/auth/register')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" must be a valid email');
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(app)
        .post('/v1/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" is required');
        });
    });*/
  });
/*
  describe('POST /v1/auth/login', () => {
    it('should return an accessToken and a refreshToken when email and password matches', () => {
      return request(app)
        .post('/v1/auth/login')
        .send(dbUser)
        .expect(httpStatus.OK)
        .then((res) => {
          delete dbUser.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(dbUser);
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(app)
        .post('/v1/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" is required');
        });
    });

    it('should report error when the email provided is not valid', () => {
      user.email = 'this_is_not_an_email';
      return request(app)
        .post('/v1/auth/login')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('email');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"email" must be a valid email');
        });
    });

    it('should report error when email and password don\'t match', () => {
      dbUser.password = 'xxx';
      return request(app)
        .post('/v1/auth/login')
        .send(dbUser)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          const { code } = res.body;
          const { message } = res.body;
          expect(code).to.be.equal(401);
          expect(message).to.be.equal('Incorrect email or password');
        });
    });
  });

  describe('POST /v1/auth/facebook', () => {
    it('should create a new user and return an accessToken when user does not exist', () => {
      sandbox.stub(authProviders, 'facebook').callsFake(fakeOAuthRequest);
      return request(app)
        .post('/v1/auth/facebook')
        .send({ access_token: '123' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.be.an('object');
        });
    });

    it('should return an accessToken when user already exists', async () => {
      dbUser.email = 'test@test.com';
      await User.create(dbUser);
      sandbox.stub(authProviders, 'facebook').callsFake(fakeOAuthRequest);
      return request(app)
        .post('/v1/auth/facebook')
        .send({ access_token: '123' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.be.an('object');
        });
    });

    it('should return error when access_token is not provided', async () => {
      return request(app)
        .post('/v1/auth/facebook')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('access_token');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"access_token" is required');
        });
    });
  });

  describe('POST /v1/auth/google', () => {
    it('should create a new user and return an accessToken when user does not exist', () => {
      sandbox.stub(authProviders, 'google').callsFake(fakeOAuthRequest);
      return request(app)
        .post('/v1/auth/google')
        .send({ access_token: '123' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.be.an('object');
        });
    });

    it('should return an accessToken when user already exists', async () => {
      dbUser.email = 'test@test.com';
      await User.create(dbUser);
      sandbox.stub(authProviders, 'google').callsFake(fakeOAuthRequest);
      return request(app)
        .post('/v1/auth/google')
        .send({ access_token: '123' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.be.an('object');
        });
    });

    it('should return error when access_token is not provided', async () => {
      return request(app)
        .post('/v1/auth/google')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const { field } = res.body.errors[0];
          const { location } = res.body.errors[0];
          const { messages } = res.body.errors[0];
          expect(field).to.be.equal('access_token');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"access_token" is required');
        });
    });
  });

  describe('POST /v1/auth/refresh-token', () => {
    it('should return a new accessToken when refreshToken and email match', async () => {
      await RefreshToken.create(refreshToken);
      return request(app)
        .post('/v1/auth/refresh-token')
        .send({ email: dbUser.email, refreshToken: refreshToken.token })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('accessToken');
          expect(res.body).to.have.a.property('refreshToken');
          expect(res.body).to.have.a.property('expiresIn');
        });
    });

    it('should report error when email and refreshToken don\'t match', async () => {
      await RefreshToken.create(refreshToken);
      return request(app)
        .post('/v1/auth/refresh-token')
        .send({ email: user.email, refreshToken: refreshToken.token })
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          const { code } = res.body;
          const { message } = res.body;
          expect(code).to.be.equal(401);
          expect(message).to.be.equal('Incorrect email or refreshToken');
        });
    });

    it('should report error when email and refreshToken are not provided', () => {
      return request(app)
        .post('/v1/auth/refresh-token')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field1 = res.body.errors[0].field;
          const location1 = res.body.errors[0].location;
          const messages1 = res.body.errors[0].messages;
          const field2 = res.body.errors[1].field;
          const location2 = res.body.errors[1].location;
          const messages2 = res.body.errors[1].messages;
          expect(field1).to.be.equal('email');
          expect(location1).to.be.equal('body');
          expect(messages1).to.include('"email" is required');
          expect(field2).to.be.equal('refreshToken');
          expect(location2).to.be.equal('body');
          expect(messages2).to.include('"refreshToken" is required');
        });
    });
  });*/
});
