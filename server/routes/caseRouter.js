const Router = require('express')
const router = new Router()
const caseController = require('../controllers/СaseController')
const authMiddleware = require('../middleware/AuthMiddleware')
const roleCheckMiddleware = require('../middleware/RoleCheckMiddleware')

router.post('/add', roleCheckMiddleware('COMPANY'), caseController.addCase)
router.post('/started', authMiddleware, caseController.startCase)
router.get('/started', authMiddleware, caseController.fetchStartedCases)
router.get('/', caseController.fetchAll)

module.exports = router
