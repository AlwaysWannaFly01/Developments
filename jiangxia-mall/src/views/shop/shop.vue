<template>
	<div class="page-shop">
		<div class="top-banner">
			<van-row>
				<van-col span="1">
				</van-col>
				<van-col span="8">
					<van-icon name="passed"/>
					100%正品保证
				</van-col>
				<van-col span="9">
					<van-icon name="passed"/>
					所有商品精挑细选
				</van-col>
				<van-col span="6">
					<van-icon name="passed"/>
					售后无忧
				</van-col>
			</van-row>
			<div class="oper-block">
				<p>购物数量 <span>{{ account.goodsTotalNum }}</span></p>
				<van-button type="default" size="small" v-if="!showHot" @click="manage">{{
						manageStatus ? '管理' : '取消'
					}}
				</van-button>
			</div>
		</div>
		<div class="shop-container" v-if="!showHot" :style="mainHeight">
			<div class="shop-list" v-for="(item,index) in account.carts" :key="index">
				<div class="line"></div>
				<div class="list-item">
					<div class="item-top">{{ item.shopName }}</div>
					<div class="item-bottom">
						<div v-for="(subItem,subIndex) in item.list" :key="subIndex" class="item-bottom-list-item">
							<van-checkbox v-model="subItem._isCheck" checked-color="#7abb56"
										  @click="listItemCheckChange(subItem)"></van-checkbox>
							<div class="detail">
								<img :src="subItem.goodsImg" @click="toDetail(subItem)">
								<div class="detail-info" @click="toDetail(subItem)">
									<h4>{{ subItem.goodsName }}</h4>
									<span>属性:默认</span>
									<strong>{{ `￥${subItem.shopPrice}` }}</strong>
								</div>
								<van-stepper v-model="subItem.cartNum" @change="cartNumOnChange(subItem)"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="account" v-if="!showHot">
			<van-checkbox v-model="allChecked" checked-color="#7abb56" @click="allCheckFun">
				全选({{ allNum ? allNum : 0 }})
			</van-checkbox>
			<div class="account-oper" v-if="manageStatus">
				<strong>{{ account.goodsTotalMoney ? `￥${account.goodsTotalMoney.toFixed(2)}` : '￥0' }}</strong>
				<van-button round size="small" color="#7abb56" @click="pay">立即下单</van-button>
			</div>
			<van-button round size="small" v-if="!manageStatus" @click="deleteCarts">删除</van-button>
		</div>
		<div class="empty-container" v-if="showHot" :style="emptyHeight">
			<div class="line"></div>
			<div class="empty">
				<img src="../../assets/images/noShopper.png">
			</div>
			<div class="hot">
				<div class="top">
					<img src="../../assets/images/jx/label_icon.png">
					<span>热门推荐</span>
					<img src="../../assets/images/jx/label_icon.png">
				</div>
				<div class="block">
					<ul>
						<li v-for="(item,index) in recomList" :key="index">
							<img :src="item.goodsImg" @click="toDetail(item)"/>
							<h4>{{ item.goodsName }}</h4>
							<p>
								<span class="price">￥{{ item.shopPrice }}</span>
								<del
									v-if="item.marketPrice > item.shopPrice"
								>{{ item.marketPrice }}
								</del>
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<TabBar></TabBar>
	</div>
</template>
<script>
import Vue from 'vue';
import {Col, Row, Icon, Button, Checkbox, CheckboxGroup, Stepper} from 'vant';

