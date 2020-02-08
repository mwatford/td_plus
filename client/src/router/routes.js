import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";

export default [
  { name: "home", path: "/", component: Home },
  {
    name: "register",
    path: "/register",
    component: Register
  },
  {
    name: "login",
    path: "/login",
    component: Login
  }
];
