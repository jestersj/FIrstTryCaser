const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING}
})

const Case = sequelize.define('case', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    logo: {type: DataTypes.STRING, allowNull: false},
    presentation: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: 'on_moderation'}
})
const StartedCases = sequelize.define('started_cases', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    status: {type: DataTypes.STRING, defaultValue: 'started'}
})

User.hasMany(Case, {foreignKey: 'author'})
// Case.belongsTo(User)

Case.belongsToMany(User, {through: StartedCases})
User.belongsToMany(Case, {through: StartedCases})

module.exports = {
    User,
    Case,
    StartedCases
}