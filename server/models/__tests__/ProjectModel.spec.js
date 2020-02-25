const mongoose = require("mongoose");
const mongoPath = "mongodb://localhost/test_db";
const Project = require("../Project");

mongoose.connect(mongoPath);

describe("Project model", () => {
  beforeAll(async () => {
    await Project.remove({});
  });

  afterEach(async () => {
    await Project.remove({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("has a module", () => {
    expect(Project).toBeDefined();
  });
});
