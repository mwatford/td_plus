export const actions = {
  display({ commit }, alert) {
    commit("ADD", alert);

    setTimeout(() => {
      commit("REMOVE", alert);
    }, 2500);
  }
};
