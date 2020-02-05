const mongoose = require("mongoose");
const mongoPath = "mongodb://localhost/test_db";
const User = require("../User");

mongoose.connect(mongoPath);

describe("user model", () => {
  beforeAll(async () => {
    await User.remove({});
  });

  afterEach(async () => {
    await User.remove({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("has a module", () => {
    expect(User).toBeDefined();
  });

  describe("get user", () => {
    test("gets a user", async () => {
      const user = new User({
        id: "123",
        email: "test@email.com",
        loginStrategy: "google"
      });
      await user.save();

      const foundUser = await User.findOne({
        id: "123",
        loginStrategy: "google"
      });
      const expected = "123";
      const actual = foundUser.id;

      expect(actual).toEqual(expected);
    });
  });

  describe("save a user", () => {
    test("saves a user", async () => {
      const user = new User({ id: "1234", loginStrategy: "github" });
      const savedUser = await user.save();

      const expected = "1234";
      const actual = savedUser.id;
      expect(actual).toEqual(expected);
    });
  });

  describe("update user", () => {
    test("updates a user", async () => {
      const user = new User({ id: "1355", loginStrategy: "google" });
      await user.save();

      user.loginStrategy = "github";
      const updatedUser = await user.save();

      const expected = "github";
      const actual = updatedUser.loginStrategy;
      expect(actual).toEqual(expected);
    });
  });
});
