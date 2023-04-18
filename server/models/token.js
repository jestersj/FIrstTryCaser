'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
    refreshToken: {type: DataTypes.STRING, allowNull: false}
  }, {schema: 'public'})
  Token.associate = function(models) {
    Token.belongsTo(models.user);
  };
  return Token;
};