const Controller = require("../users/controller");
const userService = require("userService");

const services = {
  userService
};

const controller = Controller(services);

describe("user controller", () => {
  test("has a module", () => {
    expect(Controller).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("currentUser test", () => {
    test("searches for a user", async () => {
      await controller.currentUser({ sub: "123", email: "asd@asd.com" });

      expect(userService.find).toHaveBeenCalledWith("123");
    });

    test("sends user if user was found", async () => {
      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ name: "Adam" })
      );
      const expected = { data: { name: "Adam" }, status: 200 };

      const response = await controller.currentUser({
        sub: "1234",
        email: "asd@asd.com"
      });

      expect(response).toEqual(expected);
    });

    test("creates a user if user was not found", async () => {
      const expected = { data: { email: "asd@asd.com" }, status: 200 };
      const user = {
        sub: "asd",
        email: "asd@asd.com"
      };

      const response = await controller.currentUser(user);

      expect(response).toEqual(expected);
      expect(userService.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe("userUpdate test", () => {
    const args = { sub: "123", changes: { name: "Mark" } };
    test("searches for a user", async () => {
      await controller.userUpdate(args);

      expect(userService.find).toHaveBeenCalledWith("123");
    });

    test("calls updateUser method", async () => {
      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ name: "Adam" })
      );
      await controller.userUpdate(args);

      expect(userService.updateUser).toHaveBeenCalledWith(
        { name: "Adam" },
        args.changes
      );
    });

    test("sends correct response when user is updated", async () => {
      const expected = {
        status: 200,
        data: {
          name: "Adam"
        }
      };
      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ name: "Adam" })
      );

      const response = await controller.userUpdate(args);

      expect(response).toEqual(expected);
    });

    test("sends correct response when user is not updated", async () => {
      const response = await controller.userUpdate(args);

      expect(response).toEqual({ status: 200 });
    });
  });

  describe("searchEmail test", () => {
    test("finds users friends", async () => {
      await controller.searchEmail("asd@asd.com");

      expect(userService.get).toHaveBeenCalledWith(
        { email: /asd@asd.com/g },
        "_id email name"
      );
    });

    test("sends correct search response", async () => {
      const response = await controller.searchEmail("asd@asd.com");

      expect(response).toEqual([{ a: "a" }, { b: "b" }]);
    });
  });
});
