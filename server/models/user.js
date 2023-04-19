'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationToken: {type: DataTypes.STRING}
  }, {schema: 'public'})
  User.associate = function(models) {
    User.hasOne(models.token);
    User.hasMany(models.case)
  };
  return User;
};