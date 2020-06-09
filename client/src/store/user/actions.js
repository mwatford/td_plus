export const actions = http => {
  return {
    async fetchUser({ commit, dispatch }, { token }) {
      try {
        const { data } = await http.users.fetchUser(token);
        if (data.message) {
          dispatch('alerts/display', data.message, { root: true });
        }
        if (data.user) commit('SET_USER', data.user);
      } catch (error) {
        const { response } = error;
        const { data } = response;
        if (data.message) {
          dispatch('alerts/display', data.message, { root: true });
        }
      }
    },
    resetState({ commit }) {
      commit('RESET_STATE');
    },
    logout({ commit }) {
      commit('RESET_STATE');
    },
    // remove
    save({ commit }, { changes, token }) {
      return http.projects.updateUser({
        method: 'put',
        url: '/api/users/current',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: changes,
      });
    },
  };
};
