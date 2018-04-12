const operatorsAliases = require('./operatorsAliases');

module.exports = {
  development: {
    username: 'postgres',
    password: '877890',
    database: 'node-boilerplate',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
  test: {
    username: 'postgres',
    password: '877890',
    database: 'node-boilerplate_test',
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
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
};
