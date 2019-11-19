// set default environment
process.env.NODE_ENV = 'test';

const Sequelize = require('sequelize');
const Umzug = require('umzug');
const path = require('path');
const { sequelize } = require('../../models');

/**
 * Global mocha hooks
 */
before(async () => {
  await runMigration();
  console.log('--> Run migrations');
});

after(async () => {
  await sequelize.drop({ force: true });
  console.log('--> Drop database');
});

const runMigration = () => {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: { sequelize },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: path.join(__dirname, '../../../database/migrations'),
    },
  });

  return umzug.up();
};
