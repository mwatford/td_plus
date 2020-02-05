import Vue from "vue";
import Vuex from "vuex";
import user from "./user/index";

Vue.use(Vuex);

export const moduleMocker = (module, name) => {
  return new Vuex.Store({
    modules: {
      [name]: module
    }
  });
};

export default new Vuex.Store({
  strict: true,
  modules: {
    user
  }
});
