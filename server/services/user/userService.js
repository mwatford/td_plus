const createUser = User => profile => {
  if (!profile) {
    throw new Error(`Profile: ${profile} loginStrategy: ${loginStrategy}`);
  }

  const user = new User(profile);

  return user.save();
};

const find = User => sub => {
  return User.findOne({ sub }, '-sub');
};

const findByEmail = User => email => {
  return User.findOne({ email: email });
};

const findById = User => (id, projection = '-sub') => {
  return User.findById(id, projection);
};

const get = User => (query, projection = '-sub') => {
  return User.find(query, projection);
};

const updateUser = async (user, changes) => {
  Object.assign(user, changes);

  return user.save();
};

const getId = User => email => {
  return User.findOne({ email }, '_id');
};

const updateUsers = User => async (users, cb) => {
  return await Promise.all(
    users.map(async id => {
      const user = await findById(User)(id);
      return cb(user);
    })
  );
};

const deleteUser = User => async (sub, cb) => {
  return await User.findOneAndRemove({ sub }, cb);
};

module.exports = User => {
  return {
    createUser: createUser(User),
    find: find(User),
    findById: findById(User),
    get: get(User),
    updateUser,
    findByEmail: findByEmail(User),
    getId: getId(User),
    updateUsers: updateUsers(User),
    delete: deleteUser(User),
  };
};
