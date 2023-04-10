const Router = require('express')
const router = new Router()
const company = require('./company')
const user = require('./user')
const admin = require('./admin')
const everyone = require('./everyone')

router.use('/company', company)
router.use('/user', user)
router.use('/admin', admin)
router.use('/everyone', everyone)

module.exports = router



