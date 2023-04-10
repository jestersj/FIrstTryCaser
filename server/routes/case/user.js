const Router = require('express')
const router = new Router()
const caseController = require('../../controllers/СaseController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.post('/start', roleCheckMiddleware('USER'), caseController.startCase)
router.get('/fetchStarted', roleCheckMiddleware('USER'), caseController.fetchStartedCases)
router.put('/finish', roleCheckMiddleware('USER'), caseController.finishCase)

module.exports = router