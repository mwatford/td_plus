const router = require("express").Router();
const controller = require("../controllers/projects/index");

const authenticate = require("../middleware/authentication");

const handler = require("../utils/handler");

router.use(authenticate);

router.post(
  "/create",
  handler(controller.create, (req, res, next) => {
    return {
      sub: req.user.sub,
      project: req.body.project
    };
  })
);

router.get(
  "/all/:id",
  handler(controller.getUserProjects, (req, res, next) => {
    return {
      sub: req.user.sub
    };
  })
);

router.get(
  "/:id",
  handler(controller.getProject, (req, res, next) => {
    return {
      sub: req.user.sub,
      id: req.params.id
    };
  })
);

router.get(
  "/:id/admin",
  handler(controller.isAdmin, (req, res, next) => {
    return {
      sub: req.user.sub,
      id: req.params.id
    };
  })
);

router.delete(
  "/:id",
  handler(controller.deleteProject, (req, res, next) => {
    return {
      sub: req.user.sub,
      id: req.params.id
    };
  })
);

router.post(
  "/import",
  handler(controller.import, (req, res, next) => {
    return {
      sub: req.user.sub,
      projects: req.body.projects
    };
  })
);

module.exports = router;
