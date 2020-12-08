const User = require("../../models/User");
const userService = require("./userService");

module.exports = userService(User);
