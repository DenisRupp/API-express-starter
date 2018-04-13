const faker = require('faker');
const { User } = require('../../models');

module.exports = (params) => {
  const properties = Object.assign({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.phone.phoneNumber(),
    email: faker.internet.email().toLowerCase(),
  }, params);

  return new User(properties);
};
