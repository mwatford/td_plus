import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Project from "../views/Project/Project.vue";
import View from "../views/Project/View.vue";
import ProjectManage from "../views/Project/ProjectManage.vue";
import Start from "../views/Start.vue";
import Create from "../views/Create.vue";

export default [
  {
    name: "home",
    path: "/",
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    name: "create",
    path: "/create",
    component: Create,
    meta: {
      requiresAuth: false
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
    path: "/project/:id",
    name: "project",
    component: View,
    meta: {
      requiresAuth: false
    }
  },
  // children: [
  //   {
  //     path: "",
  //     component: Project,
  // {
  //   path: "manage",
  //   name: "manage",
  //   props: true,
  //   component: ProjectManage,
  //   meta: {
  //     requiresAuth: true
  //   }
  // }
  // ]

  {
    name: "start",
    path: "/start",
    component: Start,
    meta: {
      guest: true
    }
  }
];
