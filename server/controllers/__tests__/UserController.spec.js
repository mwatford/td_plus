const Controller = require("../users/controller");
const userService = require("userService");
const res = require("response");

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
      const req = {
        user: {
          sub: "123"
        }
      };

      await controller.currentUser(req, res);

      expect(userService.find).toHaveBeenCalledWith("123");
    });

    test("sends user if user was found", async () => {
      const mockUser = {
        sub: "1234"
      };

      const req = {
        user: mockUser
      };

      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ name: "Adam" })
      );

      await controller.currentUser(req, res);

      expect(res.send).toHaveBeenCalledWith({ name: "Adam" });
    });

    test("creates a user if user was not found", async () => {
      const mockUser = {
        sub: "123"
      };

      const req = {
        user: mockUser,
        body: {
          email: "asd@asd.com"
        }
      };

      await controller.currentUser(req, res);

      expect(userService.createUser).toHaveBeenCalled();

      expect(res.send).toHaveBeenCalledWith({ email: "asd@asd.com" });
    });

    test("sends a response with code 500 if error was found", async () => {
      await controller.currentUser({}, res);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("userUpdate test", () => {
    const req = {
      user: {
        sub: "1234"
      },
      body: {
        changes: {
          name: "Mike"
        }
      }
    };

    test("searches for a user", async () => {
      await controller.userUpdate(req, res);

      expect(userService.find).toHaveBeenCalledWith("1234");
    });

    test("calls updateUser method", async () => {
      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ name: "Adam" })
      );
      await controller.userUpdate(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(
        { name: "Adam" },
        req.body.changes
      );
    });

    test("sends correct response when user is updated", async () => {
      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ name: "Adam" })
      );
      await controller.userUpdate(req, res);

      expect(res.send).toHaveBeenCalledWith({
        message: "Your data has been updated",
        type: "success",
        updatedUser: {
          name: "Adam"
        }
      });
    });

    test("sends correct response when user is not updated", async () => {
      await controller.userUpdate(req, res);

      expect(res.send).toHaveBeenCalledWith({
        message: "Something went wrong, try again later.",
        type: "error"
      });
    });

    test("sends a response with code 500 when error occurs", () => {
      controller.userUpdate({}, res);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("searchEmail test", () => {
    test("finds users friends", async () => {
      const req = {
        params: {
          email: "asd@asd.com"
        }
      };

      await controller.searchEmail(req, res);

      expect(userService.get).toHaveBeenCalledWith(
        { email: /asd@asd.com/g },
        "_id email name"
      );
    });

    test("sends correct search response", async () => {
      const req = {
        params: {
          email: "asd@asd.com"
        }
      };
      await controller.searchEmail(req, res);

      expect(res.send).toHaveBeenCalledWith([{ a: "a" }, { b: "b" }]);
    });

    test("sends 500 response on error", async () => {
      await controller.searchEmail({}, res);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
