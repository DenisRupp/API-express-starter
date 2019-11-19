const faker = require('faker');
const { User } = require('../../models');

module.exports = params => {
  const properties = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.phone.phoneNumber(),
    email: faker.internet.email().toLowerCase(),
    ...params,
  };

  return new User(properties);
};
