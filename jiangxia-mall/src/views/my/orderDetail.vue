<template>
	<div class="page-orderDetail" :style="deviceHeight">
		<div class="head">
			<h4 v-if="detail.log&&detail.log.length>0">{{ detail.log[detail.log.length - 1].logContent }}</h4>
			<p v-if="detail.log&&detail.log.length>0">{{ detail.log[detail.log.length - 1].logTime }}</p>
		</div>
		<div class="container" :style="mainHeight">
			<van-steps :active="active">
				<van-step>待付款</van-step>
				<van-step>待发货</van-step>
				<van-step>待收货</van-step>
				<van-step>待评价</van-step>
				<van-step>已完成</van-step>
			</van-steps>
			<div class="address">
				<div class="info">
					<h4>{{ detail.userName }} <span>{{ detail.userPhone }}</span></h4>
					<p>{{ detail.userAddress }}</p>
				</div>
				<div class="line-dashed"></div>
			</div>
			<div class="order-item">
				<div class="top">
					<p>{{ detail.shopName }}</p>
					<span v-if="detail.goods&&detail.goods.length>0">{{ `共${detail.goods.length}件商品` }}</span>
				</div>
				<div class="middle">
					<div class="info" v-for="(item,index) in detail.goods" :key="index">
						<div class="left">
							<img :src="item.goodsImg">
							<div>
								<p>{{ item.goodsName }}</p>
								<span>默认</span>
								<strong>{{ `￥${item.goodsPrice}` }}</strong>
							</div>
						</div>
						<div class="right">
							<span>{{ `×${item.goodsNum}` }}</span>
						</div>
					</div>
				</div>
				<van-button icon="service-o" plain block @click="callPhone">联系客服</van-button>
			</div>
			<div class="order-info">
				<div>
					<h4>订单编号:</h4>
					<p>
						<span>{{ detail.orderNo ? detail.orderNo : '' }}</span>
						<van-button plain size="mini">复制</van-button>
					</p>
				</div>
				<div>
					<h4>下单时间:</h4>
					<p>{{ detail.createTime ? detail.createTime : '' }}</p>
				</div>
				<div>
					<h4>支付状态:</h4>
					<p>{{ detail.status ? detail.status : '' }}</p>
				</div>
				<div>
					<h4>支付方式:</h4>
					<p>{{ detail.payInfo ? detail.payInfo : '' }}</p>
				</div>
			</div>
			<div class="payInfo">
				<div class="price">
					<h4>支付金额:</h4>
					<p>{{ `￥${detail.totalMoney ? detail.totalMoney : ''}` }}</p>
				</div>
				<div class="mount">
					<p>实付款: <strong>{{ `￥${detail.realTotalMoney ? detail.realTotalMoney : ''}` }}</strong></p>
				</div>
			</div>
		</div>
		<div class="pay">
			<van-button round size="small" color="#7abb56" :disabled="isDisable">立即付款</van-button>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import {NavBar, Tab, Tabs, List, Button, Step, Steps} from "vant";

