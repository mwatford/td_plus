export const actions = requestModule => {
  return {
    fetchUser({ commit }, token) {
      requestModule({
        method: "get",
        url: "/api/users/current",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          const user = response.data;
          commit("SET_USER", user);
        })
        .catch(err => {});
    },
    resetState({ commit }) {
      commit("RESET_STATE");
    },
    logout({ commit }) {
      commit("RESET_STATE");
      window.localStorage.removeItem("auth");
    }
  };
};
