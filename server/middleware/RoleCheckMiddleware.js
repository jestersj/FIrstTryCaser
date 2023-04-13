const ApiError = require("../errors/ApiError");
const TokenService = require("../services/TokenService");

module.exports = function (role) {
    return function (req, res, next){
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
            if (userData.role !== role) {
                return next(ApiError.unauthorized('У вас нет прав на совершение данного действия'))
            }
            req.user = userData
            next()
        } catch (e) {
            return res.status(401).json({message: 'Пользователь не авторизован'})
        }
    }
}