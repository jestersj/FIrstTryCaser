const jwt = require('jsonwebtoken')
const Token = require('../models/index').token
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, '' + process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, '' + process.env.JWT_REFRESH_SECRET, {expiresIn: '14d'})
        return {accessToken, refreshToken}
    }
    validateAccessToken(token)  {
        try {
            return jwt.verify(token, '' + process.env.JWT_ACCESS_SECRET)
        } catch (e) {
            return null
        }
    }
    validateRefreshToken(token)  {
        try {
            return jwt.verify(token, '' + process.env.JWT_REFRESH_SECRET)
        } catch (e) {
            return null
        }
    }
    async findToken(refreshToken) {
        return await Token.findOne({where: {refreshToken}})
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({where: {userId}})
        if (tokenData) {
            return await tokenData.update({refreshToken})
        }
        return await Token.create({userId, refreshToken})
    }
    async removeToken(refreshToken) {
        const token = await Token.findOne({where: {refreshToken}})
        await token.destroy()
        return token
    }
}

module.exports = new TokenService()