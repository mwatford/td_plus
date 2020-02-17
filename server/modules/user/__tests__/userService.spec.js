const UserService = require("../userService");

describe("userService test", () => {
  test("has a module", () => {
    expect(UserService).toBeDefined();
  });

  describe("find test", () => {
    test("finds a user", () => {
      const findOne = jest.fn();
      const MockModel = {
        findOne
      };
      const userService = UserService(MockModel);
      userService.find("123");

      expect(findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("create test", () => {
    test("creates a user", () => {
      const save = jest.fn();
      let email;

      const MockModel = function(data) {
        email = data.email;

        return {
          ...data,
          save
        };
      };

      const userService = UserService(MockModel);

      userService.createUser({ email: "asd@asd.com" });

      expect(email).toEqual("asd@asd.com");
      expect(save).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById test", () => {
    test("finds a user by id", () => {
      const findById = jest.fn();

      const MockModel = {
        findById
      };
      const userService = UserService(MockModel);

      userService.findById("1233");

      expect(MockModel.findById).toHaveBeenCalledTimes(1);
      expect(MockModel.findById).toHaveBeenCalledWith("1233");
    });
  });

  describe("getAll test", () => {
    test("gets all users", () => {
      const find = jest.fn();
      const MockModel = {
        find
      };

      const userService = UserService(MockModel);

      userService.getAll();

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({});
    });
  });

  describe("updateUser test", () => {
    test("updates a user", async () => {
      const save = jest.fn();
      const user = {
        name: "Adam",
        save
      };
      const userChanges = {
        name: "Mark"
      };
      const findOne = jest.fn(() => {
        return user;
      });

      const MockModel = {
        findOne
      };
      const userService = UserService(MockModel);

      await userService.updateUser("123", userChanges);

      expect(save).toHaveBeenCalledTimes(1);
      expect(user.name).toEqual("Mark");
    });
  });
});
