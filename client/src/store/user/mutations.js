import { defaultState } from './state'

export const mutations = {
  SET_USER(state, user) {
    Object.assign(state, user)
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState())
  },
}
