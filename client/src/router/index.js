import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "../store";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "hash"
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.auth.status !== "success") {
      next({
        name: "start"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.state.auth.token) {
//       next({
//         name: "start"
//       });
//     } else {
//       next();
//     }
//   } else if (to.matched.some(record => record.meta.guest)) {
//     if (!store.state.auth.token) {
//       next();
//     } else {
//       next({ name: "home" });
//     }
//   } else {
//     next();
//   }
// });

export default router;
