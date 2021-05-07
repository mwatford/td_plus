const router = require('express').Router()
const controller = require('../controllers/users/index')
const handler = require('../utils/handler')
const unprotectedRoutes = require('./unprotected-routes')

const authenticateToken = require('../middleware/jwt').authenticateToken(
  unprotectedRoutes
)

router.use(authenticateToken)

router.post(
  '/register',
  handler(controller.register, (req, res, next) => {
    return {
      email: req.body.email,
      password: req.body.password,
    }
  })
)

router.post(
  '/sign-in',
  handler(controller.signIn, (req, res, next) => {
    return { email: req.body.email, password: req.body.password }
  })
)

router.get(
  '/current',
  handler(controller.currentUser, (req, res, next) => {
    return { email: req.user.email }
  })
)

router.get(
  '/search/:email',
  handler(controller.searchByEmail, (req, res, next) => {
    return {
      email: req.params.email,
    }
  })
)

router.delete(
  '/current',
  handler(controller.delete, (req, res, next) => {
    return {
      email: req.user.email,
    }
  })
)

router.put(
  '/current',
  handler(controller.update, (req, res, next) => {
    return {
      id: req.user.id,
      changes: req.body,
    }
  })
)

module.exports = router
