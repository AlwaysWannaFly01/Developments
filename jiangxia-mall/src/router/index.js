import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index/index'
import Category from '@/views/category/category'
import Live from '@/views/live/live'
import Shop from '@/views/shop/shop'
import My from '@/views/my/my'

Vue.use(Router)


export default new Router({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/index',
		},
		{
			path: '/index',
			name: 'Index',
			component: Index
		},
		{
			path: '/category',
			name: 'Category',
			component: Category
		},
		{
			path: '/live',
			name: 'Live',
			component: Live
		},
		{
			path: '/shop',
			name: 'Shop',
			component: Shop
		},
		{
			path: '/my',
			name: 'My',
			component: My
		},
	]
})
