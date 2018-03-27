// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const models = require('./config/sequelize');

models.sequelize.sync().then(() => {

  // listen to requests
  app.listen(port, () => console.info(`Server started on port ${port} (${env})`));
});

/**
* Exports express
* @public
*/
module.exports = app;
