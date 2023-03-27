const Router = require('express')
const router = new Router()
const caseController = require('../controllers/СaseController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/', authMiddleware,caseController.addCase)
router.get('/', caseController.fetchAll)

module.exports = router
