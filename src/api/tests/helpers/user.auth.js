const UserFactory = require('../factories/user.factory');
const { generateAuthToken } = require('../../../api/services/tokenGenerator');


module.exports = async (role = 'user') => {
  const user = UserFactory({ role });
  await user.save();

  return { user, authToken: generateAuthToken(user) };
};
