module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    email: {
      unique: true,
      allowNull: false,
      type: Sequelize.STRING,
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    refreshToken: {
      unique: true,
      allowNull: true,
      type: Sequelize.JSONB,
    },
    resetToken: {
      unique: true,
      allowNull: true,
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
    services: {
      type: Sequelize.JSONB,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
