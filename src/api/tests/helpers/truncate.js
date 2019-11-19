const models = require('../../models');

const excludeModels = ['sequelize', 'Sequelize'];

module.exports = async () => {
  models.sequelize.authenticate().catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  const modelsForTruncate = Object.keys(models).filter(
    model => !excludeModels.includes(model),
  );

  for (const Model of modelsForTruncate) {
    await models[Model].destroy({ where: {}, force: true });
  }
};
