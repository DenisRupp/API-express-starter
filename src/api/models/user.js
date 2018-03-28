module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
    refresh_token_expires: DataTypes.DATE,
    is_active: {
      default: false,
      type: DataTypes.BOOLEAN,
    },
  }, {});
  User.associate = models => {
    // associations can be defined here
  };
  return User;
};
