const Controller = require("../users/controller");

describe("user controller", () => {
  test("has a module", () => {
    expect(Controller).toBeDefined();
  });

  let userService, currentUser, services, find, createUser, updateUser, get;

  beforeEach(() => {
    currentUser = jest.fn();
    createUser = jest.fn(profile => {
      return { email: profile.email, sub: profile.sub };
    });
    find = jest.fn(sub => {
      if (sub === "1234") return { name: "Adam" };
    });
    updateUser = jest.fn((user, x) => {
      return user;
    });
    get = jest.fn((x, y) => [{ a: "a" }, { b: "b" }]);

    userService = {
      createUser,
      currentUser,
      find,
      updateUser,
      get
    };

    services = {
      userService
    };
  });

  describe("currentUser test", () => {
    test("searches for a user", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();

      const res = {
        send,
        sendStatus
      };

      const req = {
        user: {
          sub: "123"
        }
      };

      await controller.currentUser(req, res);

      expect(find).toHaveBeenCalledWith("123");
    });

    test("sends user if user was found", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();

      const res = {
        send,
        sendStatus
      };

      const mockUser = {
        sub: "1234"
      };

      const req = {
        user: mockUser
      };

      await controller.currentUser(req, res);

      expect(send).toHaveBeenCalledWith({ name: "Adam" });
    });

    test("creates a user if user was not found", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();

      const res = {
        send,
        sendStatus
      };
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

      expect(send).toHaveBeenCalledWith({ email: "asd@asd.com" });
    });

    test("sends a response with code 500 if error was found", () => {
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

  describe("userUpdate test", () => {
    const changes = {
      name: "Mike"
    };
    const req = {
      user: {
        sub: "1234"
      },
      body: {
        changes
      }
    };

    test("searches for a user", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();

      const res = {
        send,
        sendStatus
      };

      await controller.userUpdate(req, res);

      expect(find).toHaveBeenCalledWith("1234");
    });

    test("calls updateUser method", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();

      const res = {
        send,
        sendStatus
      };

      await controller.userUpdate(req, res);

      expect(updateUser).toHaveBeenCalledWith(
        { name: "Adam" },
        req.body.changes
      );
    });

    test("sends correct response when user is updated", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();

      const res = {
        send,
        sendStatus
      };

      await controller.userUpdate(req, res);

      expect(send).toHaveBeenCalledWith({
        message: "Your data has been updated",
        type: "success",
        updatedUser: {
          name: "Adam"
        }
      });
    });

    test("sends correct response when user is not updated", async () => {
      const controller = Controller(services);
      const send = jest.fn();
      const sendStatus = jest.fn();
      req.user.sub = "1332";

      const res = {
        send,
        sendStatus
      };

      await controller.userUpdate(req, res);

      expect(send).toHaveBeenCalledWith({
        message: "Something went wrong, try again later.",
        type: "error"
      });
    });

    test("sends a response with code 500 when error occurs", () => {
      const sendStatus = jest.fn();

      const controller = Controller(services);

      const res = {
        sendStatus
      };

      controller.userUpdate({}, res);

      expect(sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe("searchEmail test", () => {
    test("finds users friends", async () => {
      const controller = Controller(services);
      const req = {
        params: {
          email: "asd@asd.com"
        }
      };
      const send = jest.fn();
      const res = {
        send
      };

      await controller.searchEmail(req, res);

      expect(get).toHaveBeenCalledWith(
        { email: /asd@asd.com/g },
        "_id email name"
      );
    });

    test("sends correct search response", async () => {
      const controller = Controller(services);
      const req = {
        params: {
          email: "asd@asd.com"
        }
      };
      const send = jest.fn();
      const res = {
        send
      };

      await controller.searchEmail(req, res);

      expect(send).toHaveBeenCalledWith([{ a: "a" }, { b: "b" }]);
    });

    test("sends 500 response on error", async () => {
      const controller = Controller(services);
      const sendStatus = jest.fn();
      const res = {
        sendStatus
      };

      await controller.searchEmail({}, res);

      expect(sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
