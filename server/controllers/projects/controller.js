const create = services => async ({ sub, project }) => {
  const { userService } = services;
  const admin = await userService.find(sub);

  if (admin) {
    const newProject = await saveProject(services, project, admin);
    return { data: newProject, status: 201 };
  }
};

const saveProject = async ({ projectService, userService }, project, admin) => {
  const newProject = await projectService.createProject({
    admin: admin._id,
    members: [{ id: String(admin._id), role: 'admin', permissions: [] }],
    name: project.name,
    password: project.password,
    lists: project.lists,
  });

  await userService.updateUsers(
    newProject.members.map(el => el.id),
    user => {
      user.projects.push(String(newProject._id));
      return user.save();
    }
  );
  return newProject;
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
      data: project,
    };
  }
  return {
    status: 403,
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
      userService.updateUsers(
        members.map(el => el.id),
        user => {
          const index = user.projects.indexOf(id);
          if (index !== -1) {
            user.projects.splice(index, 1);
            user.save();
          }
        }
      );
    });

    return { status: 200 };
  } else {
    return { status: 403 };
  }
};

const importProjects = services => async ({ sub, projects }) => {
  const { userService, projectService } = services;

  let admin = await userService.find(sub);

  if (admin) {
    await Promise.all(
      projects.map(project => saveProject(services, project, admin))
    );
  }

  admin = await userService.find(sub);

  const userProjects = await projectService.findMany(admin.projects);

  return { status: 200, data: userProjects };
};

const activeProject = services => async ({ id }) => {
  const { userService, projectService } = services;

  let project = await projectService.find(id);

  const members = await Promise.all(
    project.members.map(member => userService.findById(member.id, 'name email'))
  );

  for (let i = 0; i < project.members.length; i++) {
    const { name, email } = members[i];

    Object.assign(project.members[i], { name, email });
  }

  return { status: 200, data: project };
};

const update = services => async ({ project, id }) => {
  const { projectService } = services;
  const projectToOverwrite = await projectService.find(id);

  Object.assign(projectToOverwrite, project);

  await projectToOverwrite.save();

  const { data } = await activeProject(services)({ id });

  return { status: 200, data };
};

module.exports = services => ({
  create: create(services),
  getUserProjects: getUserProjects(services),
  getProject: getProject(services),
  deleteProject: deleteProject(services),
  isAdmin: isAdmin(services),
  import: importProjects(services),
  activeProject: activeProject(services),
  update: update(services),
});
