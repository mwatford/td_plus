export const actions = requestModule => {
  return {
    fetchUser({ commit, dispatch }, { token, email }) {
      return requestModule({
        method: 'post',
        url: '/api/users/current',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          email,
        },
      })
        .then(({ data }) => {
          if (data.message)
            dispatch('alerts/display', data.message, { root: true });
          if (data.user) {
            commit('SET_USER', data.user);
          }
        })
        .catch(({ response }) => {
          const { data } = response;
          if (data.message)
            dispatch('alerts/display', data.message, { root: true });
        });
    },
    resetState({ commit }) {
      commit('RESET_STATE');
    },
    logout({ commit }) {
      commit('RESET_STATE');
    },
    save({ commit }, { changes, token, id }) {
      return requestModule({
        method: 'put',
        url: `/api/users/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          changes,
        },
      });
    },
  };
};
