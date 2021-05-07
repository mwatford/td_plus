import Home from 'Views/Home.vue'
import Profile from 'Views/Profile.vue'
import View from 'Views/Project/View.vue'
import Start from 'Views/Start.vue'
import Create from 'Views/Create.vue'

export default [
  {
    name: 'home',
    path: '/',
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: 'create',
    path: '/create',
    component: Create,
    meta: {
      requiresAuth: false,
    },
  },
  {
    name: 'profile',
    path: '/profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/project/:id',
    name: 'project',
    component: View,
    meta: {
      requiresAuth: false,
    },
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
    name: 'start',
    path: '/start',
    component: Start,
    meta: {
      guest: true,
    },
  },
]
