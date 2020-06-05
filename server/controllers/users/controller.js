const helpers = require('./helpers');

const currentUser = models => async ({ sub, email }) => {
  const { User } = models;

  const user = await User.findOne({ sub }, '-sub');

  if (user)
    return {
      status: 200,
      data: {
        user,
        message: {
          type: 'success',
          message: 'Logged in',
        },
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

const deleteUser = models => async ({ sub }) => {
  const { Project, User } = models;
  const user = await User.findOne({ sub });
  const { projects } = user;
  const userProjects = await helpers.findUserProjects(Project, projects);

  await Promise.all(userProjects.map(helpers.removeUserFromProject(user)));
  await User.findOneAndRemove({ sub });

  return { status: 200 };
};

const update = models => async ({ id, changes }) => {
  const { User } = models;

  const user = await User.findByIdAndUpdate(id, changes);

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
  };
};
