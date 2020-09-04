import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import List from '@/views/List'
import History from '@/views/History'
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
		},
		{
			path: '/history',
			name: 'History',
			component: History
		}
	]
})
