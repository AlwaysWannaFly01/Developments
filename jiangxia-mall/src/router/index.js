import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index/index'

Vue.use(Router)


export default new Router({
	routes: [
		{
			path: '*',
			redirect: '/',
		},
		{
			path: '/',
			name: 'Index',
			component: Index
		},
	]
})
