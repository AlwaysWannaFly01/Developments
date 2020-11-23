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
					<div class="bottom" v-show="item.orderStatus !== -1">
						<van-button round color="#bbb" plain size="small" @click="cancel(item)">取消订单</van-button>
						<van-button round color="#7abb56" size="small" @click="pay(item)">立即付款</van-button>
					</div>
				</div>
			</van-list>
		</div>
		<van-popup v-model="show" position="bottom" :style="{ height: 'auto' }" closeable class="choose-pop"
				   @close="closePop">
			<h3>取消订单</h3>
			<p>请选择取消订单原因(必选)</p>
			<van-radio-group v-model="radio" v-if="reason&&reason.length>0">
				<van-cell-group>
					<van-cell v-for="(item,index) in reason" :key="index" :title="item.dataName" clickable
							  @click="chooseReason(item.dataVal)" :class="item.dataVal===radio?'active':''">
						<template #right-icon>
							<van-radio checked-color="#7abb56" :name="item.dataVal"/>
						</template>
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-button type="primary" block color="#7abb56" @click="submitReason">提交</van-button>
		</van-popup>
	</div>
</template>

<script>
import Vue from "vue";
import {NavBar, Tab, Tabs, List, Button, Loading, Popup, CellGroup, Cell} from "vant";

Vue.use(NavBar).use(Tab).use(Tabs).use(List).use(Button).use(Loading).use(Popup).use(CellGroup).use(Cell);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

