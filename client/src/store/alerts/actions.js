export const actions = {
  display({ commit }, alert) {
    commit("ADD", alert);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2500);
    }).then(() => {
      commit("REMOVE", alert);
    });
  }
};
