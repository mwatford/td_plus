const router = require('express').Router()

router.use('/users', require('./users'))
router.use('/projects', require('./projects'))

module.exports = router
