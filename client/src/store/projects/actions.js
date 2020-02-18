export const actions = requestModule => {
  return {
    fetchProjects({ commit }, { token, id }) {
      return requestModule({
        method: "get",
        url: `/api/projects/all/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }).then(response => {
        commit("SET_PROJECTS", response.data);
      });
    }
  };
};
