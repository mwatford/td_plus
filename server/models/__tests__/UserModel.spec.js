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
        email: "test@email.com",
        sub: "123"
      });
      await user.save();

      const foundUser = await User.findOne({
        sub: "123"
      });
      const expected = "123";
      const actual = foundUser.sub;

      expect(actual).toEqual(expected);
    });
  });

  describe("save a user", () => {
    test("saves a user", async () => {
      const user = new User({ sub: "1234" });
      const savedUser = await user.save();

      const expected = "1234";
      const actual = savedUser.sub;
      expect(actual).toEqual(expected);
    });
  });

  describe("update user", () => {
    test("updates a user", async () => {
      const user = new User({ sub: "1355", name: "Adam" });
      await user.save();

      user.name = "github";
      const updatedUser = await user.save();

      const expected = "github";
      const actual = updatedUser.name;
      expect(actual).toEqual(expected);
    });
  });
});
