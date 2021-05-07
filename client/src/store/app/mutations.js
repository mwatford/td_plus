import { defaultState } from './state'

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, defaultState())
  },
  TOGGLE_PROJECTS(state) {
    state.projects = !state.projects
  },
  TOGGLE_TIMELINE(state) {
    state.timeline = !state.timeline
  },
  TOGGLE_ANIMATIONS(state) {
    state.animations = !state.animations
  },
}
