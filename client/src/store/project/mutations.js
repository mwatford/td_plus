import { defaultState } from "./state";

export const mutations = {
  SET_PROJECT(state, project) {
    Object.assign(state, project);
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  }
};
