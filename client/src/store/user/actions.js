export const actions = requestModule => {
  return {
    fetchUser({ commit }, token) {
      return requestModule({
        method: "get",
        url: "/api/users/current",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    },
    resetState({ commit }) {
      commit("RESET_STATE");
    },
    logout({ commit }) {
      commit("RESET_STATE");
    },
    save({ commit }, { user, token }) {
      return requestModule({
        method: "put",
        url: "/api/users/current/update",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          user
        }
      });
    }
  };
};
