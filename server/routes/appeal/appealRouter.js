const Router = require('express')
const router = new Router()
const appealController = require('../../controllers/AppealController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.get('/', roleCheckMiddleware('ADMIN'), appealController.fetchAll)
router.get('/:id', roleCheckMiddleware('ADMIN'), appealController.fetchOne)
router.post('/', appealController.createAppeal)

module.exports = router