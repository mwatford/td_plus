const ProjectService = require("../project/ProjectService");

describe("projectService test", () => {
  test("has a module", () => {
    expect(ProjectService).toBeDefined();
  });

  String.prototype.equals = function(x) {
    return this === x;
  };

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

  describe("isMember", () => {
    const projectService = ProjectService({});

    const mockProject = {
      members: ["1234", "1445", "1355"]
    };

    test("should return true if members list contains the user", () => {
      const response = projectService.isMember(mockProject, "1234");

      expect(response).toEqual(true);
    });

    test("returns false when user is not in member list", () => {
      const response = projectService.isMember(mockProject, "3333");

      expect(response).toEqual(false);
    });

    test("throws an error when parameters are not passed", () => {
      expect(() => {
        projectService.isMember(mockProject);
      }).toThrow("Missing function argument(s)!");

      expect(() => {
        projectService.isMember(null, "1234");
      }).toThrow("Missing function argument(s)!");
    });
  });

  describe("isAdmin", () => {
    const projectService = ProjectService({});

    test("throws an error when arguments are missing", () => {
      expect(() => {
        projectService.isAdmin(null, "1234");
      }).toThrow("Missing function argument(s)!");
    });

    test("returns bolean", () => {
      const mockProject = {
        admin: "123"
      };
      const response = projectService.isAdmin(mockProject, "123");
      const fail = projectService.isAdmin(mockProject, "1234");

      expect(response).toBeTruthy();
      expect(fail).toBeFalsy();
    });
  });

  describe("addMember test", () => {
    const projectService = ProjectService({});
    const save = jest.fn();
    const mockProject = {
      members: [],
      save: function() {
        save();
        return this;
      }
    };

    test("adds member to a project", () => {
      const updatedProject = projectService.addMember(mockProject, "44335");

      const expected = updatedProject.members.find(el => el === "44335");

      expect(save).toHaveBeenCalled();
      expect(expected).toBeTruthy();
    });
  });

  describe("deleteProject", () => {
    const findByIdAndRemove = jest.fn((id, cb) => {
      cb();
    });

    const MockModel = {
      findByIdAndRemove
    };

    const projectService = ProjectService(MockModel);

    test("throws error when arguments are missing", async () => {
      await expect(projectService.deleteProject()).rejects.toThrow(
        "Missing argument!"
      );
    });

    test("deletes a project", async () => {
      const cb = jest.fn();

      await projectService.deleteProject("1234", cb);

      expect(findByIdAndRemove).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(findByIdAndRemove).toHaveBeenCalledWith("1234", cb);
    });
  });
});
