const Router = require('express')
const router = new Router()
const userRouter = require('./user/userRouter')
const caseRouter = require('./case/caseRouter')
const appealRouter = require('./appeal/appealRouter')

router.use('/user', userRouter)
router.use('/case', caseRouter)
router.use('/appeal', appealRouter)

module.exports = router