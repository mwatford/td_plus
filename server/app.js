const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = async () => {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
  });

  app.use(express.static("dist"));
  app.use(express.static("public"));
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const api = require("./api/index");

  app.use("/api", api);

  mongoose.Promise = global.Promise;

  let mongoPath;

  if (process.env.NODE_ENV !== "production") {
    mongoPath = "mongodb://localhost/db";
    mongoose.set("debug", true);
  } else {
    mongoPath = require("./config/keys").mongodb;
  }

  await mongoose.connect(
    mongoPath,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    },
    () => {
      console.log("connected to DB", mongoPath);
    }
  );

  return app;
};

module.exports = app;
