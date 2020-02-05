const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  owner: String
});

module.exports = mongoose.model("Project", ProjectSchema);
