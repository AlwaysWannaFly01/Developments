<template>
	<div class="page-my">
		<div class="personal">
			<img src="@/assets/images/bg/timg.jpg"/>
			<h2 @click="token">立花泷</h2>
		</div>
		<div class="my-order">
			<h3>我的订单</h3>
			<div class="block">
				<div class="item" @click="handleClick(1)">
					<img src="../../assets/images/dfk.png"/>
					<span>待付款</span>
					<p v-if="order&&order.waitPay">{{ order.waitPay }}</p>
				</div>
				<div class="item" @click="handleClick(2)">
					<img src="../../assets/images/dfh.png"/>
					<span>待发货</span>
					<p v-if="order&&order.waitSend">{{ order.waitSend }}</p>
				</div>
				<div class="item" @click="handleClick(3)">
					<img src="../../assets/images/dsh.png"/>
					<span>待收货</span>
					<p v-if="order&&order.waitReceive">{{ order.waitReceive }}</p>
				</div>
				<div class="line"></div>
				<div class="item" @click="handleClick(0)">
					<img src="../../assets/images/jx_order.png"/>
					<span>全部订单</span>
				</div>
			</div>
		</div>

		<div class="cell-container">
			<div class="item">
				<img src="../../assets/images/jx/my-position.png"/>
				<van-cell title="我的地址" @click="toManageAddress"/>
			</div>
			<div class="item">
				<img src="../../assets/images/jx/my-msg.png"/>
				<van-cell title="我的消息"/>
			</div>
			<div class="item">
				<img src="../../assets/images/jx/store_icon.png"/>
				<van-cell title="商家入驻" @click="toSellerJoin"/>
			</div>
			<div class="item">
				<img src="../../assets/images/jx/server_icon.png"/>
				<van-cell title="联系客服" @click="callPhone"/>
			</div>
		</div>
		<TabBar></TabBar>
	</div>
</template>
<script>
import Vue from "vue";
import {Cell, CellGroup, NavBar} from "vant";

Vue.use(Cell).use(CellGroup).use(NavBar);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

import TabBar from "../../components/TabBar";

export default {
	data() {
		return {
			provinceCityCountry: [],
			canClick: false,
			order: {}
		};
	},
	components: {TabBar},
	async mounted() {
		let res = await this.interMyIndex();
		console.log(res)
		this.serviceTel = res.serviceTel;
		this.order = res.order;
	},
	methods: {
		handleClick(param) {
			this.$router.push({
				name: "Order",
				params: {
					active: param,
				},
			});
		},
		toManageAddress() {
			if (localStorage.getItem('canClick')) {
				this.$router.push({
					name: "ManageAddress"
				});
			} else {
				HandleToast('正在加载中,请稍后')
			}
		},
		toSellerJoin() {
			if (localStorage.getItem('canClick')) {
				this.$router.push({
					name: "SellerJoin"
				});
			} else {
				HandleToast('正在加载中,请稍后')
			}
		},
		callPhone() {
			window.location.href = 'tel:' + this.serviceTel;
		},
		token() {
			Request('main', 'weapp/upload/authToken', 'post', {}).then(res => {
				console.log(res)
			}).catch(err => {
				console.log(err)
			})
		},
		interMyIndex() {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/myindex', 'get').then(res => {
					if (res.status === 1) {
						resolve(res.data)
					}
				}).catch(err => {
					reject(err)
				})
			})
		}
	},
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/global.scss";

.page-my {
	padding: 0 px2rem(10);
	box-sizing: border-box;
	background-image: url("../../assets/images/jx/my-bg.png");
	background-size: 115%;
	background-repeat: no-repeat;

	.personal {
		width: 100%;
		padding: px2rem(30) 0;
		display: flex;
		align-items: center;

		img {
			width: px2rem(60);
			height: px2rem(60);
			border-radius: px2rem(30);
			margin-right: px2rem(20);
		}

		h2 {
			font-size: 20px;
		}
	}

	.my-order {
		width: 100%;
		height: px2rem(105);
		padding: px2rem(10) px2rem(15);
		box-sizing: border-box;
		border-radius: px2rem(3);
		box-shadow: 0pt px2rem(2) px2rem(5) 0 rgba(169, 169, 169, 0.4);

		h3 {
			font-size: 16px;
			margin-bottom: px2rem(15);
		}

		.block {
			display: flex;
			align-items: center;

			.item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				img {
					width: px2rem(25);
					margin-bottom: px2rem(12);
				}

				span {
					font-size: 14px;
				}

				p {
					position: absolute;
					top: px2rem(-5);
					right: 36%;
					transform: translateX(50%);
					border: 1px solid #7abb56;
					border-radius: 50%;
					width: px2rem(14);
					height: px2rem(14);
					color: #7abb56;
					text-align: center;
					line-height: px2rem(14);
					font-size: 14px;
				}
			}

			.line {
				width: 1px;
				height: px2rem(22);
				background-color: #a1a1a1;
				opacity: 0.3;
			}
		}
	}

	.cell-container {
		margin-top: px2rem(20);

		.item {
			display: flex;
			align-items: center;

			img {
				width: px2rem(26);
				height: px2rem(26);
				margin-right: px2rem(10);
			}

			.van-cell {
				.van-cell__title {
					border-bottom: 1px solid rgba(169, 169, 169, 0.2);
					height: px2rem(46);

					span {
						font-size: 14px;
					}
				}
			}
		}
	}
}
</style>

