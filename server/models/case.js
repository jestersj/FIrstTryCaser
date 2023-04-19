'use strict';
module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('case', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING(7000)},
    logo: {type: DataTypes.STRING},
    presentation: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: 'on_moderation'}
  }, {schema: 'public'})
  Case.associate = function(models) {
    Case.belongsTo(models.user, {foreignKey: 'userId'});
  };
  return Case;
};