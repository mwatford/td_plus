import store from "../store/index";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Project from "../views/Project.vue";
import Start from "../views/Start.vue";
import Create from "../views/Create.vue";

export default [
  {
    name: "home",
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "create",
    path: "/create",
    component: Create,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "project",
    path: "/project/:id",
    params: true,
    component: Project,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: "start",
    path: "/start",
    component: Start,
    meta: {
      guest: true
    }
  }
];
