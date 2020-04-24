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
    updateProject({ commit, rootState }, project) {
      return requestModule({
        method: 'put',
        url: `/api/projects/${project._id}`,
        headers: {
          Authorization: `Bearer ${rootState.auth.token}`,
          'Content-Type': 'application/json',
        },
        data: {
          project,
        },
      }).then(({ data }) => commit('SET_PROJECT', data));
    },
  };
};
