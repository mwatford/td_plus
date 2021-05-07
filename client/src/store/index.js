import Vue from 'vue'
import Vuex from 'vuex'
import user from './user/index'
import app from './app/index'
import alerts from './alerts/index'
import auth from './auth/index'
import projects from './projects/index'
import activeProject from './activeProject/index'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    user,
    app,
    alerts,
    auth,
    projects,
    activeProject,
  },
})
