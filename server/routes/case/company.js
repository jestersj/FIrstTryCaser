const Router = require('express')
const router = new Router()
const caseController = require('../../controllers/СaseController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.post('/add', roleCheckMiddleware('COMPANY'), caseController.addCase)
router.put('/activate/:caseId', roleCheckMiddleware('COMPANY'), caseController.activateCase)
router.post('/archive/:caseId', roleCheckMiddleware('COMPANY'), caseController.archiveCase)
router.delete('/delete/:caseId', roleCheckMiddleware('COMPANY'), caseController.deleteCase)

module.exports = router