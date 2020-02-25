const router = require("express").Router();
const controller = require("../controllers/users/index");

const authenticate = require("../middleware/authentication");

router.use(authenticate);

router.post("/current", controller.currentUser);

router.put("/current/update", controller.userUpdate);

router.get("/search/:email", controller.searchEmail);

module.exports = router;
