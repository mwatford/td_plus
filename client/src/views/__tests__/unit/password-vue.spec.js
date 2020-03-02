import Component from "../../Project/password.vue";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import activeProject from "activeProject";
import user from "user";

let localVue = createLocalVue();

describe("Component", () => {
  const wrapper = shallowMount(Component, {
    localVue,
    computed: {
      project: () => activeProject,
      user: () => user
    }
  });

  test("is vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe("renders", () => {
    test("correct project name", () => {
      const actual = wrapper.find("h3");
      expect(actual.text()).toEqual("project name");
    });
  });
});

describe("methods", () => {
  const compare = jest.fn();
  const $emit = jest.fn();

  const wrapper = shallowMount(Component, {
    localVue,
    mocks: {
      $eventBus: {
        $emit
      }
    },
    computed: {
      project: () => activeProject,
      user: () => user
    },
    methods: {
      comparePasswords: compare
    }
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("comparePasswords", () => {
    wrapper.setData({ password: "test password" });

    test("gets called on form submit", () => {
      wrapper.find("form").trigger("submit");

      expect(compare).toHaveBeenCalled();
    });

    test("gets called with correct arguments", () => {
      expect(compare).toHaveBeenCalledWith("test password", "project password");
    });

    test("emits event if passwords match", () => {
      compare.mockImplementationOnce(() => true);

      wrapper.find("form").trigger("submit");

      expect($emit).toHaveBeenCalledWith("correct password");
    });
  });
});
