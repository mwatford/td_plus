import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "../store";

import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "hash"
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    return authGuard(to, from, next);
  } else if (to.matched.some(record => record.meta.guest)) {
    if (store.state.auth.status) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next({ name: "start" });
  }
});

export default router;
