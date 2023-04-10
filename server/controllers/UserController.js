const {User} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ApiError = require('../errors/ApiError')
const uuid = require('uuid')
const transporter = require('../email/transporter')

function createJwt(id, email, role) {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}
class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректый email или пароль'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const activationToken = uuid.v4()
        //Sending activation link
        // let letter = await transporter.sendMail({
        //     from: '"Casers" valuevmp2@gmail.com',
        //     to: 'valuevmp@yandex.ru',
        //     subject: 'Активация аккаунта Casers',
        //     text: `http://localhost:4000/api/user/activate?token=${activationToken}`
        // })
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword, activationToken})
        const token = createJwt(user.id, user.email, user.role)

        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.unauthorized('Пользователь не найден'))
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.unauthorized('Неверный пароль'))
        }
        const token = createJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res) {
        const token = createJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
    async activateAccount(req, res) {
        const {token} = req.query
        const user = await User.findOne({where: {activationToken: token}})
        if (!user) {
            return res.status(400).json({message: 'Токен активации не валиден'})
        }
        await user.update({isActive: true})
    }
}

module.exports = new UserController()