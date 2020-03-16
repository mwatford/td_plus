const write = user => ({
  write: (data, room) => {
    room.addMessage({ user: user.id, text: data });
    console.log("message added");
  }
});

const removeUser = user => ({
  removeUser: () => {
    console.log(`${user.name} can remove users.`);
  }
});

const factory = user => {
  const admin = () => Object.assign(user, write(user), removeUser(user));
  const custom = () =>
    Object.assign(user, ...user.permissions.map(el => eval(el)(user)));

  const basic = () => ({});

  try {
    return eval(user.type)(user);
  } catch (e) {
    return "error when creating user";
  }
};

module.exports = factory;
