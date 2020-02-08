import { defaultState } from "./state";

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  }
};
