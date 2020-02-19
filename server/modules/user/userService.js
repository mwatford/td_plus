const createUser = User => profile => {
  if (!profile) {
    throw new Error(`Profile: ${profile} loginStrategy: ${loginStrategy}`);
  }

  const user = new User({
    email: profile.email
  });

  return user.save();
};

const find = User => sub => {
  return User.findOne({ sub }, "-sub");
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

const updateUser = User => async (sub, changes) => {
  const user = await User.findOne({ sub });

  Object.assign(user, changes);

  return user.save();
};

const getId = User => email => {
  return User.findOne({ email }, "_id");
};

const getAllFriends = User => async sub => {
  const user = await User.find({ sub });
  const friends = await User.find({}, "name email _id")
    .where("_id")
    .in(user.friends)
    .exec();

  return friends;
};

module.exports = User => {
  return {
    createUser: createUser(User),
    find: find(User),
    findById: findById(User),
    getAll: getAll(User),
    updateUser: updateUser(User),
    findByEmail: findByEmail(User),
    getId: getId(User),
    getAllFriends: getAllFriends(User)
  };
};
