const Router = require('express')
const router = new Router()
const caseController = require('../../controllers/СaseController')

router.get('/', caseController.fetchAll)
router.get('/:caseId', caseController.fetchOne)

module.exports = router