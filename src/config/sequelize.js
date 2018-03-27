/* eslint-disable prefer-destructuring */
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const { db: config } = require('./vars');

const db = {};
const modelsPath = path.join(__dirname, '/../api/models/');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

config.logging = process.env.NODE_ENV === 'development';
// Common operatorsAliases is deprecated
config.operatorsAliases = require('../database/operatorsAliases');

fs.readdirSync(modelsPath)
  .filter(file => (file.indexOf('.') !== 0) && (file.slice(-8) === 'model.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(modelsPath, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
