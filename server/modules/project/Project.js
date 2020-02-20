const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true, default: "" },
  admin: { type: mongoose.ObjectId, required: true },
  members: [],
  toDo: [],
  inProgress: [],
  done: []
});

module.exports = mongoose.model("Project", ProjectSchema);
