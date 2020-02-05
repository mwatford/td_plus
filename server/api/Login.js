const router = require("express").Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: true,
    scope: ["profile", "email"]
  })
);
router.get(
  "/auth/github",
  passport.authenticate("github", {
    session: true,
    scope: ["profile", "email"]
  })
);

router.get("/auth/google/redirect", passport.authenticate("google"), {
  failureRedirect: "/",
  failureFlash: true,
  successRedirect: "/profile"
});

router.get(
  "/auth/github/redirect",
  passport.authenticate("github"),
  (req, res) => {
    res.send(req.user);
  }
);

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("back");
// });

router.get("/current_user", isLoggedIn, function(req, res) {
  console.log("hahaha");
  if (req.user) {
    res.send({ current_user: req.user });
  } else {
    res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

function isLoggedIn(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated() || req.method === "OPTIONS") return next();

  res.redirect("/login");
  console.log("error! auth failed");
}

router.get("/logout", function(req, res) {
  req.logout();
  res.send();
});

module.exports = router;
