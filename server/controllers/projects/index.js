const Controller = require("./controller");

const services = {
  userService: require("../../services/user/index"),
  projectService: require("../../services/project/index")
};

module.exports = Controller(services);
