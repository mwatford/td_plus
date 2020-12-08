import { defaultState } from "./state";

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.data = projects;
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  },
  REMOVE(state, index) {
    state.data.splice(index, 1);
  }
};
