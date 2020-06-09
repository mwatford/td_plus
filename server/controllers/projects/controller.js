const helpers = require('./helpers');

const create = models => async ({ sub, project }) => {
  const { User } = models;
  const admin = await User.findOne({ sub }, '-sub');

  if (admin) {
    const newProject = await helpers.saveProject(models, project, admin);

    return { data: newProject, status: 201 };
  }
};

const getUserProjects = models => async ({ sub }) => {
  const { User, Project } = models;

  const user = await User.findOne({ sub }, '-sub');

  const projects = await Project.find({}, 'name members password admin')
    .where('_id')
    .in(user.projects)
    .exec();

  return { data: projects, status: 200 };
};

const getProject = models => async ({ sub, id }) => {
  const { User, Project } = models;
  const { _id } = await User.findOne({ sub });
  const project = await Project.findById(id);

  const isMember = await project.members.find(el => _id.equals(el));

  if (isMember) {
    return {
      status: 200,
      data: project,
    };
  }
  return {
    status: 403,
  };
};

const isAdmin = models => async ({ id, sub }) => {
  const { Project, User } = models;

  const { _id } = await User.findOne({ sub });
  const project = await Project.findById(id);
  const isAdmin = _id.equals(project.admin);

  if (isAdmin) {
    return { status: 200 };
  }
  return { status: 403 };
};

const deleteProject = models => async ({ sub, id }) => {
  const { Project, User } = models;
  const { _id } = await User.findOne({ sub });
  const project = await Project.findById(id);
  const isAdmin = _id.equals(project.admin);

  if (isAdmin) {
    await Project.findByIdAndRemove(id, helpers.updateUsersAfterDelete(User));

    return { status: 200 };
  } else {
    return { status: 403 };
  }
};

const importProjects = models => async ({ sub, projects }) => {
  const { User, Project } = models;

  let admin = await User.findOne({ sub });

  if (admin) {
    await Promise.all(
      projects.map(project => helpers.saveProject(models, project, admin))
    );
  }

  admin = await User.findOne({ sub });

  const userProjects = await Project.find({}, 'name members password admin')
    .where('_id')
    .in(admin.projects)
    .exec();

  return { status: 200, data: userProjects };
};

const activeProject = models => async ({ id }) => {
  const { User, Project } = models;

  let project = await Project.findById(id);

  const members = await Promise.all(
    project.members.map(member => User.findById(member.id, 'name email'))
  );

  for (let i = 0; i < project.members.length; i++) {
    const { name, email } = members[i];

    Object.assign(project.members[i], { name, email });
  }

  return { status: 200, data: project };
};

const update = models => async ({ project, id }) => {
  const { Project } = models;
  const projectToOverwrite = await Project.findById(id);

  Object.assign(projectToOverwrite, project);

  await projectToOverwrite.save();

  const { data } = await activeProject(models)({ id });

  return { status: 200, data };
};

const addUser = models => async ({ id, userId }) => {
  const { User, Project } = models;
  const user = await User.findById(userId);
  const project = await Project.findById(id);

  if (!user || !project) return { status: 404 };

  project.members.push({
    id: user._id.toString(),
    role: 'basic',
    permissions: [],
  });

  user.projects.push(project._id.toString());

  await project.save();
  await user.save();

  return { status: 200, data: project };
};

const removeUser = models => async ({ id, userId }) => {
  const { User, Project } = models;
  const user = await User.findById(userId);
  const project = await Project.findById(id);
  const isMember = project.members.findIndex(el => el.id === userId);
  const isProject = user.projects.findIndex(el => el === id);

  if (isMember === -1 || isProject === -1) return { status: 200 };

  project.members.splice(isMember, 1);
  user.projects.splice(isProject, 1);

  await project.save();
  await user.save();

  return { status: 200, data: project };
};

module.exports = models => ({
  create: create(models),
  getUserProjects: getUserProjects(models),
  getProject: getProject(models),
  deleteProject: deleteProject(models),
  isAdmin: isAdmin(models),
  import: importProjects(models),
  activeProject: activeProject(models),
  update: update(models),
  removeUser: removeUser(models),
  addUser: addUser(models),
});
