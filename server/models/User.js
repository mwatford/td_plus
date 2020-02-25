const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  sub: { type: String, required: true },
  email: String,
  password: String,
  name: { type: String, default: "" },
  projects: [],
  friends: [],
  loginStrategy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
