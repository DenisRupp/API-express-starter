const operatorsAliases = require('./operatorsAliases');

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_DATABASE}_test`,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_DATABASE}_prod`,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    operatorsAliases,
    define: {
      underscored: true,
    },
  },
};
