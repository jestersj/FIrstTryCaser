const Router = require('express')
const router = new Router()
const caseController = require('../../controllers/СaseController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.get('/fetchMod', roleCheckMiddleware('ADMIN'), caseController.fetchModeratedCases)
router.put('/approve/:caseId', roleCheckMiddleware('ADMIN'), caseController.approveCase)

module.exports = router