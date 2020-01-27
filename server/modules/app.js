const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passportSetup = require("../config/passport");

const app = express();

mongoose.Promise = global.Promise;

let mongoPath;

if (process.env.NODE_ENV !== "prod") {
  mongoPath = "mongodb://localhost/db";
} else {
  mongoPath = { mongodb } = require("../config/keys");
}

mongoose.connect(mongoPath, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const DB = mongoose.connection;

const api = require("../api/index");

DB.once("open", () => {
  console.log("connected to DB");
});

DB.on("error", err => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(cors());
app.use("/", api);

module.exports = app;
