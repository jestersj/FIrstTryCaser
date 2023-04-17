const {User} = require("../models");
const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/UserDto");
const TokenService = require("./TokenService");

class UserService {
    async registration(email, password, role) {
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            throw ApiError.badRequest(`Пользователь с email "${email}" уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const userDto = new UserDto(user)
        // await EmailService.sendActivationMail(user.email, user.activationToken)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
    async login(email, password) {
        const user = await User.findOne({where: {email}})
        if (!user) {
            throw ApiError.unauthorized('Пользователь не найден')
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            throw ApiError.unauthorized('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
    async logout(refreshToken) {
        return await TokenService.removeToken(refreshToken)
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorized('Пользователь не авторизован')
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.unauthorized('Пользователь не авторизован')
        }
        const user = await User.findOne({where: {id: userData.id}})
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }
    async activate(token) {
        const user = await User.findOne({where: {activationToken: token}})
        if (!user) {
            throw ApiError.notFound('Токен активации не существует')
        }
        await user.update({isActive: true})
        const userDto = new UserDto(user)
        return {user: userDto}
    }
}

module.exports = new UserService()