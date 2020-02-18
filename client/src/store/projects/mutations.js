import { defaultState } from "./state";

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.data = projects;
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  }
};
