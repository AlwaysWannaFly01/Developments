<template>
	<div class="page-purchase">
		<div class="container" :style="mainHeight">
			<div class="user-address" @click="showPop">
				<div class="content" v-if="userAddress&&userAddress.addressId">
					<div class="title">
						<h3 class="name">{{ userAddress.userName ? userAddress.userName : '' }}</h3>
						<h3>{{ userAddress.userPhone ? userAddress.userPhone : '' }}</h3>
					</div>
					<div class="addr">
						<p>
							<span v-show="userAddress.isDefault">[默认]&nbsp;</span>
							{{ userAddress.fullAddress ? userAddress.fullAddress : '' }}
						</p>
					</div>
				</div>
				<div v-else class="empty-addr">设置收获地址</div>
				<van-icon name="arrow" size="24" color="#999"/>
			</div>
			<div class="line-dashed"></div>
			<div class="shop-container">
				<div class="shop-list" v-for="(item,index) in account.carts" :key="index">
					<div class="line"></div>
					<div class="list-item">
						<div class="item-top">{{ item.shopName }} <span>{{ `共${item.list.length}件商品` }}</span></div>
						<div class="item-bottom">
							<div v-for="(subItem,subIndex) in item.list" :key="subIndex" class="item-bottom-list-item">
								<div class="detail">
									<img :src="subItem.goodsImg">
									<div class="detail-info">
										<h4>{{ subItem.goodsName }}</h4>
										<strong>{{ `￥${subItem.shopPrice}` }}</strong>
									</div>
								</div>
								<span class="num">{{ `×${subItem.cartNum}` }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="express">
				<h4>快递费用</h4>
				<span>免运费</span>
			</div>
			<div class="payment">
				<h4>支付方式</h4>
			</div>
			<div class="goods-count">
				<h4>商品总价:</h4>
				<span>{{ `￥${account.goodsTotalMoney ? account.goodsTotalMoney : ''}` }}</span>
			</div>
		</div>
		<div class="total">
			<p>合计: <span>{{ `￥${account.goodsTotalMoney ? account.goodsTotalMoney : ''}` }}</span></p>
			<van-button round size="small" color="#7abb56" @click="settle">立即结算</van-button>
		</div>
		<van-popup v-model="show" position="bottom" :style="{ height: 'auto' }" closeable class="address-pop">
			<h3>选择地址</h3>
			<van-radio-group v-model="radio" v-if="allAddress&&allAddress.length > 0">
				<van-cell-group>
					<van-cell icon="location-o"
							  :title="item.userName + ' ' + item.userPhone"
							  clickable
							  @click="chooseAddress(item.addressId)"
							  :label="item.fullAddress"
							  center
							  v-for="(item,index) in allAddress" :key="index"
							  :class="item.addressId===radio?'active':''"
					>
						<template #right-icon>
							<van-radio :name="item.addressId" checked-color="#7abb56"/>
						</template>
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<div v-else class="empty-div">
				<img src="../../assets/images/noAddress.png">
			</div>
			<van-button type="primary" block color="#7abb56" @click="chooseOther">选择其它地址</van-button>
		</van-popup>
	</div>
</template>

<script>
import Vue from 'vue';
import {Icon, Button, Popup, RadioGroup, Radio, CellGroup, Cell} from 'vant';

Vue.use(Icon).use(Button).use(Popup).use(RadioGroup).use(Radio).use(CellGroup).use(Cell);

import _ from "lodash";
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "purchase",
	data() {
		return {
			userAddress: {},
			account: {},
			show: false,
			radio: '',
			allAddress: []
		}
	},
	beforeMount() {
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 50 + "px",
		};
	},
	async mounted() {
		const res = await this.interSettlement();
		console.log(res)
		this.userAddress = res.userAddress;
		this.account = res.carts;
		this.allAddress = await this.interMyShippingAddress()
		// console.log(this.allAddress)
		if (this.userAddress.isDefault) {
			this.radio = this.userAddress.addressId;
		}
	},
	methods: {
		/*去购物车结算页面*/
		interSettlement() {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/carts/settlement", "get").then((res) => {
					console.log(res);
					if (res.status === 1) {
						res.data.carts.carts.map((item) => {
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
						HandleToast(res.msg, 'fail', 1000, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}

				}).catch((err) => {
					console.log(err);
				});
			})
		},
		interMyShippingAddress() {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/myshippingaddress', 'get').then(res => {
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
					reject(err)
				})
			})
		},
		showPop() {
			this.show = true;
		},
		async chooseAddress(param) {
			// console.log(param)
			this.radio = param;
			this.userAddress = await this.interGetById(param);
			this.show = false;
		},
		chooseOther() {
			this.$router.push({
				name: 'ManageAddress'
			})
		},
		interGetById(addressId) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/getbyid', 'post', {addressId}).then(res => {
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
					reject(err)
				})
			})
		},
		async settle() {
			console.log(this.userAddress)
			const {addressId} = this.userAddress;
			if (addressId) {
				const res = await this.interSubmitOrder(addressId)
				console.log(res)
				HandleToast(res.msg, 'success', 2000, () => {
					this.$router.replace({
						name: 'My'
					})
				})
			} else {
				HandleToast('地址不能为空', 'fail')
			}
		},
		interSubmitOrder(addressId) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/orders/submitorder', 'post', {addressId, payType: 1}).then(res => {
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
					reject(err)
				})
			})
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-purchase {
	.container {
		overflow-y: auto;
		background-color: rgba(201, 201, 201, 0.1);

		.user-address {
			display: flex;
			align-items: center;
			padding: px2rem(12) px2rem(16);
			background-color: #fff;
			justify-content: space-between;
			min-height: px2rem(60);

			.content {
				.title {
					display: flex;
					font-size: 16px;
					font-weight: 600;
					margin-bottom: px2rem(10);

					.name {
						margin-right: px2rem(10);
					}
				}

				.addr {
					font-size: 16px;
					display: flex;

					p {
						line-height: 18px;
					}

					span {
						color: #7abb56;
					}
				}
			}

			.empty-addr {
				font-size: 16px;
			}

			.van-icon-arrow {
				margin-left: px2rem(10);
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

		.shop-container {

			.shop-list {
				.line {
					width: 100%;
					height: px2rem(6);
					background-color: rgba(235, 237, 240, .5);
				}

				.list-item {
					display: flex;
					flex-direction: column;
					background-color: #fff;

					.item-top {
						font-size: 16px;
						line-height: px2rem(20);
						padding: px2rem(12) px2rem(16);
						border-bottom: 1px solid rgba(235, 237, 240, 0.5);
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;

						span {
							font-size: 14px;
							color: #999;
							margin-left: px2rem(10);
						}
					}

					.item-bottom {
						display: flex;
						flex-direction: column;
						padding: px2rem(10) px2rem(16);

						.item-bottom-list-item {
							display: flex;
							margin-bottom: px2rem(20);

							&:nth-last-child(1) {
								margin-bottom: 0;
							}

							.detail {
								display: flex;
								flex: 1;
								align-items: flex-end;
								height: px2rem(80);

								img {
									width: px2rem(80);
									height: px2rem(80);
									border-radius: px2rem(3);
								}

								.detail-info {
									height: px2rem(80);
									display: flex;
									flex: 1;
									flex-direction: column;
									justify-content: space-around;
									margin-left: px2rem(10);
									padding-right: px2rem(10);

									h4 {
										font-size: 14px;
										font-weight: 600;
										overflow: hidden;
										text-overflow: ellipsis;
										display: -webkit-box;
										-webkit-line-clamp: 2;
										line-clamp: 2;
										-webkit-box-orient: vertical;
									}

									span {
										font-size: 14px;
										color: #999;
										margin-top: px2rem(6);
									}

									strong {
										color: #7abb56;
										font-size: 14px;
									}

								}

							}

							.num {
								font-size: 16px;
								display: flex;
								align-items: center;
								color: #999;
							}
						}
					}
				}
			}
		}

		.express {
			display: flex;
			justify-content: space-between;
			font-size: 16px;
			padding: px2rem(15) px2rem(16);
			background-color: #fff;
			border-top: px2rem(6) solid rgba(235, 237, 240, 0.5);

			span {
				color: #999;
			}
		}

		.payment {
			display: flex;
			flex-direction: column;
			font-size: 16px;
			padding: px2rem(15) px2rem(16);
			background-color: #fff;
			border-top: px2rem(6) solid rgba(235, 237, 240, 0.5);
		}

		.goods-count {
			display: flex;
			justify-content: space-between;
			font-size: 16px;
			padding: px2rem(15) px2rem(16);
			background-color: #fff;
			border-top: px2rem(6) solid rgba(235, 237, 240, 0.5);
			border-bottom: px2rem(6) solid rgba(235, 237, 240, 0.5);

			span {
				color: #999;
			}
		}
	}

	.total {
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 0 px2rem(16);

		p {
			font-size: 16px;

			span {
				color: #7abb56;
				font-weight: 600;
			}
		}

		.van-button {
			padding: 0 20px;
			font-size: 16px;
		}
	}

	.address-pop {
		padding: px2rem(20) px2rem(16);
		box-sizing: border-box;

		h3 {
			font-size: 16px;
			font-weight: 600;
			text-align: center;
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
							font-weight: 600;
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
