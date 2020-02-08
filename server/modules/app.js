const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const passportSetup = require("../config/passport");
const path = require("path");
// const history = require("express-history-api-fallback");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public/index.html"));
});
app.get("/app", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist/index.html"));
});

app.use(express.static("dist"));
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(history("index.html", { global: '/dist' }));
app.use(passport.initialize());
app.use(passport.session());

const api = require("../api/index");

app.use("/api", api);

mongoose.Promise = global.Promise;

let mongoPath;

if (process.env.NODE_ENV !== "prod") {
  mongoPath = "mongodb://localhost/db";
  mongoose.set("debug", true);
} else {
  mongoPath = { mongodb } = require("../config/keys");
}

mongoose.connect(
  mongoPath,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  () => {
    console.log("connected to DB", mongoPath);
  }
);

module.exports = app;
