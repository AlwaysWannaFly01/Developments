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
				<p>
					购物数量
				</p>
				<van-button type="default" size="small">管理</van-button>
			</div>
		</div>
		<div class="shop-container" :style="mainHeight">
			<div class="shop-list" v-for="(item,index) in shopList" :key="index">
				<div class="line"></div>
				<div class="list-item">
					<div class="item-top">{{ item.shopName }}</div>
					<div class="item-bottom">
						<div v-for="(subItem,subIndex) in item.list" :key="subIndex" class="item-bottom-list-item">
							<van-checkbox v-model="subItem.isCheck" checked-color="#7abb56"></van-checkbox>
							<div class="detail">
								<img :src="subItem.goodsImg">
								<div class="detail-info">
									<h4>{{subItem.goodsName}}</h4>
									<span>属性:默认</span>
									<strong>{{ `￥${subItem.shopPrice}` }}</strong>
								</div>
								<van-stepper v-model="subItem.cartNum"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="empty" v-if="showHot">
			<img src="../../assets/images/noShopper.png">
		</div>
		<div class="hot" v-if="showHot">
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

export default {
	data() {
		return {
			recomList: [],
			showHot: false,
			shopList: []
		}
	},
	beforeMount() {
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 50 - 50 -50 + "px",
		};
		console.log(this.mainHeight)
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
			console.log(res)
			if (res.goodsTotalNum < 1) {
				this.showHot = true;
			}

			res.carts

			this.shopList = res.carts

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
					// console.log(res)
					if (res.status === 1) {
						// console.log(res.data)
						res.data.carts.map((item, index) => {
							item.list.map(subItem => {
								console.log(subItem)
								if (_.startsWith(subItem.goodsImg, "http")) {
									return;
								} else {
									subItem.goodsImg =
										"http://youyoujiang.com/" + subItem.goodsImg;
								}
							})
						})
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
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
			background-color: rgba(201, 201, 201, .3);

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
					line-height: px2rem(40);
					padding: 0 px2rem(10);
					border-bottom: 1px solid rgba(235, 237, 240, 0.5);
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

	.empty {
		text-align: center;
		padding: px2rem(20);

		img {
			width: px2rem(200);
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
			margin-bottom: 50px;

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

