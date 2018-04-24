module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    first_name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    last_name: {
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
    refresh_token: {
      unique: true,
      allowNull: true,
      type: Sequelize.JSONB,
    },
    reset_token: {
      unique: true,
      allowNull: true,
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    services: {
      type: Sequelize.JSONB,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
