const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const caseRouter = require('./caseRouter')

router.use('/user', userRouter)
router.use('/case', caseRouter)

module.exports = router