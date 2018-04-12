const operatorsAliases = require('./operatorsAliases');

module.exports = {
  development: {
    username: 'postgres',
    password: 'password',
    database: 'boilerplate',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
  test: {
    username: 'postgres',
    password: '',
    database: 'boilerplate_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
  production: {
    username: 'postgres',
    password: 'password',
    database: 'boilerplate_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
};
