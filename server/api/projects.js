const router = require("express").Router();
const userService = require("../modules/user/index");
const projectService = require("../modules/project/index");
const authenticate = require("../utils/authentication");

router.post("/projects/create", authenticate, async (req, res) => {
  try {
    const admin = await userService.findByEmail(req.body.email);

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

router.get("/projects/all/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  const user = await userService.findById(id);
  const projectIDs = user.projects;

  const projects = await projectService.findMany(projectIDs);

  res.send(projects);
});

router.get("/projects/:id/:userId", authenticate, async (req, res) => {
  const project = await projectService.find(req.params.id);

  const isAuthenticated = await projectService.authenticate(
    project,
    req.params.userId
  );

  if (isAuthenticated) {
    return res.send(project);
  } else {
    res.status(403).send("Sorry! You can't see that.");
  }
});

router.put("/projects/:id/addMember", authenticate, (req, res) => {
  console.log(req.params);
});

module.exports = router;
