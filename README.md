# Express ES2017 REST API Boilerplate
[![Build Status](https://travis-ci.org/DenisRupp/express-ES2017.svg?branch=master)](https://travis-ci.org/DenisRupp/express-ES2017)
[![Coverage Status](https://coveralls.io/repos/github/DenisRupp/express-ES2017/badge.svg?branch=master)](https://coveralls.io/github/DenisRupp/express-ES2017?branch=master)

Boilerplate/Generator/Starter Project for building RESTful APIs and microservices using Node.js, Express and MongoDB

## Features

 - No transpilers, just vanilla javascript
 - ES2017 latest features like Async/Await
 - CORS enabled
 - Uses [yarn](https://yarnpkg.com)
 - Express + MongoDB ([Mongoose](http://mongoosejs.com/))
 - Request validation ([express validator](https://github.com/ctavan/express-validator)
 - Consistent coding styles with [editorconfig](http://editorconfig.org)
 - Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
 - Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
 - Request validation with [joi](https://github.com/hapijs/joi)
 - Gzip compression with [compression](https://github.com/expressjs/compression)
 - Linting with [eslint](http://eslint.org)
 - Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
 - Code coverage with [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io)
 - Git hooks with [husky](https://github.com/typicode/husky) 
 - Logging with [morgan](https://github.com/expressjs/morgan)
 - Authentication and Authorization with [passport](http://passportjs.org)
 - API documentation geratorion with [apidoc](http://apidocjs.com)
 - Continuous integration support with [travisCI](https://travis-ci.org)
 - Monitoring with [pm2](https://github.com/Unitech/pm2)

## Requirements

 - [Node v8.10+](https://nodejs.org/en/download/current/)
 - [Yarn](https://yarnpkg.com/en/docs/install)
 - [PM2](http://pm2.keymetrics.io/)

## Getting Started

Clone the repo and make it yours:

```bash
git clone --depth 1 https://github.com/DenisRupp/express-ES2017
cd express-ES2017
rm -rf .git
```

Install dependencies:

```bash
yarn
```

Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn start
```

## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Mocha
yarn test

# run unit tests
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch

# open nyc test coverage reports
yarn coverage
```

## Validate

```bash
# run lint and tests
yarn validate
```

## Logs

```bash
# show logs in production
pm2 logs
```

## Documentation

```bash
# generate and open api documentation
yarn docs
```

Inspired by [danielfsousa](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
