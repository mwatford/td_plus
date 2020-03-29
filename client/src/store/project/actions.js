export const actions = requestModule => {
  return {
    fetchProject({ commit }, { id, token }) {
      return requestModule({
        method: "get",
        url: `/api/projects/active/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    }
  };
};