let activeKey;
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
			isEmpty: true,
			show: false,
			radio: '',
			reason: []
		};
	},
	async beforeMount() {
		this.deviceHeight = {
			height: window.innerHeight + "px",
		};
		this.mainHeight = {
			height: window.innerHeight - 100 - 44 + "px",
		};
	},
	async activated() {
		// console.log(this.$route.params)
		if (!this.$route.meta.isBack) {
			// console.log(this.active)
			activeKey = this.$route.params.active
		} else {
			// console.log(this.active)
			activeKey = this.active;
		}
	},
	beforeRouteEnter(to, from, next) {
		// console.log('to ', to)
		// console.log('from ', from)
		if (from.name == 'OrderDetail') { // 这个name是下一级页面的路由name
			to.meta.isBack = true; // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
		} else {
			to.meta.isBack = false;
		}
		next(vm => {
			// console.log(vm);
			if (activeKey) {
				vm.active = activeKey;
				vm.tabChange(activeKey);
			} else {
				vm.active = 0;
				vm.tabChange(0);
			}
		})
	},
	async mounted() {
		this.reason = await this.interCancellationReason();
	},
	methods: {
		async tabChange(param) {
			// console.log(param)
			this.active = param;
			let isTrue = await this.refresh();
			if (isTrue) {
				const result = await this.interGetOrderList(this.list[param].value);
				// console.log(result)
				await this.convert(result);
			}
		},
		interGetOrderList(type) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/getorderlist', 'post', {
					type: type ? type : '',
					pagesize: this.query.pageSize,
					page: this.query.page
				}).then(res => {
					console.log(res)
					if (res.status === 1) {
						res.data.data.map((item) => {
							item.list.map((subItem) => {
								if (_.startsWith(subItem.goodsImg, "http")) {
									return;
								} else {
									subItem.goodsImg = "http://youyoujiang.com/" + subItem.goodsImg;
								}
							})
						});
						resolve(res.data)
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					console.log(err);
					reject(err);
				})
			})
		},
		async onLoad() {
			console.log('onLoad加载')
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
			await this.convert(result);
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
		async convert(obj) {
			this.loading = false;
			this.isEmpty = false;
			if (parseInt(obj.current_page) < obj.last_page) {
				this.finished = false;
				this.orderList = this.orderList.concat(obj.data);
			} else if (parseInt(obj.current_page) === obj.last_page) {
				this.finished = true;
				this.orderList = this.orderList.concat(obj.data);
				// console.log(this.orderList)
			} else if (parseInt(obj.current_page) > obj.last_page) {
				this.finished = true;
				this.orderList = [];
			}
		},
		toOrderDetail(param) {
			// console.log(param)
			this.$router.push({
				name: 'OrderDetail',
				query: {
					orderId: param.orderId
				}
			})
		},
		cancel(param) {
			console.log(param);
			this.show = true;
			this.cancelOrderId = param.orderId;
		},
		interCancellationReason() {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/cancellationreason', 'get').then(res => {
					// console.log(res)
					if (res.status === 1) {
						resolve(res.data)
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					console.log(err);
					reject(err);
				})
			})
		},
		async chooseReason(param) {
			this.radio = param;
		},
		closePop() {
			this.radio = '';
		},
		async submitReason() {
			console.log(this.cancelOrderId);
			if (!this.radio) {
				HandleToast('请选择取消订单原因', 'fail')
			} else {
				const res = await this.interCancellation(this.radio);
				HandleToast(res.msg, 'success', 800, async () => {
					this.show = false;
					let isTrue = await this.refresh();
					if (isTrue) {
						const result = await this.interGetOrderList(this.list[this.active].value);
						console.log(result)
						this.convert(result);
					}
				});
			}
		},
		interCancellation(Id) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/cancellation', 'post', {
					id: this.cancelOrderId,
					reasonId: Id
				}).then(res => {
					console.log(res)
					if (res.status === 1) {
						resolve(res)
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					console.log(err);
					reject(err);
				})
			})
		},
		async pay(item) {
			console.log(item);
			const res = await this.interWxpays(item.pkey);
			console.log(res)
			if (res.status === 1) {
				callpay();
				/*前端js发起支付*/
				function jsApiCall() {
					WeixinJSBridge.invoke("getBrandWCPayRequest", {
						"appId": "{$jsapi_parameters.appId}", //公众号名称，由商户传入
						"timeStamp": "{$jsapi_parameters.timeStamp}", //时间戳，自1970年以来的秒数
						"nonceStr": "{$jsapi_parameters.nonceStr}", //随机串
						"package": "{$jsapi_parameters.package}",
						"signType": "{$jsapi_parameters.signType}", //微信签名方式：
						"paySign": "{$jsapi_parameters.paySign}" //微信签名
					}, function (res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							//微信支付成功,前端不做处理,微信异步调用后台接口
						} else {
						}
						alert(JSON.stringify(res));
					})
				};

				function callpay() {
					if (typeof WeixinJSBridge == "undefined") {
						if (document.addEventListener) {
							document.addEventListener("WeixinJSBridgeReady", jsApiCall, false);
						} else if (document.attachEvent) {
							document.attachEvent("WeixinJSBridgeReady", jsApiCall);
							document.attachEvent("onWeixinJSBridgeReady", jsApiCall);
						}
					} else {
						jsApiCall();
					}
				}

			} else {
				HandleToast(res.msg, 'fail', 800, () => {
					this.$router.replace({
						name: 'Login'
					})
				});
			}

		},
		interWxpays(pkey) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/wxpays', 'post', {
					pkey
				}).then(res => {
					resolve(res)
				}).catch(err => {
					// console.log(err);
					reject(err);
				})
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

	.choose-pop {
		padding: px2rem(20) px2rem(16);
		box-sizing: border-box;

		h3 {
			font-size: 16px;
			font-weight: 600;
			text-align: center;
		}

		p {
			font-size: 16px;
			font-weight: 600;
			text-align: left;
			margin-top: px2rem(30);
		}

		.van-radio-group {
			margin-top: px2rem(20);
			max-height: px2rem(340);
			overflow-y: auto;

			.van-cell-group {
				.van-cell {
					padding: 10px 0;

					&::after {
						left: 0;
						right: 0;
					}

					.van-cell__left-icon {
						margin-right: px2rem(10);
						font-size: 20px;
					}

					.van-cell__title {
						span {
							font-weight: 400;
						}
					}

					&.active {
						.van-cell__left-icon {
							color: #7abb56;
						}

						.van-cell__title {
							color: #7abb56;

							.van-cell__label {
								color: #7abb56;
							}
						}
					}
				}
			}

			.van-hairline--top-bottom::after {
				border-top: none;
			}
		}

		.empty-div {
			text-align: center;
			padding-top: px2rem(20);

			img {
				width: px2rem(160);
			}
		}

		.van-button {
			border-radius: 22px;
			margin-top: px2rem(20);
		}
	}
}
</style>
