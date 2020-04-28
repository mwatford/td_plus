const currentUser = services => async ({ sub, email }) => {
  const { userService } = services;

  const user = await userService.find(sub);

  if (user) return { data: user, status: 200 };

  const profile = {
    email,
    sub,
  };

  const newUser = await userService.createUser(profile);

  delete newUser.sub;

  return { data: newUser, status: 200 };
};

const searchEmail = services => async ({ email }) => {
  const { userService } = services;
  const regexp = new RegExp(email, 'g');

  const users = await userService.get(
    { email: regexp },
    '_id email name projects'
  );

  return { status: 200, data: users };
};

const deleteUser = services => async ({ sub }) => {
  const { userService, projectService } = services;

  const user = await userService.find(sub);

  const { projects } = user;

  const userProjects = await projectService.findMany(projects);

  await Promise.all(
    userProjects.map(project => {
      const member = project.members.find(el => user._id.equals(el.id));
      const index = project.members.indexOf(member);
      project.members.splice(index, 1);

      return project.save();
    })
  );

  userService.delete(sub);

  return { status: 200 };
};

const update = services => async ({ id, changes }) => {
  const { userService } = services;

  const user = await userService.update(id, changes);

  return {
    status: 200,
    data: user,
  };
};

module.exports = services => {
  return {
    currentUser: currentUser(services),
    searchEmail: searchEmail(services),
    delete: deleteUser(services),
    update: update(services),
  };
};
