import { defaultState } from "../user/state";
import store from "../index";

// let store;

beforeEach(() => {
  store.commit("user/RESET_STATE");
});

describe("user", () => {
  describe("state", () => {
    test("should match schema", () => {
      const schema = defaultState();
      expect(store.state.user).toEqual(schema);
    });
  });

  describe("mutations", () => {
    describe("RESET_STATE", () => {
      test("should reset the state to default", () => {
        store.commit("user/RESET_STATE");

        expect(store.state.user).toEqual(defaultState());
      });
    });

    describe("SET_USER", () => {
      test("should set the user", () => {
        const user = {
          name: "John",
          email: "john@doe.com"
        };
        store.commit("user/SET_USER", user);

        expect(store.state.user).toMatchObject(user);
      });
    });
  });
});
