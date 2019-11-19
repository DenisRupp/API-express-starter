const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../../../index');
const UserFactory = require('../factories/user.factory');
const getAuthorizedUser = require('../helpers/user.auth');
const truncate = require('../helpers/truncate');

describe('Users route', () => {
  let adminToken;

  before(async function before() {
    await truncate();
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(UserFactory().save());
    }

    await Promise.all(promises);
    const adminAuth = await getAuthorizedUser('admin');
    if (adminAuth) {
      adminToken = adminAuth.authToken;
    }
  });

  describe('Users list', () => {
    it('should show users list for admin', async () => {
      const res = await request(app)
        .get('/v1/users?page=2&qty=3')
        .set('Authorization', `Bearer ${adminToken}`)
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
        .set('Authorization', `Bearer ${userAuth.auth}`)
        .send({});
      expect(res.status).to.eq(httpStatus.UNAUTHORIZED);
    });
  });

  describe('Show user by id', () => {
    it('should show certain user info for admin', async () => {
      const user = await UserFactory().save();
      const res = await request(app)
        .get(`/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.id).to.eq(user.id);
    });

    it('should show error for simple user', async () => {
      const user = await UserFactory().save();
      const userAuth = await getAuthorizedUser();
      const res = await request(app)
        .get(`/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${userAuth.authToken}`)
        .send({});
      console.error(res.body);
      expect(res.status).to.eq(httpStatus.FORBIDDEN);
    });
  });

  describe('Create new user', () => {
    it('admin should have ability to add new user', async () => {
      const userData = UserFactory().dataValues;
      const res = await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);
      expect(res.status).to.eq(httpStatus.CREATED);
      expect(res.body.email).to.eq(userData.email);
      expect(res.body.first_name).to.eq(userData.first_name);
      expect(res.body.last_name).to.eq(userData.last_name);
    });
  });

  describe('Update certain user', () => {
    it('admin should have ability to edit user', async () => {
      const user = await UserFactory().save();
      const newUserData = UserFactory().dataValues;
      const res = await request(app)
        .patch(`/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUserData);
      expect(res.status).to.eq(httpStatus.OK);
      expect(res.body.email).to.eq(newUserData.email);
      expect(res.body.first_name).to.eq(newUserData.first_name);
      expect(res.body.last_name).to.eq(newUserData.last_name);
      expect(res.body.id).to.eq(user.id);
    });
  });

  describe('Delete user user', () => {
    it('admin should have ability delete user', async () => {
      const user = await UserFactory().save();
      const res = await request(app)
        .delete(`/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send();
      expect(res.status).to.eq(httpStatus.NO_CONTENT);
    });
  });
});
