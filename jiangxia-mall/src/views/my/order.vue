<template>
	<div class="page-order">
		<div class="head">
			<h4>订单信息</h4>
			<img src="../../assets/images/orderTime.png"/>
		</div>
		<van-tabs v-model="active" color="#7abb56" @change="tabChange">
			<van-tab :title="item.name" v-for="(item,index) in list" :key="index"></van-tab>
		</van-tabs>
		<div class="container">
			<img src="../../assets/images/noOrder.png" class="empty" v-if="orderList.length===0">
			<van-list
				v-if="orderList&&orderList.length > 0"
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<div v-for="(item,index) in orderList" :key="index" class="order-item">
					<div class="top">
						<p>{{ item.createTime }}</p>
						<span>{{ item.status }}</span>
					</div>
					<div class="middle">
						<div class="info" v-for="(subItem,subIndex) in item.list" :key="subIndex">
							<div class="left">
								<img :src="subItem.goodsImg">
								<p>{{ subItem.goodsName }}</p>
							</div>
							<div class="right">
								<span>{{ `￥${subItem.goodsPrice}` }}</span>
								<span>{{ `×${subItem.goodsNum}` }}</span>
							</div>
						</div>
						<p class="total">
							{{ `共${item.list.length}件商品, 总金额 ￥${item.totalMoney}` }}
						</p>
					</div>
					<div class="bottom">

					</div>
				</div>
			</van-list>

		</div>
	</div>
</template>

<script>
import Vue from "vue";
import {NavBar, Tab, Tabs, List} from "vant";

Vue.use(NavBar).use(Tab).use(Tabs).use(List);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "order",
	data() {
		return {
			active: 0,
			list: [
				{
					value: "all",
					name: "全部",
				},
				{
					value: "waitPay",
					name: "待付款",
				},
				{
					value: "waitSend",
					name: "待发货",
				},
				{
					value: "waitReceive",
					name: "待收货",
				},
				{
					value: "dpj",
					name: "待评价",
				},
				{
					value: "ywc",
					name: "已完成",
				},
			],
			query: {
				page: 0,
				pageSize: 10
			},
			loading: false,
			finished: false,
			orderList: []
		};
	},
	async beforeMount() {
		const {active} = this.$route.query;
		this.active = +active;
		this.onLoad();
	},
	methods: {
		async tabChange(param) {
			console.log(param)
			let isTrue = await this.refresh();
			if (isTrue) {
				const result = await this.interGetOrderList(this.list[param].value);
				console.log(result)
				if (parseInt(result.current_page) < result.last_page) {
					setTimeout(() => {
						this.loading = false;
						this.finished = false;
						this.orderList = this.orderList.concat(result.data);
					}, 600)
				} else if (parseInt(result.current_page) === result.last_page) {
					this.finished = true;
					this.loading = false;
					this.orderList = this.orderList.concat(result.data);
					console.log(this.orderList)
				}
			}
		},
		interGetOrderList(type) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/getorderlist', 'post', {
					type: type ? type : '',
					pagesize: this.query.pageSize,
					page: this.query.page
				}).then(res => {
					// console.log(res)
					if (res.status === 1) {
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err);
					reject(err);
				})
			})
		},
		async onLoad() {
			console.log('onLoad加载')
			console.log(this.query)
			this.query.page++;
			this.loading = true;
			const result = await this.interGetOrderList(this.list[this.active].value);
			console.log(result)

			result.data.map(item => {
				item.list.map((subItem) => {
					if (_.startsWith(subItem.goodsImg, "http")) {
						return;
					} else {
						subItem.goodsImg = "http://youyoujiang.com/" + subItem.goodsImg;
					}
				})
			})

			if (parseInt(result.current_page) < result.last_page) {
				setTimeout(() => {
					this.loading = false;
					this.finished = false;
					this.orderList = this.orderList.concat(result.data);
				}, 600)
			} else if (parseInt(result.current_page) === result.last_page) {
				this.finished = true;
				this.loading = false;
				this.orderList = this.orderList.concat(result.data);
				console.log(this.orderList)
			}

		},
		async refresh() {
			return new Promise((resolve, reject) => {
				this.query.page = 1;
				this.orderList = [];
				this.loading = true;
				this.finished = false;
				setTimeout(() => {
					if (this.orderList.length === 0) {
						resolve(true)
					}
				}, 300)
			})
		},
	},
};
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
			font-size: 16px;
			color: #fff;
		}

		img {
			width: px2rem(60);
		}
	}

	.van-tabs {
		.van-tabs__wrap {
			.van-tabs__nav--complete {
				padding-left: 0;
				padding-right: 0;

				.van-tab {
					padding: 0 px2rem(10);

					.van-tab__text {
						font-size: 12px;
					}
				}

				.van-tab--active {
					.van-tab__text {
						font-weight: 600;
					}
				}
			}
		}
	}

	.container {
		text-align: center;

		.empty {
			margin-top: px2rem(60);
			width: px2rem(200);
		}

		.van-list {
			padding: px2rem(10) px2rem(20);

			.order-item {
				font-size: 16px;
				margin-bottom: px2rem(8);
				border-radius: px2rem(3);

				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: px2rem(10) px2rem(10);
					border-bottom: 1px solid rgba(169, 169, 169, 0.2);

					span {
						color: #7abb56;
					}
				}

				.middle {
					.info {
						display: flex;
						justify-content: space-between;
						padding: px2rem(10) px2rem(10);

						.left {
							display: flex;

							img {
								width: px2rem(60);
								height: px2rem(60);
								border-radius: px2rem(3);
							}

							p {
								margin-left: px2rem(15);
								font-size: 14px;
							}
						}

						.right {
							display: flex;
							flex-direction: column;
							align-items: flex-end;
							font-size: 14px;
							color: #999;
						}


					}

					.total {
						padding: px2rem(0) px2rem(10);
						text-align: right;
					}
				}
			}
		}
	}
}
</style>
