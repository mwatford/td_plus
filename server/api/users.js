const router = require("express").Router();
const controller = require("../controllers/users/index");

const authenticate = require("../middleware/authentication");

const handler = require("../utils/handler");

router.use(authenticate);

router.post(
  "/current",
  handler(controller.currentUser, (req, res, next) => {
    return { sub: req.user.sub, email: req.body.email };
  })
);

router.put(
  "/current/update",
  handler(controller.userUpdate, (req, res, next) => {
    return {
      sub: req.user.sub,
      changes: req.body.changes
    };
  })
);

router.get(
  "/search/:email",
  handler(controller.searchEmail, (req, res, next) => {
    return {
      email: req.params.email
    };
  })
);

module.exports = router;
