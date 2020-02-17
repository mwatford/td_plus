const router = require("express").Router();
const userService = require("../modules/user/index");

const authenticate = require("../utils/authentication");

router.post("/users/current", authenticate, async (req, res) => {
  let user;
  if (await userService.findByEmail(req.body.email)) {
    user = await userService.findByEmail(req.body.email);
  } else {
    const profile = {
      email: req.body.email
    };
    user = await userService.createUser(profile);
  }

  res.send(user);
});

router.put("/users/current/update", authenticate, async (req, res) => {
  const { changes, email } = req.body;
  const user = await userService.updateUser(email, changes);
  if (user) {
    return res.send({
      message: "Your data has been updated",
      type: "success",
      user
    });
  } else {
    return res.send({
      message: "Something went wrong, try again later.",
      type: "error"
    });
  }
});

module.exports = router;
