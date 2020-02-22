const create = services => async (req, res) => {
  try {
    const { userService, projectService } = services;
    const admin = await userService.find(req.user.sub);

    if (admin) {
      const project = await projectService.createProject({
        admin: admin._id,
        members: [admin._id, ...req.body.project.members],
        name: req.body.project.name
      });

      userService.notifyUsers(project.members, user => {
        user.projects.push(project._id);
        user.save();
      });

      res.send(project);
    }
  } catch (e) {
    console.log(e);
  }
};

const getUserProjects = services => async (req, res) => {
  const { userService, projectService } = services;
  const { sub } = req.user;

  const user = await userService.find(sub);
  const projectIDs = user.projects;

  const projects = await projectService.findMany(projectIDs);

  res.send(projects);
};

const getProject = services => async (req, res) => {
  try {
    const { userService, projectService } = services;
    const { sub } = req.user;
    const project = await projectService.find(req.params.id);
    const { _id } = await userService.find(sub);

    const isMember = await projectService.isMember(project, _id);

    if (isMember) {
      return res.send(project);
    } else {
      res.status(403).send("Sorry! You can't see that.");
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteProject = services => async (req, res) => {
  try {
    const { userService, projectService } = services;
    const projectId = req.params.id;
    const { sub } = req.user;
    const { _id } = await userService.find(sub);
    const project = await projectService.find(projectId);

    const isAdmin = await projectService.isAdmin(project, _id);

    if (isAdmin) {
      await projectService.deleteProject(projectId, (err, { members }) => {
        userService.notifyUsers(members, user => {
          const index = user.projects.indexOf(projectId);
          if (index !== -1) {
            user.projects.splice(index, 1);
            user.save();
          }
        });
      });
      res.sendStatus(200);
    } else {
      res.status(403).send(`You don't have permission to do that!`);
    }
  } catch (e) {
    console.log({ e });
  }
};
module.exports = services => {
  return {
    create: create(services),
    getUserProjects: getUserProjects(services),
    getProject: getProject(services),
    deleteProject: deleteProject(services)
  };
};
