const helpers = require('./helpers');
const bcrypt = require('bcryptjs');
const { signToken } = require('../../middleware/jwt');

const register = models => async credentials => {
  const { User } = models;
  const userExists = await User.findOne({ email: credentials.email });

  if (userExists) {
    return {
      status: 200,
      data: {
        message: 'Email already in use.',
      },
    };
  }

  credentials.password = await bcrypt.hash(credentials.password, 10);
  const user = new User(credentials);
  await user.save();
  credentials.id = user._id;
  const token = signToken(credentials);

  return {
    status: 201,
    data: {
      token,
    },
  };
};

const signIn = models => async ({ email, password }) => {
  const { User } = models;

  const user = await User.findOne({ email });
  if (!user) return { status: 403, data: { message: 'Invalid email' } };

  const passwordsMatch = bcrypt.compareSync(password, user.password);

  if (!passwordsMatch)
    return { status: 403, data: { message: 'Invalid password' } };

  const token = signToken({ email, password, id: user._id });

  return {
    status: 200,
    data: { token },
  };
};

const currentUser = models => async ({ email }) => {
  const { User } = models;

  let user = await User.findOne({ email });

  if (user)
    return {
      status: 200,
      data: {
        user,
      },
    };

  return {
    status: 500,
    data: { message: { type: 'error', message: 'Error trying to log in' } },
  };
};

const searchByEmail = models => async ({ email }) => {
  const { User } = models;
  const regexp = new RegExp(email, 'g');

  const users = await User.find({ email: regexp }, '_id email name projects');

  return { status: 200, data: users };
};

const deleteUser = models => async ({ email }) => {
  const { Project, User } = models;
  const user = await User.findOne({ email });
  const { projects } = user;
  const userProjects = await helpers.findUserProjects(Project, projects);

  await Promise.all(userProjects.map(helpers.removeUserFromProject(user)));
  await User.findOneAndRemove({ email });

  return { status: 200 };
};

const update = models => async ({ id, changes }) => {
  const { User } = models;

  await User.findByIdAndUpdate(id, changes);

  const user = await User.findById(id);

  return {
    status: 200,
    data: user,
  };
};

module.exports = models => {
  return {
    currentUser: currentUser(models),
    searchByEmail: searchByEmail(models),
    delete: deleteUser(models),
    update: update(models),
    register: register(models),
    signIn: signIn(models),
  };
};
