module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users', 'role',
    {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  ),

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'role');
  },
};
