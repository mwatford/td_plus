const currentUser = services => async (req, res) => {
  try {
    const { userService } = services;
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
      delete newUser.sub;
      return res.send(newUser);
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

const userUpdate = services => async (req, res) => {
  try {
    const { userService } = services;
    const { changes } = req.body;
    const { sub } = req.user;

    const user = await userService.find(sub);
    await userService.updateUser(user, changes);
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
  } catch (e) {
    res.sendStatus(500);
  }
};

const searchEmail = services => async (req, res) => {
  try {
    const { userService } = services;
    const email = req.params.email;
    const regexp = new RegExp(email, "g");
    const users = await userService.get({ email: regexp }, "_id email name");

    res.send(users);
  } catch (e) {
    console.log(e);
  }
};

const userFriends = services => async (req, res) => {
  try {
    const { userService } = services;
    const { sub } = req.user;
    const friendList = await userService.getAllFriends(sub);
  } catch (e) {
    console.log(e);
  }
};

module.exports = services => {
  return {
    currentUser: currentUser(services),
    userUpdate: userUpdate(services),
    searchEmail: searchEmail(services),
    userFriends: userFriends(services)
  };
};
