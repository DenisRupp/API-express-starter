const UserFactory = require('../factories/user.factory');
const { generateAuthToken, generateRefreshToken } = require('../../../api/services/tokenGenerator');


module.exports = async (role = 'user') => {
  const user = UserFactory({ role });
  user.refresh_token = generateRefreshToken(user);

  await user.save();

  return {
    user,
    authToken: generateAuthToken(user),
  };
};
