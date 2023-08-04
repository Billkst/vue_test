import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

Vue.config.productionTip = false;

//路由全局前置守卫，加载后端获取到的菜单路由，否则刷新一下就没有菜单了
let menus = JSON.parse(localStorage.getItem("menu_list")) || [];
menus.forEach((item) => {
	if (item.path != null) { //路径不为空
		const menu = {
			path: item.path,
			name: item.menuNameE,
			component: () => import(
				'./views/background/' +
				item.view
			)
		};
		router.addRoute('background', menu); //给系统主页左侧增加菜单
	}
})


//全局守卫
router.beforeEach((to, from, next) => {
  //未登录情况下，只允许访问登录和注册界面
  if (to.path == "/" || to.path == "/register") {
    next();
  } else {
    let token = localStorage.getItem("token");
    if (token == null || token == "") {
      //未登录，无法访问
      alert("无权限，请先登录");
      return next("/");
    } else {
      next();
    }
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
