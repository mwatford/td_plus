const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true, default: "" },
  admin: { type: String, required: true },
  members: [],
  lists: [{ name: String, data: [{ name: String, member: String }] }],
  password: String
});

module.exports = mongoose.model("Project", ProjectSchema);
