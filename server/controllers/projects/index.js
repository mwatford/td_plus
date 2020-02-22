const Controller = require("./controller");

const services = {
  userService: require("../../modules/user/index"),
  projectService: require("../../modules/project/index")
};

module.exports = Controller(services);
