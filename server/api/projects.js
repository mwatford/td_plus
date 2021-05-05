const router = require('express').Router();
const controller = require('../controllers/projects/index');

const authenticateToken = require('../middleware/jwt').authenticateToken();

const handler = require('../utils/handler');

router.use(authenticateToken);

router.post(
  '/create',
  handler(controller.create, (req, res, next) => {
    return {
      id: req.user.id,
      project: req.body,
    };
  })
);

router.get(
  '/all/:id',
  handler(controller.getUserProjects, (req, res, next) => {
    return {
      id: req.user.id,
    };
  })
);

router.get(
  '/:id',
  handler(controller.getProject, (req, res, next) => {
    return {
      id: req.user.id,
      projectId: req.params.id,
    };
  })
);

router.get(
  '/:id/admin',
  handler(controller.isAdmin, (req, res, next) => {
    return {
      id: req.user.id,
      projectId: req.params.id,
    };
  })
);

router.delete(
  '/:id',
  handler(controller.deleteProject, (req, res, next) => {
    return {
      id: req.user.id,
      projectId: req.params.id,
    };
  })
);

router.post(
  '/import',
  handler(controller.import, (req, res, next) => {
    return {
      id: req.user.id,
      projects: req.body,
    };
  })
);

router.get(
  '/active/:id',
  handler(controller.activeProject, (req, res, next) => {
    return {
      id: req.params.id,
    };
  })
);

router.put(
  '/:id',
  handler(controller.update, (req, res, next) => {
    return {
      project: req.body,
      id: req.params.id,
    };
  })
);

router.put(
  '/:id/addUser/:userId',
  handler(controller.addUser, (req, res, next) => {
    return {
      id: req.params.id,
      userId: req.params.userId,
    };
  })
);
router.put(
  '/:id/removeUser/:userId',
  handler(controller.removeUser, (req, res, next) => {
    return {
      id: req.params.id,
      userId: req.params.userId,
    };
  })
);

module.exports = router;
