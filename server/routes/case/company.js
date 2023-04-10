const Router = require('express')
const router = new Router()
const caseController = require('../../controllers/СaseController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.post('/add', roleCheckMiddleware('COMPANY'), caseController.addCase)
router.put('/activate', roleCheckMiddleware('COMPANY'), caseController.activateCase)
router.post('/archive', roleCheckMiddleware('COMPANY'), caseController.archiveCase)

module.exports = router