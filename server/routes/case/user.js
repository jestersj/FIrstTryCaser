const Router = require('express')
const router = new Router()
const solutionController = require('../../controllers/SolutionController')
const roleCheckMiddleware = require('../../middleware/RoleCheckMiddleware')

router.post('/start', roleCheckMiddleware('USER'), solutionController.startSolution)
router.get('/', roleCheckMiddleware('USER'), solutionController.fetchSolutions)
router.post('/finish', roleCheckMiddleware('USER'), solutionController.finishSolution)

module.exports = router