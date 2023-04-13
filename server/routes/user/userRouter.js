const Router = require('express')
const router = new Router()
const userController = require('../../controllers/UserController')
const authMiddleware = require('../../middleware/AuthMiddleware')
const {body} = require('express-validator')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/auth', authMiddleware, userController.check)
router.get('/activate/:token', userController.activateAccount)

module.exports = router