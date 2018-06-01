// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');

app.listen(port, () => console.info(`Server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
