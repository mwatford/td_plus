const createUser = User => profile => {
  if (!profile) {
    throw new Error(`Profile: ${profile} loginStrategy: ${loginStrategy}`);
  }

  const user = new User({
    email: profile.email
  });

  return user.save();
};

const find = User => (id, loginStrategy) => {
  return User.findOne({ id, loginStrategy });
};

const findByEmail = User => email => {
  return User.findOne({ email: email });
};

const findById = User => id => {
  return User.findById(id);
};

const getAll = User => () => {
  return User.find({});
};

const updateUser = User => async (email, changes) => {
  const user = await User.findOne({ email });

  Object.assign(user, changes);

  return user.save();
};

module.exports = User => {
  return {
    createUser: createUser(User),
    find: find(User),
    findById: findById(User),
    getAll: getAll(User),
    updateUser: updateUser(User),
    findByEmail: findByEmail(User)
  };
};
