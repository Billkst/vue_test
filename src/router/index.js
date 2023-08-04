import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/login/login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/register/register.vue"),
  },
  {
    path: "/background",
    name: "background",
    component: () => import("../views/background/background.vue"),
    children: [], //后台管理页面中所有菜单路由及显示内容，都在 background.vue 的模板中加载，所以放在了子路由中定义
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
