const controller = require("./controller");
const projectService = require("../../services/project/index");
const userService = require("../../services/user/index");

const services = {
  projectService,
  userService
};

const manager = require("../../modules/RoomManager").getRoomManager();

module.exports = controller(services, manager);
