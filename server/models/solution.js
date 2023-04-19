'use strict';
module.exports = (sequelize, DataTypes) => {
  const Solution = sequelize.define('solution', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING(7000)},
    logo: {type: DataTypes.STRING, allowNull: false},
    presentation: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: 'on_moderation'}
  }, {schema: 'public'})
  Solution.associate = function(models) {
    Solution.belongsTo(models.user, {foreignKey: 'userId'});
    Solution.belongsTo(models.case, {foreignKey: 'caseId'});
  };
  return Solution;
};