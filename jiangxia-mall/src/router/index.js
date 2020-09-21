import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index/index'
import Category from '@/views/category/category'
import Live from '@/views/live/live'
import Shop from '@/views/shop/shop'
import My from '@/views/my/my'
import Order from '@/views/my/order'

Vue.use(Router)


export default new Router({
	routes: [
		{
			path: '*',
			redirect: '/index',
		},
		{
			path: '/index',
			name: 'Index',
			component: Index,
			meta:{
				title: '江夏优选'
			}
		},
		{
			path: '/category',
			name: 'Category',
			component: Category,
			meta:{
				title: '产品分类'
			}
		},
		{
			path: '/live',
			name: 'Live',
			component: Live,
			meta:{
				title: '直播'
			}
		},
		{
			path: '/shop',
			name: 'Shop',
			component: Shop,
			meta:{
				title: '购物车'
			}
		},
		{
			path: '/my',
			name: 'My',
			component: My,
			meta:{
				title: '个人中心'
			}
		},
		{
			path: '/order',
			name: 'Order',
			component: Order,
			meta:{
				title: '我的订单'
			}
		},
	]
})
