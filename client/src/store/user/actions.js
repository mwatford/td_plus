export const actions = requestModule => {
  return {
    fetchUser({ commit }) {
      requestModule.get("/api/current_user").then(user => {
        commit("SET_USER", user);
      });
    },
    resetState({ commit }) {
      commit("RESET_STATE");
    }
  };
};
