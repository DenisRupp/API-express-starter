'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'services', Sequelize.JSONB, {
      after: 'password',
    });
  },

  down: queryInterface => queryInterface.removeColumn('Users', 'services'),
};
