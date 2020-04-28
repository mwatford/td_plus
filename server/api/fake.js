const router = require('express').Router();
const controller = require('../controllers/fake/index');

const authenticate = require('../middleware/authentication');

const handler = require('../utils/handler');

router.get('/users', async (req, res, next) => {
  try {
    const users = await controller.getUsers();

    console.log({ users });

    return res.send(users);
  } catch (e) {}
});

module.exports = router;
