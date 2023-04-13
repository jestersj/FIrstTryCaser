const ApiError = require("../errors/ApiError");
const TokenService = require("../services/TokenService");

module.exports = function (req, res, next){
        if (req.method === 'OPTIONS'){
            next()
        }
        try {
            const accessToken = req.headers.authorization.split(' ')[1]
            if (!accessToken) {
                return next(ApiError.unauthorized('Пользователь не авторизован'))
            }
            const userData = TokenService.validateAccessToken(accessToken)
            if (!userData) {
                return next(ApiError.unauthorized('Пользователь не авторизован'))
            }
            if (!userData.isActive) {
                return next(ApiError.unauthorized('Аккаунт не активирован'))
            }
            req.user = userData
            next()
        } catch (e) {
            return res.status(401).json({message: 'Пользователь не авторизован'})
        }
}