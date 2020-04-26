import { defaultState } from './state';

export const mutations = {
  SET_PROJECT(state, project) {
    state.data = project;
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState());
  },
  FILTER(state) {
    state.filter = !state.filter;
  },
  UPDATE_LIST_NAME(state, { index, name }) {
    state.data.lists[index].name = name;
  },
  ADD_LIST(state, list) {
    state.data.lists.push(list);
  },
  ADD_TASK(state, task) {
    state.data.lists[0].data.push(task);
  },
  DELETE_LIST(state, index) {
    state.data.lists.splice(index, 1);
  },
  ADD_MEMBER(state, user) {
    state.data.members.push(user);
  },
  REMOVE_MEMBER(state, index) {
    state.data.members.splice(index, 1);
  },
};
