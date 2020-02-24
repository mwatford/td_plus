const Controller = require("../users/controller");

describe("user controller", () => {
  test("has a module", () => {
    expect(Controller).toBeDefined();
  });

  let userService, currentUser, services, find, createUser;

  beforeEach(() => {
    currentUser = jest.fn();
    createUser = jest.fn(profile => {
      return { email: profile.email, sub: profile.sub };
    });
    find = jest.fn(sub => {
      if (sub === "1234") return { name: "Adam" };
    });

    userService = {
      createUser,
      currentUser,
      find
    };

    services = {
      userService
    };
  });

  describe("currentUser test", () => {
    test("searches for a user", () => {
      const controller = Controller(services);
      const req = {
        user: {
          sub: "123"
        }
      };

      controller.currentUser(req, {});

      expect(find).toHaveBeenCalledWith("123");
    });

    test("sends user if user was found", async () => {
      const send = jest.fn();
      const controller = Controller(services);
      const mockUser = {
        sub: "1234"
      };

      const req = {
        user: mockUser
      };

      const res = {
        send
      };

      await controller.currentUser(req, res);

      expect(send).toHaveBeenCalledWith({ name: "Adam" });
    });

    test("creates a user if user was not found", async () => {
      const send = jest.fn();
      const controller = Controller(services);
      const mockUser = {
        sub: "123"
      };

      const req = {
        user: mockUser,
        body: {
          email: "asd@asd.com"
        }
      };

      const res = {
        send
      };

      await controller.currentUser(req, res);

      expect(send).toHaveBeenCalledWith({ email: "asd@asd.com" });
    });

    test("sends an response with code 500 if error was found", () => {
      const sendStatus = jest.fn();
      services = {
        userService: {
          find: () => {
            throw new Error("error");
          }
        }
      };
      const controller = Controller(services);

      const mockUser = {
        sub: "123"
      };

      const req = {
        user: mockUser,
        body: {
          email: "asd@asd.com"
        }
      };

      const res = {
        sendStatus
      };

      controller.currentUser(req, res);

      expect(sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
