const Controller = require("./controller");

const services = {
  userService: require("../../modules/user/index")
};

module.exports = Controller(services);
