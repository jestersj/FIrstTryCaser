const {User} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ApiError = require('../errors/ApiError')
const EmailService = require('../services/EmailService')
const TokenService = require('../services/TokenService')
const UserDto = require('../dtos/UserDto')

function createJwt(id, email, role, isActive) {
    return jwt.sign(
        {id, email, role, isActive},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}
class UserController {
    async registration(req, res, next) {
        try {
            const {email, password, role} = req.body
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректый email или пароль'))
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, role, password: hashPassword})
            // try {
            //     await EmailService.sendActivationMail(user.email, user.activationToken)
            // } catch (e) {
            //     console.log(e)
            //     await user.destroy()
            //     return res.json({e})
            // }

            // await EmailService.sendActivationMail(user.email, user.activationToken)
            const userDto = new UserDto(user)
            const tokens = TokenService.generateTokens({...userDto})
            await TokenService.saveToken(user.id, tokens.refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({...tokens, user: userDto})
        } catch (e) {
            next(e)
        }
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
        const token = createJwt(user.id, user.email, user.role, user.isActive)
        return res.json({token})
    }

    async check(req, res) {
        const token = createJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
    async activateAccount(req, res) {
        const {token} = req.params
        const user = await User.findOne({where: {activationToken: token}})
        if (!user) {
            return res.status(400).json({message: 'Токен активации не валиден'})
        }
        await user.update({isActive: true})
    }
}

module.exports = new UserController()