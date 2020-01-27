const router = require("express").Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", { session: false, scope: ["profile"] })
);
router.get(
  "/auth/github",
  passport.authenticate("github", { session: false, scope: ["profile"] })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.send(req);
  }
);
router.get(
  "/auth/github/redirect",
  passport.authenticate("github"),
  (req, res) => {
    res.send(req);
  }
);

module.exports = router;
