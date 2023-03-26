const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
    email: {type: DataTypes.STRING, unicode: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING}
})

const Case = sequelize.define('case', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    logo: {type: DataTypes.STRING, allowNull: false},
    presentation: {type: DataTypes.STRING}
})

Case.belongsTo(User)

module.exports = {
    User,
    Case
}