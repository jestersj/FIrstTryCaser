const Router = require('express')
const router = new Router()
const caseController = require('../../controllers/СaseController')

router.get('/', caseController.fetchAll)

module.exports = router