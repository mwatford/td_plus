const create = User => (profile, loginStrategy) => {
  if (!profile || !loginStrategy) {
    throw new Error(`Profile: ${profile} loginStrategy: ${loginStrategy}`);
  }

  const user = new User({
    id: profile.id,
    email: profile.emails ? profile.emails[0].value : "",
    loginStrategy
  });

  return user.save();
};

const createLocalUser = User => profile => {
  const user = new User({
    email: profile.email,
    password: profile.password
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
  return User.findById(id, 'email name projects');
};

const getAll = User => () => {
  return User.find({});
};

const updateUser = User => async (id, changedUser) => {
  const user = await User.findById(id);

  Object.assign(user, changedUser);

  return user.save();
};

module.exports = User => {
  return {
    createUser: create(User),
    find: find(User),
    findById: findById(User),
    getAll: getAll(User),
    updateUser: updateUser(User),
    findByEmail: findByEmail(User),
    createLocalUser: createLocalUser(User)
  };
};
