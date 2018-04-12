const faker = require('faker');
const { User } = require('../../models');

module.exports = () => new User({
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  password: faker.phone.phoneNumber(),
  email: faker.internet.email().toLowerCase(),
});
