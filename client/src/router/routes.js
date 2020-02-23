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
    path: "/project/:id",
    component: View,
    children: [
      {
        path: "",
        component: Project,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "manage",
        name: "manage",
        props: true,
        component: ProjectManage,
        meta: {
          requiresAuth: true
        }
      }
    ]
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
