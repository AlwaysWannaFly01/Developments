// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../src/assets/styles/global.scss'
import axios from 'axios'


Vue.config.productionTip = false
Vue.prototype.$axios = axios;

router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	// console.log(to)
	if (to.meta.title) {
		document.title = to.meta.title
	}
	next()
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {App},
	template: '<App/>'
})
