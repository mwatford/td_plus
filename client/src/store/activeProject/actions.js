const fetchProject = http => async ({ commit, dispatch }, { token, id }) => {
  try {
    const { data } = await http.projects.fetchActiveProject(token, id);

    commit('SET_PROJECT', data);
  } catch (e) {
    dispatch(
      'alerts/display',
      {
        type: 'error',
        message: e || 'Cannot access this resource.',
      },
      { root: true }
    );
  }
};

export const actions = http => ({
  fetchProject: fetchProject(http),
});
