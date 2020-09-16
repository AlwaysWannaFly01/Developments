import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import List from '@/views/List'
import History from '@/views/History'
import Appraisal from '@/views/Appraisal'
Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/',
		},
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
			path: '/history/:id',
			name: 'History',
			component: History
		},
		{
			path: '/appraisal',
			name: 'Appraisal',
			component: Appraisal
		}
	]
})
