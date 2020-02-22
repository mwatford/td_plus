const router = require("express").Router();
const userService = require("../modules/user/index");

const authenticate = require("../middleware/authentication");

router.post("/current", authenticate, async (req, res) => {
  try {
    const { sub } = req.user;
    const user = await userService.find(sub);

    if (user) {
      return res.send(user);
    } else {
      const profile = {
        email: req.body.email,
        sub
      };
      const newUser = await userService.createUser(profile);
      return res.send(newUser);
    }
  } catch (e) {
    console.log(e);
  }
});

router.put("/current/update", authenticate, async (req, res) => {
  const { changes } = req.body;
  const { sub } = req.user;

  const user = await userService.updateUser(sub, changes);
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

router.get("/:userId/friends", authenticate, async (req, res) => {
  const { sub } = req.user;
  const friendList = await userService.getAllFriends(sub);
});

router.get("/search/:email", authenticate, async (req, res) => {
  const email = req.params.email;
  const regexp = new RegExp(email, "g");
  const users = await userService.get({ email: regexp }, "_id email name");

  res.send(users);
});

module.exports = router;
