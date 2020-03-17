import { defaultState } from "../alerts/state";
import store from "../index";
import { actions } from "../alerts/actions";

beforeEach(done => {
  store.commit("alerts/RESET_STATE");
  done();
});

// beforeAll(done => {
//   store.commit("alerts/RESET_STATE");
//   done();
// });

describe("alerts", () => {
  describe("state", () => {
    test("should match schema", () => {
      const schema = defaultState();
      expect(store.state.alerts).toEqual(schema);
    });
  });

  describe("mutations", () => {
    describe("ADD", () => {
      test("should add an alert to state", () => {
        const alert = "test message";
        store.commit("alerts/ADD", alert);

        expect(store.state.alerts.content.length).toEqual(1);
      });
    });

    describe("RESET_STATE", () => {
      test("should reset the state to default", () => {
        store.commit("alerts/RESET_STATE");

        expect(store.state.alerts).toEqual(defaultState());
      });
    });

    describe("REMOVE", () => {
      test("should remove alert", () => {
        const alert = {
          message: "123",
          type: "error"
        };

        store.commit("alerts/ADD", alert);
        expect(store.state.alerts.content[0]).toBe(alert);
        store.commit("alerts/REMOVE", alert);
        expect(store.state.alerts.content[0]).toBeFalsy();
      });
    });
  });

  describe("actions", () => {
    describe("display", () => {
      test("should call ADD and REMOVE methods", done => {
        const alert = {
          message: "alert test message",
          type: "error"
        };
        store.dispatch("alerts/display", alert).then(() => {
          expect(store.state.alerts.content.length).toEqual(0);
          done();
        });
        expect(store.state.alerts.content[0]).toBe(alert);
      });
    });
  });
});
