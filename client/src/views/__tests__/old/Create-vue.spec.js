import Component from "../../Create.vue";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import suggestions from "create/suggestions";
import store from "../../../store/index";

import user from "user";

let localVue = createLocalVue();

const boxEnterAnimation = jest.fn(() => Promise.resolve());
const boxLeaveAnimation = jest.fn(() => Promise.resolve());

const factory = overwrites => {
  const options = {
    localVue,
    computed: {
      user: () => user,
      token: () => "test token"
    },
    methods: {
      boxEnterAnimation,
      boxLeaveAnimation
    }
  };
  if (overwrites) Object.assign(options, overwrites);
  return shallowMount(Component, options);
};

describe("Component", () => {
  test("is vue instance", () => {
    const wrapper = factory();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe("renders", () => {
    describe("suggestion list", () => {
      const wrapper = factory({
        computed: {
          suggestions: () => suggestions
        }
      });

      beforeAll(() => {
        jest.clearAllMocks();
      });

      test("if suggestions returns a value", () => {
        const actual = wrapper.find({ ref: "suggestions" }).exists();

        expect(actual).toBeTruthy();
      });

      test("with correct suggestions", () => {
        const actual = wrapper.find({ ref: "suggestions" }).findAll("li");

        expect(actual.length).toEqual(2);
        expect(
          actual
            .at(0)
            .find("h4")
            .text()
        ).toEqual("suggestion name");

        expect(
          actual
            .at(0)
            .find("h5")
            .text()
        ).toEqual("suggestion email");
      });
    });

    describe("members list", () => {
      const wrapper = factory();
      wrapper.setData({ memberList: suggestions });

      test("if members contains items", () => {
        const actual = wrapper.find({ ref: "members" });

        expect(actual.exists()).toBe(true);
      });

      test("with correct items", () => {
        const actual = wrapper.find({
          ref: "members"
        });

        expect(
          actual
            .findAll("h4")
            .at(0)
            .text()
        ).toEqual("suggestion name");

        expect(
          actual
            .findAll("h5")
            .at(0)
            .text()
        ).toEqual("suggestion email");
      });
    });
  });

  describe("methods", () => {
    const wrapper = factory({
      computed: {
        suggestions: () => suggestions
      }
    });
    describe("addUser", () => {
      test("adds user to project.members and memberList", () => {
        wrapper
          .find({ ref: "suggestions" })
          .findAll("li")
          .at(1)
          .trigger("click");

        expect(wrapper.vm.project.members.indexOf(suggestions[1]._id)).toEqual(
          0
        );
        expect(wrapper.vm.memberList.indexOf(suggestions[1])).toEqual(0);
      });
    });

    describe("removeUser", () => {
      test("removes user from memberList and project.members", () => {
        wrapper.setData({ memberList: [{ _id: "133" }, { _id: "122" }] });
        wrapper.setData({
          project: {
            members: ["133", "122"]
          }
        });

        wrapper.vm.removeUser(1);

        expect(wrapper.vm.memberList).toEqual([{ _id: "133" }]);
        expect(wrapper.vm.project.members).toEqual(["133"]);
      });
    });

    describe("create", () => {
      describe("methods get called depending on component state", () => {
        const request = jest.fn(() => Promise.resolve());
        const updateUser = jest.fn(() => Promise.resolve());
        const navigate = jest.fn();
        const hashPassword = jest.fn(() => Promise.resolve("hashed password"));
        const wrapper = factory();

        beforeEach(() => {
          jest.clearAllMocks();
          wrapper.setMethods({
            hashPassword,
            request,
            updateUser,
            navigate
          });
        });

        test("hashPassword does not get called if no password", done => {
          wrapper.setData({ password: "" });

          wrapper.vm.create().then(() => {
            expect(hashPassword).not.toHaveBeenCalled();
            done();
          });
        });

        test("hashPassword gets called and sets a project.password if password", async () => {
          wrapper.setData({ password: "test password" });

          await wrapper.vm.create();

          expect(hashPassword).toHaveBeenCalledWith("test password");
          expect(wrapper.vm.project.password).toEqual("hashed password");
        });

        test("request gets called", async () => {
          await wrapper.vm.create();

          expect(request).toHaveBeenCalledTimes(1);
        });

        test("updateUser gets called", async () => {
          await wrapper.vm.create();

          expect(updateUser).toHaveBeenCalled();
        });

        test("navigate gets called", async () => {
          await wrapper.vm.create();

          expect(navigate).toHaveBeenCalledWith({ name: "home" });
        });
      });

      describe("updateUser", () => {
        const dispatch = jest.fn();
        store.dispatch = dispatch;
        const wrapper = factory({ store });

        test("dispatches store action", () => {
          wrapper.vm.updateUser();

          expect(dispatch).toHaveBeenCalledWith("user/fetchUser", {
            token: "test token",
            email: "test user email"
          });
        });
      });

      describe("request", () => {
        const $http = jest.fn();
        const wrapper = factory({
          mocks: {
            $http
          }
        });

        test("calls $http with correct argument", () => {
          const project = {
            name: wrapper.vm.project.name,
            password: wrapper.vm.project.password,
            members: wrapper.vm.project.members,
            lists: wrapper.vm.project.lists
          };

          const expected = {
            method: "post",
            url: "/api/projects/create",
            headers: {
              Authorization: `Bearer test token`,
              "Content-Type": "application/json"
            },
            data: {
              email: "test user email",
              project: project
            }
          };

          wrapper.vm.request();

          expect($http).toHaveBeenCalledWith(expected);
        });
      });

      describe("fetchUsers", () => {
        const $http = jest.fn(() =>
          Promise.resolve({ data: ["http response"] })
        );
        const wrapper = factory({
          mocks: { $http }
        });

        test("calls $http with correct argument", () => {
          const expected = {
            method: "get",
            url: `/api/users/search/test user`,
            headers: {
              Authorization: `Bearer test token`,
              "Content-Type": "application/json"
            }
          };

          wrapper.vm.fetchUsers("test user");

          expect($http).toHaveBeenCalledWith(expected);
        });

        test("sets responseList to response data", async () => {
          await wrapper.vm.fetchUsers("test user");

          expect(wrapper.vm.responseList[0]).toEqual("http response");
        });
      });
    });
  });
});

describe("UI interactions", () => {
  const methods = {
    create: jest.fn(),
    removeUser: jest.fn(),
    addUser: jest.fn(),
    navigate: jest.fn(),
    fetchUsers: jest.fn()
  };

  const wrapper = factory();

  wrapper.setMethods(methods);

  beforeAll(() => {
    jest.clearAllMocks();
    wrapper.setData({ memberList: suggestions });
  });

  test("create method gets called on form submit", () => {
    wrapper.find("form").trigger("submit");

    expect(methods.create).toHaveBeenCalled();
  });

  test("addUser gets called on li click", () => {
    const asd = factory({ computed: { suggestions: () => suggestions } });
    asd.setMethods(methods);

    asd
      .find({ ref: "suggestions" })
      .find("li")
      .trigger("click");

    expect(methods.addUser).toHaveBeenCalledTimes(1);
  });

  test("removeUser gets called on li click", () => {
    wrapper
      .find({ ref: "members" })
      .find("li")
      .trigger("click");

    expect(methods.removeUser).toHaveBeenCalled();
  });

  test("navigate gets called on button click", () => {
    wrapper
      .find("form")
      .findAll(".button")
      .at(1)
      .trigger("click");

    expect(methods.navigate).toHaveBeenCalledTimes(1);
    expect(methods.navigate).toHaveBeenCalledWith(-1);
  });

  test("calls fetchUsers if search is more than 3 letters", async () => {
    wrapper.find("[data-search]").setValue("test");

    await wrapper.vm.$nextTick();

    expect(methods.fetchUsers).toHaveBeenCalledWith("test");
  });
});

describe("lifecycle hooks", () => {
  describe("mounted", () => {
    test("boxEnterAnimation gets called", () => {
      const wrapper = factory();

      expect(boxEnterAnimation).toHaveBeenCalled();
    });
  });
});
