export const actions = requestModule => {
  return {
    fetchUser({ commit }, { token, email }) {
      return requestModule({
        method: "post",
        url: "/api/users/current",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          email
        }
      }).then(response => {
        commit("SET_USER", response.data);
      });
    },
    resetState({ commit }) {
      commit("RESET_STATE");
    },
    logout({ commit }) {
      commit("RESET_STATE");
    },
    save({ commit }, { changes, token }) {
      return requestModule({
        method: "put",
        url: "/api/users/current/update",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          changes
        }
      });
    }
  };
};
