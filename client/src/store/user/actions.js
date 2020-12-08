const fetchUser = http => async ({ commit, dispatch }, { token }) => {
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
};

const save = http => async ({ commit, dispatch }, { changes, token }) => {
  try {
    const { data } = await http.projects.updateUser(token, changes);

    commit('SET_USER', data);
    dispatch(
      'alerts/display',
      { type: 'success', message: 'Your name has been set' },
      { root: true }
    );
  } catch (e) {
    dispatch('alerts/display', {
      type: 'success',
      message: e || 'Error setting your name',
    });
  }
};

export const actions = http => ({
  fetchUser: fetchUser(http),
  save: save(http),
});
