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
        members: [admin._id]
      });

      admin.projects.push(project._id);
      admin.save();

      res.send(project);
    }
  } catch (e) {
    console.log(e);
  }
});

router.put("/projects/:id/addMember", authenticate, (req, res) => {
  console.log(req.params);
});

module.exports = router;
