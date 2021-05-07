export const actions = requestModule => {
  return {
    login({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST')
        requestModule({
          method: 'POST',
          url: '/api/users/login/local',
          data: user,
        })
          .then(response => {
            const token = response.data.token
            commit('AUTH_SUCCESS', token)
            resolve(response.data)
          })
          .catch(err => {
            commit('AUTH_ERROR', err)
            reject(err)
          })
      })
    },
    logout({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        commit('AUTH_LOGOUT')
        resolve()
      })
    },
  }
}
