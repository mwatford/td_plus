const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  email: String,
  password: String,
  name: { type: String, default: "" },
  projects: [],
  img: String,
  loginStrategy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
