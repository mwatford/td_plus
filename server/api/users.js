const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userService = require("../modules/user/index");
const keys = require("../config/keys");
const bcrypt = require("bcryptjs");

const authenticateToken = require("../utils/authenticateToken");

router.post("/users/register/local", async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      const user = await userService.findByEmail(req.body.email);

      if (user) {
        return res.send({ message: "Email is already in use", type: "error" });
      }

      const hash = await bcrypt.hash(req.body.password, 10);

      const profile = {
        email: req.body.email,
        password: hash
      };

      await userService.createLocalUser(profile);

      res.status(201).send({ message: "Account created", type: "success" });
    } catch (err) {
      res.status(500).send({ message: "Server error", type: "error" });
    }
  }
});

router.get("/users/current", authenticateToken, async (req, res) => {
  const user = await userService.findById(req.user.id);

  res.json(user);
});

router.post("/users/login/local", async (req, res) => {
  const user = await userService.findByEmail(req.body.email);

  if (!user) {
    return res.send({ message: "Cannot find user", type: "error" });
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ id: user._id }, keys.jwt);
      res.json({
        message: "You have logged in successfully.",
        type: "success",
        token: accessToken
      });
    } else {
      res.json({ message: "Incorrect password", type: "error" });
    }
  } catch (err) {
    return res.status(500).send();
  }
  console.log({ user });
});

// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     session: true,
//     scope: ["profile", "email"]
//   })
// );
// router.get(
//   "/auth/github",
//   passport.authenticate("github", {
//     session: true,
//     scope: ["profile", "email"]
//   })
// );

// router.get(
//   "/auth/google/redirect",
//   passport.authenticate("google", {
//     failureRedirect: "/",
//     failureFlash: true,
//     successRedirect: "/profile"
//   })
// );

// router.get(
//   "/auth/github/redirect",
//   passport.authenticate("github"),
//   (req, res) => {
//     res.send(req.user);
//   }
// );

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("back");
// });

function isLoggedIn(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated()) return next();
}

// router.get("/logout", function(req, res) {
//   req.logout();
//   res.send();
// });

module.exports = router;
