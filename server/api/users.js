const router = require("express").Router();
const userService = require("../modules/user/index");

const authenticate = require("../utils/authentication");

router.post("/users/current", authenticate, async (req, res) => {
  const { sub } = req.user;
  try {
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

router.put("/users/current/update", authenticate, async (req, res) => {
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

router.get("/users/:userId/friends", authenticate, async (req, res) => {
  const { sub } = req.user;
  const friendList = await userService.getAllFriends(sub);

  console.log({ friendList });
});

module.exports = router;
