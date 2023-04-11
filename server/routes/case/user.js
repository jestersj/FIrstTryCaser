const Router = require('express')
const router = new Router()
const solutionController = require('../../controllers/SolutionController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.post('/start/:caseId', roleCheckMiddleware('USER'), solutionController.startSolution)
router.get('/', roleCheckMiddleware('USER'), solutionController.fetchSolutions)
router.post('/finish/:caseId', roleCheckMiddleware('USER'), solutionController.finishSolution)

module.exports = router