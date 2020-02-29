const Controller = require("../projects/controller");
const userService = require("userService");
const projectService = require("projectService");
const { ProjectService } = require("projectService");

const services = {
  userService,
  projectService
};

const controller = Controller(services);

describe("project controller", () => {
  test("is defined", () => {
    expect(Controller).toBeDefined();
  });

  const projects = ["123", "1332"];

  userService.find.mockImplementation(() =>
    Promise.resolve({ name: "Adam", _id: "test id", projects })
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create test", () => {
    test("searches for a user", async () => {
      const project = {
        members: ["111"],
        name: "asd"
      };
      await controller.create({ sub: "123", project });

      expect(userService.find).toHaveBeenCalledWith("123");
    });

    test("creates a project", async () => {
      const project = {
        members: ["111"],
        name: "asd"
      };
      const expected = {
        members: ["test id", "111"],
        name: "asd",
        admin: "test id"
      };

      await controller.create({ sub: "123", project });

      expect(projectService.createProject).toHaveBeenCalledWith(expected);
    });

    test("updates users in project", async () => {
      const project = {
        members: ["123"],
        name: "asd"
      };
      await controller.create({ sub: "123", project });

      expect(userService.updateUsers.mock.calls[0][0]).toEqual(project.members);
    });

    test("returns object when created", async () => {
      const project = {
        members: ["111"],
        name: "asd"
      };
      const expected = {
        data: {
          members: ["123"],
          name: "asd"
        },
        status: 201
      };

      const response = await controller.create({ sub: "123", project });

      expect(response).toEqual(expected);
    });
  });

  describe("getUserProjects test", () => {
    test("searches for a user", async () => {
      await controller.getUserProjects({ sub: "1332" });

      expect(userService.find).toHaveBeenCalledWith("1332");
    });

    test("finds and returns user's projects", async () => {
      userService.find.mockImplementationOnce(() =>
        Promise.resolve({ projects })
      );
      const expected = { status: 200, data: ["test"] };

      const response = await controller.getUserProjects("1234");

      expect(projectService.findMany).toHaveBeenCalledWith(projects);
      expect(response).toEqual(expected);
    });
  });

  describe("getProject test", () => {
    test("searches for a user", async () => {
      await controller.getProject({ sub: "test sub", id: "13345" });

      expect(userService.find).toHaveBeenCalledWith("test sub");
    });

    test("searches for a project", async () => {
      await controller.getProject({ sub: "test sub", id: "13345" });

      expect(projectService.find).toHaveBeenCalledWith("13345");
    });

    test("checks if client can get the data", async () => {
      await controller.getProject({ sub: "test sub", id: "13345" });

      expect(projectService.isMember).toHaveBeenCalledWith(
        { name: "asd" },
        "test id"
      );
    });

    test("returns project with code 200 if client can get data", async () => {
      projectService.isMember.mockImplementationOnce(() =>
        Promise.resolve(true)
      );
      const expected = {
        status: 200,
        data: {
          name: "asd"
        }
      };

      const response = await controller.getProject({
        sub: "test sub",
        id: "13345"
      });

      expect(response).toEqual(expected);
    });

    test("returns object with status 403 if client can not get the data", async () => {
      projectService.isMember.mockImplementationOnce(() =>
        Promise.resolve(false)
      );
      const expected = {
        status: 403
      };

      const response = await controller.getProject({
        sub: "test sub",
        id: "13345"
      });

      expect(response).toEqual(expected);
    });
  });

  describe("isAdmin test", () => {
    test("searches for a user", async () => {
      await controller.isAdmin({ sub: "test id" });

      expect(userService.find).toHaveBeenCalledWith("test id");
    });

    test("searches for a project", async () => {
      await controller.isAdmin({ sub: "test id", id: "test projectId" });

      expect(projectService.find).toHaveBeenCalledWith("test projectId");
    });

    test("checks if client is project admin", async () => {
      const project = "mock project";
      projectService.find.mockImplementationOnce(() =>
        Promise.resolve(project)
      );

      await controller.isAdmin({ sub: "test ido", id: "test projectId" });

      expect(projectService.isAdmin).toHaveBeenCalledWith(project, "test id");
    });

    test("returns object with status 200 if client is admin", async () => {
      const expected = { status: 200 };
      projectService.isAdmin.mockImplementationOnce(() => true);

      const response = await controller.isAdmin({
        sub: "test id",
        id: "test projectId"
      });

      expect(response).toEqual(expected);
    });

    test("returns object with status 403 if client is not admin", async () => {
      const expected = { status: 403 };
      projectService.isAdmin.mockImplementationOnce(() => false);

      const response = await controller.isAdmin({
        sub: "test id",
        id: "test projectId"
      });

      expect(response).toEqual(expected);
    });
  });

  describe("deleteProject test", () => {
    test("searches for a user", async () => {
      await controller.deleteProject({ sub: "test" });

      expect(userService.find).toHaveBeenCalledWith("test");
    });

    test("searches for a project", async () => {
      await controller.deleteProject({ sub: "test", id: "project id" });

      expect(projectService.find).toHaveBeenCalledWith("project id");
    });

    test("calls isAdmin method", async () => {
      await controller.deleteProject({ sub: "test", id: "project id" });

      expect(projectService.isAdmin).toHaveBeenCalledWith(
        { name: "asd" },
        "test id"
      );
    });

    describe("if client is an admin", () => {
      test("deletes a project", async () => {
        projectService.isAdmin.mockResolvedValueOnce(true);
        const spy = jest.spyOn(projectService, "delete");

        await controller.deleteProject({ sub: "test", id: "project id" });

        expect(spy).toHaveBeenCalled();
      });

      test("returns status 200", async () => {
        projectService.isAdmin.mockResolvedValueOnce(true);

        const response = await controller.deleteProject({
          sub: "test",
          id: "project id"
        });

        expect(response).toEqual({ status: 200 });
      });
    });

    describe("if client is not an admin", () => {
      test("returns status 403", async () => {
        projectService.isAdmin.mockImplementation(() => Promise.resolve(false));

        const response = await controller.deleteProject({
          sub: "123",
          id: "123"
        });

        expect(response).toEqual({ status: 403 });
      });
    });
  });
});
