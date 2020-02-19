const createProject = Project => data => {
  if (!data) {
    throw new Error("Data was not passed!");
  }

  const project = new Project(data);

  return project.save();
};

const find = Project => id => {
  if (!id) {
    throw new Error("Id was not provided!");
  }

  return Project.findById(id);
};

const authenticate = (project, userId) => {
  if (!userId) {
    throw new Error("argument was not passed: userId");
  }
  if (!project) {
    throw new Error("argument was not passed: project");
  }

  return Boolean(project.members.find(el => el == userId));
};

const addMember = (project, adminId, userId) => {
  if (project.admin === adminId) {
    project.members.push(userId);
    return project.save();
  } else {
    throw new Error("Unauthorized");
  }
};

const findMany = Project => async projects => {
  records = await Project.find({}, 'name members')
    .where("_id")
    .in(projects)
    .exec();

  return records;
};

module.exports = Project => {
  return {
    createProject: createProject(Project),
    find: find(Project),
    authenticate: authenticate,
    addMember: addMember,
    findMany: findMany(Project)
  };
};
