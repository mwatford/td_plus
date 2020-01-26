const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  loginStrategy: String
});

module.exports = mongoose.model("Recipe", UserSchema);
