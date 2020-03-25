import { defaultState } from "./state";

export const mutations = {
  SET_PROJECT(state, project) {
    Object.assign(state, project);
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  },
  FILTER(state) {
    state.filter = !state.filter;
  },
  UPDATE(state, data) {
    state.lists = data;
  }
};