Vue.use(Col).use(Row).use(Icon).use(Button).use(Checkbox).use(CheckboxGroup).use(Stepper);
import TabBar from "../../components/TabBar";
import _ from "lodash";
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	data() {
		return {
			recomList: [],
			showHot: false,
			account: {},
			allChecked: false,
			manageStatus: true,
			allNum: 0
		}
	},
	beforeMount() {
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 50 - 50 - 50 - 46 + "px",
		};
		this.emptyHeight = {
			height: window.innerHeight - 50 - 50 - 50 + "px",
		}
		// console.log(this.mainHeight)
	},
	mounted() {
		this.init()
	},
	components: {TabBar},
	methods: {
		async init() {
			Request("jxyx", "weapp/goods/getgoodslist", "post", {
				type: 'recom',
				num: 5,
			}).then((res) => {
				// console.log(res);
				if (res.status === 1) {
					res.data.map((item) => {
						if (_.startsWith(item.goodsImg, "http")) {
							return;
						} else {
							item.goodsImg =
								"http://youyoujiang.com/" + item.goodsImg;
						}
					});
					// console.log(res.data);
					this.recomList = res.data;
				}
			}).catch((err) => {
				console.log(err);
			});

			let res = await this.checkShopList();
			this.account = res;
			if (this.account.goodsTotalNum === 0) {
				this.allChecked = false;
			}
			console.log(this.account)
			await this.commonReload(this.account);
		},
		toDetail(param) {
			this.$router.push({
				name: "Detail",
				query: {
					id: param.goodsId,
				},
			});
		},
		/*查看购物车列表*/
		checkShopList() {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/carts/index', 'get').then(res => {
					console.log(res)
					if (res.status === 1) {
						// console.log(res.data)
						res.data.carts.map((item, index) => {
							item.list.map(subItem => {
								// console.log(subItem)
								if (_.startsWith(subItem.goodsImg, "http")) {
									return;
								} else {
									subItem.goodsImg =
										"http://youyoujiang.com/" + subItem.goodsImg;
								}
								subItem._isCheck = subItem.isCheck === 1 ? true : false;
							})
						})
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		},
		manage() {
			this.manageStatus = !this.manageStatus;
		},
		async listItemCheckChange(param) {
			console.log(this.account)
			let boolList = [];
			this.account.carts.map(item => {
				let result = item.list.every(subItem => {
					return subItem._isCheck
				})
				boolList.push(result);
			})
			if (boolList.every(item => item)) {
				this.allChecked = true;
			} else {
				this.allChecked = false;
			}
			console.log(param)

			let res = await this.interChangeCartGood(param.cartId, param._isCheck, param.cartNum)
			console.log(res)
			let refresh = await this.checkShopList();
			this.account = refresh;
			console.log(this.account)
			await this.commonReload(this.account)
		},
		async deleteCarts() {
			console.log(this.account)
			let resArray = [];
			this.account.carts.map(item => {
				item.list.map(subItem => {
					if (subItem._isCheck) {
						resArray.push(subItem.cartId)
					}
				})
			})
			console.log(resArray);
			if (resArray.length > 0) {
				let res = await this.interDelCart(resArray.join(','))
				HandleToast(res.msg, 'success')
				let refresh = await this.checkShopList();
				this.account = refresh;
				await this.commonReload(this.account)
			} else {
				HandleToast('请选择产品')
			}
		},
		commonReload(param) {
			let boolList = [];
			param.carts.map(item => {
				let result = item.list.every(subItem => {
					return subItem._isCheck
				})
				boolList.push(result);
			})
			if (boolList.every(item => item)) {
				this.allChecked = true;
			} else {
				this.allChecked = false;
			}
			if (param.goodsTotalNum < 1) {
				this.allChecked = false;
				if (param.carts.length < 1) {
					this.showHot = true;
				}
			}
			let num = 0;
			param.carts.map(item => {
				num += item.list.length;
			})
			this.allNum = num;
		},
		/*删除购物车离的商品*/
		interDelCart(param) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/carts/delcart', 'post', {id: param}).then(res => {
					console.log(res)
					if (res.status === 1) {
						resolve(res)
					}
				}).catch(err => {
					console.log(err);
					reject(err)
				})
			})
		},
		async allCheckFun() {
			console.log(this.allChecked)
			if (this.allChecked) {
				let resArray = [];
				this.account.carts.map(item => {
					item.list.map(subItem => {
						subItem._isCheck = true;
						resArray.push(subItem.cartId)
					})
				})
				if (resArray.length > 0) {
					let res = await this.interBatchChangeCartGood(resArray.join(','), 1)
					let refresh = await this.checkShopList();
					this.account = refresh;
					await this.commonReload(this.account)
				}
			} else {
				let resArray = [];
				this.account.carts.map(item => {
					item.list.map(subItem => {
						subItem._isCheck = false;
						resArray.push(subItem.cartId)
					})
				})
				console.log(resArray)
				if (resArray.length > 0) {
					let res = await this.interBatchChangeCartGood(resArray.join(','), 0)
					let refresh = await this.checkShopList();
					this.account = refresh;
					await this.commonReload(this.account)
				}
			}
		},
		async cartNumOnChange(param) {
			console.log(this.account)
			console.log(param)
			let res = await this.interChangeCartGood(param.cartId, param._isCheck, param.cartNum)
			console.log(res)
			let refresh = await this.checkShopList();
			this.account = refresh;
			await this.commonReload(this.account)
		},
		/*修改购物车商品状态*/
		interChangeCartGood(id, isCheck, buyNum) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/carts/changecartgoods', 'post', {
					id,
					isCheck: isCheck ? 1 : 0,
					buyNum
				}).then(res => {
					if (res.status === 1) {
						resolve(res)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		/*批量修改购物车状态*/
		interBatchChangeCartGood(ids, isCheck) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/carts/batchchangecartgoods', 'post', {
					ids,
					isCheck,
				}).then(res => {
					if (res.status === 1) {
						resolve(res)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		pay() {
			this.$router.push({
				name: 'Purchase'
			})
		}
	}
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-shop {
	.top-banner {
		.van-row {
			background-color: rgba(201, 201, 201, .18);

			.van-col {
				height: 50px;
				line-height: 50px;
				font-size: 12px;
			}
		}

		.oper-block {
			height: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 px2rem(15);
			box-sizing: border-box;

			p {
				font-size: 14px;

				span {
					color: #7abb56;
				}
			}

			.van-button {
				padding: 0 15px;
				border: 1px solid rgba(50, 50, 51, .5);
				height: 28px;
			}
		}
	}

	.shop-container {
		overflow-y: auto;

		.shop-list {
			.line {
				width: 100%;
				height: px2rem(6);
				background-color: rgba(235, 237, 240, .5);
			}

			.list-item {
				display: flex;
				flex-direction: column;

				.item-top {
					font-size: 16px;
					line-height: px2rem(20);
					padding: px2rem(12) px2rem(10);
					border-bottom: 1px solid rgba(235, 237, 240, 0.5);
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.item-bottom {
					display: flex;
					flex-direction: column;
					padding: px2rem(15) px2rem(10);

					.item-bottom-list-item {
						display: flex;
						margin-bottom: px2rem(20);

						&:nth-last-child(1) {
							margin-bottom: 0;
						}

						.detail {
							display: flex;
							flex: 1;
							margin-left: px2rem(10);
							align-items: flex-end;

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

							.van-stepper {
								width: 92px;

							}
						}
					}
				}
			}
		}
	}

	.empty-container {
		overflow-y: auto;

		.line {
			width: 100%;
			height: px2rem(6);
			background-color: rgba(235, 237, 240, .5);
		}
	}

	.account {
		height: 46px;
		box-sizing: border-box;
		background-color: rgba(235, 237, 240, 0.3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: px2rem(0) px2rem(10);
		border-top: 1px solid rgba(235, 237, 240, 0.5);

		.van-checkbox {
			.van-checkbox__label {
				font-size: 14px;
			}
		}

		.account-oper {
			height: 46px;
			display: flex;
			align-items: center;

			strong {
				font-size: 16px;
				color: #7abb56;
				margin-right: px2rem(10);
				font-weight: 600;
			}

			.van-button {
				padding: 0 20px;
				font-size: 16px;
			}
		}

		.van-button {
			padding: 0 25px;
			font-size: 16px;
			color: rgba(50, 50, 51, .5);
			border: 1px solid rgba(50, 50, 51, .5);
		}
	}

	.empty {
		text-align: center;
		padding: px2rem(20);
		min-height: px2rem(162);

		img {
			width: px2rem(200);
			height: px2rem(162);
		}
	}

	.hot {
		width: 100%;
		padding: 0 px2rem(15);
		box-sizing: border-box;

		.top {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: px2rem(10) 0;

			img {
				width: 20px;
			}

			span {
				font-size: 14px;
				margin: 0 8px;
			}
		}

		.block {
			//margin-bottom: 50px;

			ul {
				display: flex;
				flex-wrap: wrap;

				li {
					margin-right: 4%;
					width: 48%;

					&:nth-child(2n) {
						margin-right: px2rem(0);
					}

					img {
						width: px2rem(165);
						height: px2rem(165);
					}

					h4 {
						font-size: 16px;
						font-weight: 400;
						margin-bottom: px2rem(6);
					}

					p {
						font-size: 14px;

						.price {
							color: #7abb56;
							font-weight: 600;
						}

						del {
							color: #a1a1a1;
							font-size: 12px;
						}

						margin-bottom: px2rem(12);
					}
				}
			}
		}
	}

}
</style>

