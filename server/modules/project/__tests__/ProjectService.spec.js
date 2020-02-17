const ProjectService = require("../ProjectService");

describe("projectService test", () => {
  test("has a module", () => {
    expect(ProjectService).toBeDefined();
  });

  describe("createProject test", () => {
    const save = jest.fn();
    let admin;

    const MockModel = function(data) {
      admin = data.admin;

      return {
        ...data,
        save
      };
    };

    const projectService = ProjectService(MockModel);

    const project = {
      admin: "1234"
    };

    projectService.createProject(project);

    test("creates a project", () => {
      expect(save).toHaveBeenCalled();
      expect(admin).toEqual("1234");
    });

    test("throws error when data is not defined", () => {
      expect(() => {
        projectService.createProject();
      }).toThrow("Data was not passed!");
    });
  });

  describe("find test", () => {
    const findById = jest.fn();
    const MockModel = {
      findById
    };

    const projectService = ProjectService(MockModel);

    test("finds a single project with provided id", () => {
      projectService.find("1232");

      expect(MockModel.findById).toHaveBeenCalledTimes(1);
      expect(MockModel.findById).toHaveBeenCalledWith("1232");
    });

    test("throws error when id is not passed", () => {
      expect(() => {
        projectService.find();
      }).toThrow("Id was not provided!");
    });
  });

  describe("authenticate", () => {
    const projectService = ProjectService({});
    const mockProject = {
      members: ["1234", "1445", "1355"]
    };

    test("should return true if members list contains the user", () => {
      const response = projectService.authenticate(mockProject, "1234");

      expect(response).toEqual(true);
    });

    test("returns false when user is not in member list", () => {
      const response = projectService.authenticate(mockProject, "3333");

      expect(response).toEqual(false);
    });

    test("throws an error when parameters are not passed", () => {
      expect(() => {
        projectService.authenticate(mockProject);
      }).toThrow("argument was not passed: userId");

      expect(() => {
        projectService.authenticate(null, "1234");
      }).toThrow("argument was not passed: project");
    });
  });

  describe("addMember test", () => {
    const projectService = ProjectService({});
    const mockProject = {
      members: [],
      admin: "1234",
      save: function() {
        return this;
      }
    };

    test("adds member if user is an admin", () => {
      const updatedProject = projectService.addMember(
        mockProject,
        "1234",
        "44335"
      );

      const expected = updatedProject.members.find(el => el === "44335");

      expect(expected).toBeTruthy();
    });

    test("throws error if user is not project admin", () => {
      expect(() => {
        projectService.addMember(mockProject, "1333", "3324");
      }).toThrow("Unauthorized");
    });
  });
});
