const request = require('supertest');
const httpStatus = require('http-status');
const sandbox = require('sinon');
const { expect } = require('chai');
const app = require('../../../index');
const getAuthorizedUser = require('../helpers/user.auth');
const truncate = require('../helpers/truncate');

describe('Profile routes', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(() => sandbox.restore());

  describe('Show user profile', () => {
    it('should show current user info', async () => {
      const userAuth = await getAuthorizedUser();
      const res = await request(app)
        .get('/v1/profile')
        .set('Authorization', `Bearer ${userAuth.authToken}`)
        .send({});
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.id).to.eq(userAuth.user.id);
    });
  });
});
