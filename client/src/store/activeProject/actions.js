import projectFactory from '../../classes/ProjectFactory';

const fetchProject = http => async ({ commit, dispatch }, { token, id }) => {
  try {
    const { data } = await http.projects.fetchActiveProject(token, id);
    const project = projectFactory.create(data.type, data);

    commit('SET_PROJECT', project);
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
