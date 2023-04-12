const sequelize = require('./db')
const {DataTypes, UUIDV4} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationToken: {type: DataTypes.UUID, defaultValue: UUIDV4}
})

const Case = sequelize.define('case', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING(7000)},
    logo: {type: DataTypes.STRING, allowNull: false},
    presentation: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: 'on_moderation'}
})

const Solution = sequelize.define('solution', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    annotation: {type: DataTypes.STRING(7000)},
    presentation: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: 'unsolved'}
})

const Appeal = sequelize.define('appeal', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    typeOfUser: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING},
    tg: {type: DataTypes.STRING},
    communication: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING(7000)}
})

User.hasMany(Case)
Case.belongsTo(User)

User.hasMany(Solution)
Case.hasMany(Solution)
Solution.belongsTo(User)
Solution.belongsTo(Case)

module.exports = {
    User,
    Case,
    Solution,
    Appeal
}