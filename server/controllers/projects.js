const router = require("express").Router();
const userService = require("../modules/user/index");
const projectService = require("../modules/project/index");
const authenticate = require("../middleware/authentication");

router.post("/create", authenticate, async (req, res) => {
  try {
    const admin = await userService.find(req.user.sub);

    if (admin) {
      const project = await projectService.createProject({
        admin: admin._id,
        members: [admin._id, ...req.body.project.members],
        name: req.body.project.name
      });

      admin.projects.push(project._id);
      admin.save();

      res.send(project);
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/all/:id", authenticate, async (req, res) => {
  const { sub } = req.user;

  const user = await userService.find(sub);
  const projectIDs = user.projects;

  const projects = await projectService.findMany(projectIDs);

  res.send(projects);
});

router.get("/:id", authenticate, async (req, res) => {
  try {
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
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { sub } = req.user;
    const { _id } = await userService.find(sub);
    const project = await projectService.find(projectId);

    const isAdmin = await projectService.isAdmin(project, _id);

    if (isAdmin) {
      await projectService.deleteProject(projectId, (err, { members }) => {
        members.forEach(async id => {
          const user = await userService.findById(id);
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
});

module.exports = router;
