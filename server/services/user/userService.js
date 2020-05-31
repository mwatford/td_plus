const { create } = require('../common');

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

const update = User => async (id, changes) => {
  return User.findByIdAndUpdate(id, changes);
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

module.exports = User => ({
  createUser: create(User),
  find: find(User),
  findById: findById(User),
  get: get(User),
  update: update(User),
  findByEmail: findByEmail(User),
  getId: getId(User),
  updateUsers: updateUsers(User),
  delete: deleteUser(User),
});
