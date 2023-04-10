const Router = require('express')
const router = new Router()
const userController = require('../../controllers/UserController')
const authMiddleware = require('../../middleware/AuthMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/activate', userController.activateAccount)

module.exports = router