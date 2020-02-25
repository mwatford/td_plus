const Controller = require("./controller");

const services = {
  userService: require("../../services/user/index")
};

module.exports = Controller(services);