Vue.use(NavBar).use(Tab).use(Tabs).use(List).use(Button).use(Step).use(Steps);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "orderDetail",
	data() {
		return {
			orderId: '',
			detail: {},
			active: -99,
			isDisable: false
		}
	},
	async beforeMount() {
		this.deviceHeight = {
			height: window.innerHeight + "px",
		};
		this.mainHeight = {
			height: window.innerHeight - 100 - 50 + "px",
		};
		if (this.$route.query.orderId) {
			this.orderId = this.$route.query.orderId;
		}
		this.detail = await this.interGetDetail(this.orderId);
		console.log(this.detail)
		switch (this.detail.orderStatus) {
			case -2:
				this.active = 0;
				break;
			case 0:
				this.active = 1;
				break;
			case 1:
				this.active = 2;
				break;
			case 2:
				this.active = 3;
				break;
			case -1:
				/*已取消*/
				this.active = -99;
				this.isDisable = true;
				break;
		}
	},
	async mounted() {

	},
	methods: {
		interGetDetail(id) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/getdetail', 'post', {
					id
				}).then(res => {
					console.log(res)
					if (res.status === 1) {
						res.data.goods.map((item) => {
							if (_.startsWith(item.goodsImg, "http")) {
								return;
							} else {
								item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
							}
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
					reject(err);
				})
			})
		},
		callPhone() {
			if (this.detail.shopTel) {
				window.location.href = 'tel:' + this.detail.shopTel
			} else {
				window.location.href = 'tel:'
			}
		},
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-orderDetail {
	.head {
		width: 100%;
		box-sizing: border-box;
		padding: px2rem(0) px2rem(15);
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		background-color: #7abb56;
		color: #fff;

		h4 {
			font-size: 16px;
			font-weight: 600;
			margin-bottom: px2rem(10);
		}

		p {
			font-size: 14px;
		}
	}

	.container {
		background-color: rgba(201, 201, 201, 0.1);
		overflow-y: auto;

		.line {
			height: px2rem(8);
			background-color: rgba(235, 237, 240, 0.5);
		}

		.address {
			margin-top: px2rem(8);
			margin-bottom: px2rem(8);
			background-color: #fff;

			.info {
				padding: px2rem(20);
				background-color: #fff;
				font-size: 16px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-height: px2rem(40);

				h4 {
					margin-bottom: px2rem(10);
				}

				p {
					color: #999;
					font-size: 14px;
				}
			}

			.line-dashed {
				width: 100%;
				height: 2px;
				position: relative;

				&::after {
					position: absolute;
					right: 0;
					top: 0;
					left: 0;
					height: 2px;
					background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
					background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
					background-size: 80px;
					content: '';
				}
			}
		}

		.order-item {
			font-size: 16px;
			margin-bottom: px2rem(8);
			border-radius: px2rem(3);
			background-color: #fff;
			min-height: px2rem(172);

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: px2rem(15) px2rem(10);
				border-bottom: 1px solid rgba(169, 169, 169, 0.2);

				span {
					color: #aaa;
				}
			}

			.middle {
				border-bottom: 1px solid rgba(169, 169, 169, 0.2);

				.info {
					display: flex;
					justify-content: space-between;
					padding: px2rem(10) px2rem(10);
					min-height: px2rem(60);

					.left {
						display: flex;

						img {
							width: px2rem(60);
							height: px2rem(60);
							border-radius: px2rem(3);
						}

						div {
							display: flex;
							flex-direction: column;
							padding-left: px2rem(15);
							justify-content: space-between;

							p {
								font-size: 14px;
								width: px2rem(200);
								text-align: left;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 4;
								line-clamp: 4;
								-webkit-box-orient: vertical;
								line-height: 16px;
							}

							span {
								font-size: 14px;
								color: #aaa;
							}

							strong {
								color: #7abb56;
								font-weight: 600;
							}
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

			}

			.van-button {
				color: #7abb56;
				border-color: transparent;
			}
		}

		.order-info {
			display: flex;
			flex-direction: column;
			padding: px2rem(10) px2rem(10) 0;
			background-color: #fff;
			margin-bottom: px2rem(8);

			div {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: px2rem(15);

				h4 {
					font-size: 16px;
				}

				p {
					font-size: 14px;
					color: #aaa;

					span {

					}

					.van-button {
						padding: 0 px2rem(10);
						color: #aaa;
					}
				}
			}
		}

		.payInfo {
			background-color: #fff;
			margin-bottom: px2rem(8);
			display: flex;
			flex-direction: column;

			.price {
				display: flex;
				justify-content: space-between;
				padding: px2rem(20) px2rem(10);
				border-bottom: 1px solid rgba(169, 169, 169, 0.2);

				h4 {
					font-size: 16px;
				}

				p {
					font-size: 14px;
					color: #aaa;
				}
			}

			.mount {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: px2rem(20) px2rem(10);

				p {
					font-size: 16px;

					strong {
						color: #7abb56;
						font-weight: 600;
					}
				}
			}
		}
	}

	.pay {
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background-color: #fff;
		padding: 0 px2rem(16);

		.van-button {
			padding: 0 px2rem(20);
			font-size: 16px;
		}
	}
}
</style>
