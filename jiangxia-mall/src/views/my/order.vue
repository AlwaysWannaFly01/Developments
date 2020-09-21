<template>
	<div class="page-order">
		<!--		<van-nav-bar-->
		<!--			title="标题"-->
		<!--			left-text="返回"-->
		<!--			right-text="按钮"-->
		<!--			left-arrow-->
		<!--		/>-->

		<div class="head">
			<h4>订单信息</h4>
			<img src="../../assets/images/orderTime.png">
		</div>
		<van-tabs v-model="active" color="#7abb56">
			<van-tab :title="item.name" v-for="(item,index) in list" :key="index">{{ item.name }}</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import Vue from 'vue';
import {NavBar, Tab, Tabs} from 'vant';

Vue.use(NavBar).use(Tab).use(Tabs);
export default {
	name: "order",
	data() {
		return {
			active: 2,
			list: [
				{
					value: 'all', name: '全部'
				}, {
					value: 'dfk', name: '待付款'
				}, {
					value: 'dfh', name: '待发货'
				}, {
					value: 'dsh', name: '待收货'
				}, {
					value: 'dpj', name: '待评价'
				}, {
					value: 'ywc', name: '已完成'
				},
			]
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

.page-order {
	.head {
		width: 100%;
		box-sizing: border-box;
		padding: px2rem(30) px2rem(10) px2rem(20);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #7abb56;

		h4 {
			font-size: 18px;
			color: #fff;
		}

		img {
			width: px2rem(60);
		}
	}

	.van-tabs {
		.van-tabs__wrap {
			 .van-tabs__nav--complete{
				padding-left: 0;
				padding-right: 0;
				 .van-tab {
					 padding: 0 px2rem(10);
					 .van-tab__text {
						 font-size: 12px;
					 }
				 }
			}
		}

	}
}
</style>
