export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  AUTH_LOGOUT(state) {
    state.token = null
    state.status = null
  },
}
