const Router = require('express')
const router = new Router()
const userRouter = require('./user/userRouter')
const caseRouter = require('./case/caseRouter')

router.use('/user', userRouter)
router.use('/case', caseRouter)

module.exports = router