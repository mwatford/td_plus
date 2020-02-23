const router = require("express").Router();
const controller = require("../controllers/projects/index");

const authenticate = require("../middleware/authentication");

router.use(authenticate);

router.post("/create", controller.create);

router.get("/all/:id", controller.getUserProjects);

router.get("/:id", controller.getProject);

router.delete("/:id", controller.deleteProject);

router.get("/:id/admin", controller.isAdmin);

module.exports = router;
