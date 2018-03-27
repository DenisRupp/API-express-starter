const path = require('path');

// import .env variables
require('dotenv-safe').load({
  allowEmptyValues: true,
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  db: {
    database: process.env.NODE_ENV === 'test'
      ? process.env.DB_DATABASE_TEST
      : process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
