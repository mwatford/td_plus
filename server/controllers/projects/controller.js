const create = services => async ({ sub, project }) => {
  const { userService, projectService } = services;
  const admin = await userService.find(sub);

  if (admin) {
    const newProject = await projectService.createProject({
      admin: admin._id,
      members: [admin._id, ...project.members],
      name: project.name,
      password: project.password
    });

    userService.updateUsers(newProject.members, user => {
      user.projects.push(newProject._id);
      user.save();
    });

    return { data: newProject, status: 201 };
  }
};

const getUserProjects = services => async ({ sub }) => {
  const { userService, projectService } = services;

  const user = await userService.find(sub);

  const projects = await projectService.findMany(user.projects);

  return { data: projects, status: 200 };
};

const getProject = services => async ({ sub, id }) => {
  const { userService, projectService } = services;
  const { _id } = await userService.find(sub);
  const project = await projectService.find(id);

  const isMember = await projectService.isMember(project, _id);

  if (isMember) {
    return {
      status: 200,
      data: project
    };
  }
  return {
    status: 403
  };
};

const isAdmin = services => async ({ id, sub }) => {
  const { userService, projectService } = services;

  const { _id } = await userService.find(sub);
  const project = await projectService.find(id);
  const isAdmin = projectService.isAdmin(project, _id);

  if (isAdmin) {
    return { status: 200 };
  }
  return { status: 403 };
};

const deleteProject = services => async ({ sub, id }) => {
  const { userService, projectService } = services;
  const { _id } = await userService.find(sub);
  const project = await projectService.find(id);

  const isAdmin = await projectService.isAdmin(project, _id);

  if (isAdmin) {
    await projectService.delete(id, (err, { members }) => {
      userService.updateUsers(members, user => {
        const index = user.projects.indexOf(id);
        if (index !== -1) {
          user.projects.splice(index, 1);
          user.save();
        }
      });
    });

    return { status: 200 };
  } else {
    return { status: 403 };
  }
};

module.exports = services => {
  return {
    create: create(services),
    getUserProjects: getUserProjects(services),
    getProject: getProject(services),
    deleteProject: deleteProject(services),
    isAdmin: isAdmin(services)
  };
};
