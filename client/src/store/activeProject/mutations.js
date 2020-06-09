import { defaultState } from './state';

export const mutations = {
  SET_PROJECT(state, project) {
    state.data = project;
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  },
  UPDATE(state, { fn, data }) {
    fn.call(state.data, data);
  },
  FILTER(state) {
    state.filter = !state.filter;
  },
};
