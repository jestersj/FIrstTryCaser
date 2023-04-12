const jwt = require('jsonwebtoken')
const {Token} = require('../models')
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, '' + process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, '' + process.env.JWT_REFRESH_SECRET, {expiresIn: '14d'})
        return {accessToken, refreshToken}
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({where: {userId}})
        if (tokenData) {
            return await tokenData.update({refreshToken})
        }
        const token = await Token.create({userId, refreshToken})
        return token
    }
}

module.exports = new TokenService()