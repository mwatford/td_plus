const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/projects', require('./projects'));
router.use('/fake', require('./fake'));

module.exports = router;
