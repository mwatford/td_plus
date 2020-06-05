const router = require('express').Router();
const controller = require('../controllers/users/index');

const authenticate = require('../middleware/authentication');

const handler = require('../utils/handler');

router.use(authenticate);

router.post(
  '/current',
  handler(controller.currentUser, (req, res, next) => {
    return { sub: req.user.sub, email: req.body.email };
  })
);

router.get(
  '/search/:email',
  handler(controller.searchByEmail, (req, res, next) => {
    return {
      email: req.params.email,
    };
  })
);

router.delete(
  '/current',
  handler(controller.delete, (req, res, next) => {
    return {
      sub: req.user.sub,
    };
  })
);

router.put(
  '/:id',
  handler(controller.update, (req, res, next) => {
    return {
      id: req.params.id,
      changes: req.body.changes,
    };
  })
);

module.exports = router;
