const db = require('../../models');
/**
 * Global mocha hooks
 */
before(async () => {
  await db.sequelize.sync({ force: true });
  console.log('--> Drop database');
});
