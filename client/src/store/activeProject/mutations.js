import { defaultState } from './state';
import projectFactory from '../../classes/ProjectFactory';

export const mutations = {
  SET_PROJECT(state, data) {
    const project = projectFactory.create(data.type, data);
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
