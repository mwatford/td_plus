export const actions = requestModule => {
  return {
    fetchProject({ commit }, { project, token }) {
      return requestModule({
        method: "get",
        url: `/api/projects/${project._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    }
  };
};
