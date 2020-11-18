<template>
	<div class="page-order" :style="deviceHeight">
		<div class="head">
			<h4>订单信息</h4>
			<img src="../../assets/images/orderTime.png"/>
		</div>
		<van-tabs v-model="active" color="#7abb56" @change="tabChange">
			<van-tab :title="item.name" v-for="(item,index) in list" :key="index"></van-tab>
		</van-tabs>
		<div class="container" :style="mainHeight">
			<img src="../../assets/images/noOrder.png" class="empty" v-if="!isEmpty&&orderList&&orderList.length===0">
			<van-loading size="24px" v-if="isEmpty">加载中...</van-loading>
			<van-list
				v-if="!isEmpty&&orderList&&orderList.length > 0"
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
				offset="10"
			>
				<div v-for="(item,index) in orderList" :key="index" class="order-item">
					<div class="top">
						<p>{{ item.createTime }}</p>
						<span>{{ item.status }}</span>
					</div>
					<div class="middle" @click="toOrderDetail(item)">
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
							{{ `共${item.list.length}件商品, 总金额 ` }}
							<span>{{ `￥${item.totalMoney}` }}</span>
						</p>
					</div>
					<div class="bottom">
						<van-button round color="#bbb" plain size="small">取消订单</van-button>
						<van-button round color="#7abb56" size="small">立即付款</van-button>
					</div>
				</div>
			</van-list>

		</div>
	</div>
</template>

<script>
import Vue from "vue";
import {NavBar, Tab, Tabs, List, Button, Loading} from "vant";

Vue.use(NavBar).use(Tab).use(Tabs).use(List).use(Button).use(Loading);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "order",
	data() {
		return {
			active: 0,
			list: [
				{
					value: "",
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
					value: "waitAppraise",
					name: "待评价",
				},
				{
					value: "finish",
					name: "已完成",
				},
			],
			query: {
				page: 0,
				pageSize: 10
			},
			loading: false,
			finished: false,
			orderList: [],
			isEmpty: true
		};
	},
	async beforeMount() {
		const {active} = this.$route.query;
		this.active = +active;
		this.onLoad();

		this.deviceHeight = {
			height: window.innerHeight + "px",
		};

		this.mainHeight = {
			height: window.innerHeight - 100 - 44 + "px",
		};

	},
	methods: {
		async tabChange(param) {
			// console.log(param)
			let isTrue = await this.refresh();
			if (isTrue) {
				const result = await this.interGetOrderList(this.list[param].value);
				console.log(result)
				this.loading = false;
				this.isEmpty = false;
				if (parseInt(result.current_page) < result.last_page) {
					this.finished = false;
					this.orderList = this.orderList.concat(result.data);
				} else if (parseInt(result.current_page) === result.last_page) {
					this.finished = true;
					this.orderList = this.orderList.concat(result.data);
				} else if (parseInt(result.current_page) > result.last_page) {
					this.finished = true;
					this.orderList = [];
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
			// console.log('onLoad加载')
			// console.log(this.query)
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
			this.loading = false;
			this.isEmpty = false;
			if (parseInt(result.current_page) < result.last_page) {
				this.finished = false;
				this.orderList = this.orderList.concat(result.data);
			} else if (parseInt(result.current_page) === result.last_page) {
				this.finished = true;
				this.orderList = this.orderList.concat(result.data);
				console.log(this.orderList)
			} else if (parseInt(result.current_page) > result.last_page) {
				this.finished = true;
				this.orderList = [];
			}
		},
		async refresh() {
			return new Promise((resolve, reject) => {
				this.query.page = 1;
				this.orderList = [];
				this.loading = true;
				this.finished = false;
				this.isEmpty = true;
				setTimeout(() => {
					if (this.orderList.length === 0) {
						resolve(true)
					}
				}, 500)
			})
		},
		toOrderDetail(param) {
			console.log(param)
			this.$router.push({
				name: 'OrderDetail',
				query: {
					orderId: param.orderId
				}
			})
		}
	},
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-order {
	.head {
		width: 100%;
		box-sizing: border-box;
		padding: px2rem(0) px2rem(15);
		height: 100px;
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
		background-color: rgba(201, 201, 201, 0.1);
		overflow-y: auto;

		.empty {
			margin-top: px2rem(60);
			width: px2rem(200);
		}

		.van-list {
			padding: px2rem(10) px2rem(10);

			.order-item {
				font-size: 16px;
				margin-bottom: px2rem(8);
				border-radius: px2rem(3);
				background-color: #fff;

				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: px2rem(15) px2rem(10);
					border-bottom: 1px solid rgba(169, 169, 169, 0.2);

					span {
						color: #7abb56;
					}
				}

				.middle {
					padding-bottom: px2rem(20);
					border-bottom: 1px solid rgba(169, 169, 169, 0.2);

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
								width: px2rem(150);
								text-align: left;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 4;
								line-clamp: 4;
								-webkit-box-orient: vertical;
								line-height: 16px;
							}
						}

						.right {
							display: flex;
							flex-direction: column;
							align-items: flex-end;
							font-size: 14px;
							color: #999;

							span {
								margin-bottom: px2rem(6);
							}
						}


					}

					.total {
						padding: px2rem(0) px2rem(10);
						text-align: right;
						font-size: 14px;

						span {
							color: #7abb56;
							font-weight: 600;
						}
					}
				}

				.bottom {
					text-align: right;
					padding: px2rem(10) px2rem(10);

					.van-button {
						margin-left: px2rem(10);
						padding: 0 px2rem(15);
					}
				}
			}

			.van-list__finished-text {
				line-height: 30px;
			}
		}

		.van-loading {
			height: 50px;
			line-height: 50px;
		}
	}
}
</style>
