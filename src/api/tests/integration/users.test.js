const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../../../index');
const UserFactory = require('../factories/user.factory');
const getAuthorizedUser = require('../helpers/user.auth');

describe('Users route', () => {
  let adminTokens;

  beforeEach(async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(UserFactory().save());
    }

    await Promise.all(promises);
    const adminAuth = await getAuthorizedUser('admin');
    if (adminAuth) { adminTokens = adminAuth.tokens; }
  });

  describe('Users list', () => {
    it('should show users list for admin', async () => {
      const res = await request(app)
        .get('/v1/users?page=2&qty=3')
        .set('Authorization', `Bearer ${adminTokens.auth}`)
        .send({});
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body).to.have.a.property('docs');
      expect(res.body).to.have.a.property('total');
      expect(res.body).to.have.a.property('page');
      expect(res.body).to.have.a.property('pages');
      expect(res.body).to.have.a.property('limit');
      expect(res.body.docs.length).to.eq(3);
      expect(res.body.page).to.eq(2);
    });

    it('should not show users list for no admin', async () => {
      const userAuth = await getAuthorizedUser();
      const res = await request(app)
        .get('/v1/users?page=2&qty=3')
        .set('Authorization', `Bearer ${userAuth.tokens.auth}`)
        .send({});
      expect(res.status).to.eq(httpStatus.UNAUTHORIZED);
    });
  });
});
