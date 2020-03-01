import Vue from "vue";
import Vuex from "vuex";
import user from "./user/index";
import app from "./app/index";
import alerts from "./alerts/index";
import auth from "./auth/index";
import projects from "./projects/index";
import activeProject from "./project/index";

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
    user,
    app,
    alerts,
    auth,
    projects,
    activeProject
  }
});
