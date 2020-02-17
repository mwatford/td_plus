const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  admin: String,
  members: [],
  toDo: [],
  inProgress: [],
  done: []
});

module.exports = mongoose.model("Project", ProjectSchema);
