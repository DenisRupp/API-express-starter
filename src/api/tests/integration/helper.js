const db = require('../../models');
/**
 * Global mocha hooks
 */
before(() => {
  console.log('--> Migrate database');
  console.log('--> Run seeds database');
});

after(() => {
  console.log('--> Delete database');
});
