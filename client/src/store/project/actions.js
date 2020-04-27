export const actions = requestModule => {
  return {
    fetchProject({ commit }, { id, token }) {
      return requestModule({
        method: 'get',
        url: `/api/projects/active/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    updateProject({ commit, rootState }, { id, changes }) {
      return requestModule({
        method: 'put',
        url: `/api/projects/${id}`,
        headers: {
          Authorization: `Bearer ${rootState.auth.token}`,
          'Content-Type': 'application/json',
        },
        data: {
          project: changes,
        },
      }).then(({ data }) => commit('SET_PROJECT', data));
    },
    moveTask({ commit, rootState }, data) {
      const { value } = data;

      if (value === 1) {
        commit('COMPLETE_TASK', data);
      }
      if (value === -1) {
        commit('UNDO_TASK', data);
      }

      return Promise.resolve();
    },
    saveLocally({ rootState, state }, name) {
      const projects = rootState.projects;

      const project = projects.data.find(el => el.name === name);

      const index = rootState.projects.data.indexOf(project);

      projects.data[index] = project;

      localStorage.setItem('projects', JSON.stringify(projects.data));
    },
  };
};
