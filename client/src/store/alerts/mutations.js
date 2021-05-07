import { defaultState } from './state'

export const mutations = {
  RESET_STATE(state) {
    Object.assign(state, defaultState())
  },
  ADD(state, alert) {
    state.content.push(alert)
  },
  REMOVE(state, alert) {
    const index = state.content.indexOf(alert)
    state.content.splice(index, 1)
  },
}
