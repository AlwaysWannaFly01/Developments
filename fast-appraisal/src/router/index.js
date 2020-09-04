import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import List from '@/views/List'
Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/list',
			name: 'List',
			component: List
		}
	]
})
