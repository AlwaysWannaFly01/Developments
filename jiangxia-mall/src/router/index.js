import Vue from "vue";
import Router from "vue-router";
import Index from "@/views/index/index";
import Category from "@/views/category/category";
import Live from "@/views/live/live";
import Shop from "@/views/shop/shop";
import My from "@/views/my/my";
import Order from "@/views/my/order";
import Culture from "@/views/index/culture";
import Healthy from "@/views/index/healthy";
import Science from "@/views/index/science";
import CompanyDetail from "@/views/index/companyDetail";
import Racking from "@/views/index/racking";
import Hot from "@/views/index/hot";
import Detail from "@/views/index/detail";
import ManageAddress from "@/views/my/manageAddress";
import AddAddress from "@/views/my/addAddress";
import GoodsList from "@/views/category/goodsList";
import SellerJoin from "@/views/my/sellerJoin";
import Login from "@/views/login/login";
import Purchase from "@/views/shop/purchase";
import OrderDetail from "@/views/my/OrderDetail";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "*",
			redirect: "/login"
		},
		{
			path: "/login",
			name: "Login",
			component: Login,
		},
		{
			path: "/index",
			name: "Index",
			component: Index,
			meta: {
				title: "江夏优选"
			}
		},
		{
			path: "/category",
			name: "Category",
			component: Category,
			meta: {
				title: "产品分类",
				keepAlive: true
			}
		},
		{
			path: "/live",
			name: "Live",
			component: Live,
			meta: {
				title: "直播"
			}
		},
		{
			path: "/shop",
			name: "Shop",
			component: Shop,
			meta: {
				title: "购物车"
			}
		},
		{
			path: "/my",
			name: "My",
			component: My,
			meta: {
				title: "个人中心"
			}
		},
		{
			path: "/order",
			name: "Order",
			component: Order,
			meta: {
				title: "我的订单",
				keepAlive: true
			}
		},
		{
			path: "/science",
			name: "Science",
			component: Science,
			meta: {
				title: "江夏科创"
			}
		},
		{
			path: "/culture",
			name: "Culture",
			component: Culture,
			meta: {
				title: "江夏文旅"
			}
		},
		{
			path: "/healthy",
			name: "Healthy",
			component: Healthy,
			meta: {
				title: "江夏健康"
			}
		},
		{
			path: "/companyDetail",
			name: "CompanyDetail",
			component: CompanyDetail,
			meta: {
				title: "企业详情"
			}
		},
		{
			path: "/racking",
			name: "Racking",
			component: Racking,
			meta: {
				title: "最新上架"
			}
		},
		{
			path: "/hot",
			name: "Hot",
			component: Hot,
			meta: {
				title: "热销排行"
			}
		},
		{
			path: "/detail",
			name: "Detail",
			component: Detail,
			meta: {
				title: "商品详情"
			}
		},
		{
			path: "/manageAddress",
			name: "ManageAddress",
			component: ManageAddress,
			meta: {
				title: "地址管理"
			}
		},
		{
			path: "/addAddress",
			name: "AddAddress",
			component: AddAddress,
			meta: {
				title: "地址管理"
			}
		},
		{
			path: "/goodsList",
			name: "GoodsList",
			component: GoodsList,
			meta: {
				title: "商品列表",
				keepAlive: true,
				isBack: false, //用于判断上一个页面是哪个
			}
		},
		{
			path: "/sellerJoin",
			name: "SellerJoin",
			component: SellerJoin,
			meta: {
				title: "商品入驻"
			}
		},
		{
			path: "/purchase",
			name: "Purchase",
			component: Purchase,
			meta: {
				title: "提交订单"
			}
		},
		{
			path: "/orderDetail",
			name: "OrderDetail",
			component: OrderDetail,
			meta: {
				title: "订单详情"
			}
		},
	]
});
