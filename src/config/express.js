const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs } = require('./vars');
const errorHandler = require('../api/middlewares/errorHandler');
const httpStatus = require('http-status');
const strategies = require('./passport');
const passport = require('passport');

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);
passport.use('local', strategies.local);
passport.use('jwt', strategies.jwt);

// mount api v1 routes
app.use('/v1', routes);

// mount errors handlers
app.use(errorHandler);

//  handle 404 page
app.use((req, res) => res.status(httpStatus.NOT_FOUND).send('Not found'));

module.exports = app;
