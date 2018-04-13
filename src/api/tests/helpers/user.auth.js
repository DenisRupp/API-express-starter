const UserFactory = require('../factories/user.factory');
const request = require('supertest');
const app = require('../../../index');


module.exports = async (role = 'user') => {
  const user = UserFactory({ role });
  const { password, email } = user;
  await user.save();

  const res = await request(app)
    .post('/v1/auth/login')
    .send({ password, email });

  return res.body;
};
