# Express REST API Starter with postgres

[![Build Status](https://travis-ci.org/DenisRupp/API-express-starter.svg?branch=master)](https://travis-ci.org/DenisRupp/API-express-starter)
[![Coverage Status](https://coveralls.io/repos/github/DenisRupp/express-ES2017/badge.svg?branch=master)](https://coveralls.io/github/DenisRupp/express-ES2017?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/DenisRupp/API-express-starter.svg)](https://greenkeeper.io/)

Boilerplate/Generator/Starter Project for building RESTful APIs and microservices using Node.js, Express and Sequelize

## Features

- No transpilers, just vanilla javascript
- ES2017 latest features like Async/Await
- CORS enabled
- Uses [yarn](https://yarnpkg.com)
- Express + Postgres ([Sequelize](http://docs.sequelizejs.com/))
- Request validation ([express validator](https://github.com/ctavan/express-validator)
- Consistent coding styles with [editorconfig](http://editorconfig.org)
- Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Linting with [eslint](http://eslint.org)
- Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
- Code coverage with [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io)
- Git hooks with [husky](https://github.com/typicode/husky)
- Logging with [morgan](https://github.com/expressjs/morgan)
- Authentication and Authorization with [passport](http://passportjs.org)
- API documentation generation with [apidoc](http://apidocjs.com)
- Continuous integration support with [travisCI](https://travis-ci.org)
- Monitoring with [pm2](https://github.com/Unitech/pm2)

## Requirements

- [Node v8.10](https://nodejs.org/en/download/current/)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [PM2](http://pm2.keymetrics.io/)

## Getting Started

Clone the repo and make it yours:

```bash
git clone --depth 1 https://github.com/DenisRupp/express-starter
cd express-starter
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

Set database configuration:

```bash
cp src/database/config.example.js src/database/config.js
```
Crete database

```bash
sequelize db:create --env development
```

## Running Locally

```bash
yarn local
```

## Running in Production

```bash
yarn start
```

## Database commands

```bash
# run all migrations
yarn migrate

# run all seeds
yarn seeds

# generate new migration
sequelize migration:generate --name new-migration

# generate new seed
sequelize seed:generate --name new-seeds
```

More commands [here](https://github.com/sequelize/cli).

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

## Logs

```bash
# show logs in production
pm2 logs
```

## Deploy

```bash
# deploy to dev
pm2 deploy dev
```

## Documentation

```bash
# generate and open api documentation
yarn docs
```

Inspired by [danielfsousa](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
