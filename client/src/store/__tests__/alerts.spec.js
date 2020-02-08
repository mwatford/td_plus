import { defaultState } from "../alerts/state";
import store from "../index";

beforeEach(() => {
  store.commit("alerts/RESET_STATE");
});

describe("alerts", () => {
  describe("state", () => {
    test("should match schema", () => {
      const schema = defaultState();
      expect(store.state.alerts).toEqual(schema);
    });
  });
});
