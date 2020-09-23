<template>
	<div class="page-category">
		<van-tabs v-model="active" line-height="2" @click="onClick" color="#7abb56">
			<van-tab v-for="(item,index) in switchList" :key="index">
				<template #title>{{ item.catName }}</template>
			</van-tab>
		</van-tabs>
		<van-search v-model="value" placeholder="点击搜索商品名称" @search="onSearch"/>
		<div class="img-block">
			<img src="../../assets/images/bg/live_farm.png" v-if="active===0"/>
			<img src="../../assets/images/bg/live_oper.png" v-if="active===1"/>
			<!--			<img src="../../assets/images/jx/play.png" class="play"/>-->
		</div>

		<div class="main-container" :style="mainHeight">
			<div v-if="active===0" class="main goods">
				<!-- 分类列表 -->
				<div class="menu-wrapper">
					<van-sidebar v-model="activeKey" @change="onChange">
						<van-sidebar-item
							:title="item.catName"
							v-for="(item,index) in switchList[0].childList"
							:key="index"
						/>
					</van-sidebar>
				</div>
				<!-- 商品列表 -->
				<div class="goods-wrapper">
					<ul ref="goodScroll" v-if="!loading">
						<li
							v-for="(item,index) in goodsList.data"
							:key="index"
							class="goods-item"
							@click="toDetail(item)"
						>
							<img :src="item.goodsImg"/>
							<section>
								<div>
									<h4>{{ item.goodsName }}</h4>
									<span>{{ `库存: ${item.goodsStock}` }}</span>
									<p>
										<strong>{{ `￥${item.shopPrice}` }}</strong>
										<del
											v-if="item.marketPrice > item.shopPrice"
										>{{ item.marketPrice }}
										</del>
									</p>
								</div>
								<img src="../../assets/images/jx/add.png"/>
							</section>
						</li>
					</ul>
					<van-loading v-if="loading" type="spinner" size="20px"/>
				</div>
			</div>
			<div v-if="active===1" class="main oper">
				<!-- <div class="top">
					<img src="../../assets/images/jx/label_icon.png" />
					<span>全部商品</span>
					<img src="../../assets/images/jx/label_icon.png" />
				</div>-->
				<van-loading v-if="mainLoading" type="spinner" size="20px"/>
				<div
					class="oper-goods"
					v-else-if="!mainLoading&&operGoods.data&&operGoods.data.length>0"
				>
					<ul>
						<li v-for="(item,index) in operGoods.data" :key="index">
							<div @click="toDetail(item)">
								<img :src="item.goodsImg"/>
							</div>
							<h4>{{ item.goodsName }}</h4>
							<p>
								<strong>{{ `￥${item.shopPrice}` }}</strong>
							</p>
						</li>
					</ul>
				</div>
				<div
					class="empty-goods"
					v-else-if="!mainLoading&&operGoods.data&&operGoods.data.length===0"
				>
					<img src="../../assets/images/jx/zanwushuju.png" class="empty"/>
					<p>暂无数据</p>
				</div>
			</div>
		</div>
		<TabBar></TabBar>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Icon,
	Swipe,
	SwipeItem,
	Search,
	Sidebar,
	SidebarItem,
	Loading,
} from "vant";

Vue.use(Icon)
	.use(Swipe)
	.use(SwipeItem)
	.use(Search)
	.use(Sidebar)
	.use(SidebarItem)
	.use(Loading);
import TabBar from "../../components/TabBar";

// import BScroll from "better-scroll";
// import Data from "../../assets/data/goods.json";

import _ from "lodash";
import {Request} from "@/api/index";

export default {
	data() {
		return {
			active: 0,
			switchList: [
				{
					name: "江夏惠农",
				},
				{
					name: "江夏制造",
				},
			],
			value: "",
			goodsList: {},
			operGoods: {},
			activeKey: 0,
			loading: true,
			mainLoading: true,
		};
	},
	components: {
		TabBar,
	},
	beforeMount() {
		// console.log(this.$route.params)
		if (this.$route.params.active) {
			this.active = this.$route.params.active;
		}
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 32 - 59 - 170 - 50 + "px",
		};

		this.init();
	},
	mounted() {
	},
	created() {
	},
	computed: {},
	methods: {
		async onClick(name) {
			// console.log(name);
			// console.log(this.active);
			if (this.active === 1) {
				let operGoodsRes = await this.getGoodsList(
					this.switchList[1].catId
				);
				// console.log(operGoodsRes);

				operGoodsRes.data.map((item) => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg =
							"http://youyoujiang.com/" + item.goodsImg;
					}
				});
				this.operGoods = operGoodsRes;
				this.mainLoading = false;
			} else if (this.active === 0) {
				let menuList = this.switchList[0].childList;
				this.menuList = menuList;
				let firstMenu = await this.getGoodsList(
					menuList[this.activeKey].catId
				);
				firstMenu.data.map((item) => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg =
							"http://youyoujiang.com/" + item.goodsImg;
					}
				});

				this.goodsList = firstMenu;
				this.loading = false;
			}
		},
		async init() {
			let menuList = await this.getMenuList();
			// console.log(menuList);
			let arr = [];
			menuList.map((item) => {
				if (_.startsWith(item.catImg, "http")) {
					return;
				} else {
					item.catImg = "http://youyoujiang.com/" + item.catImg;
				}
				arr.push(item);
			});

			this.switchList = arr;
			// console.log(this.switchList);

			if (this.active === 0) {
				let menuList = this.switchList[0].childList;
				// console.log(menuList);
				this.menuList = menuList;
				let firstMenu = await this.getGoodsList(
					menuList[this.activeKey].catId
				);
				firstMenu.data.map((item) => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg =
							"http://youyoujiang.com/" + item.goodsImg;
					}
				});

				// console.log(firstMenu);
				this.goodsList = firstMenu;
				this.loading = false;
			} else if (this.active === 1) {
				let operGoodsRes = await this.getGoodsList(
					this.switchList[1].catId
				);

				operGoodsRes.data.map((item) => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg =
							"http://youyoujiang.com/" + item.goodsImg;
					}
				});
				this.operGoods = operGoodsRes;
				this.mainLoading = false;
			}
		},
		getMenuList() {
			return new Promise((resolve, reject) => {
				Request("jxyx", "weapp/goodscats/cats", "post")
					.then((res) => {
						if (res.status === 1) {
							resolve(res.data);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},

		getGoodsList(param) {
			return new Promise((resolve, reject) => {
				Request("jxyx", "weapp/goods/goodslistbycondition", "post", {
					catId: param,
				})
					.then((res) => {
						// console.log(res);
						if (res.status === 1) {
							resolve(res.data);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		async onChange(index) {
			// console.log(index);
			this.loading = true;
			this.$refs.goodScroll.scrollTop = 0;
			// console.log(this.menuList);
			let menuData = await this.getGoodsList(this.menuList[index].catId);
			menuData.data.map((item) => {
				if (_.startsWith(item.goodsImg, "http")) {
					return;
				} else {
					item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
				}
			});
			this.goodsList = menuData;
			this.loading = false;
		},
		toDetail(param) {
			this.$router.push({
				name: "Detail",
				query: {
					id: param.goodsId,
				},
			});
		},
		onSearch() {
			console.log(this.value)
			if (this.value) {
				this.$router.push({
					name: 'GoodsList',
					query: {
						searchValue: this.value
					}
				})
			}
		}
	},
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

.page-category {
	.van-tabs {
		height: 32px;

		.van-tabs__wrap {
			height: 32px;

			.van-tabs__nav {
				width: 200px;

				.van-tab {
					.van-tab__text {
						font-size: 14px;
					}

					&.van-tab--active {
						color: #7abb56;
						//font-weight: 600;
					}
				}
			}
		}
	}

	.van-search {
		padding: 11px px2rem(15) 14px;

		.van-search__content {
			border-radius: px2rem(5);
		}
	}

	.img-block {
		width: 100%;
		box-sizing: border-box;
		padding: 0 px2rem(15);
		height: 170px;
		border-radius: px2rem(5);
		position: relative;

		img {
			width: 100%;
			height: 170px;
		}

		.play {
			position: absolute;
			z-index: 2;
			width: px2rem(47);
			height: px2rem(47);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.main-container {
		width: 100%;
		box-sizing: border-box;
		padding: 15px px2rem(15) 0px;

		.main {
			text-align: center;
			height: 100%;

			.top {
				display: flex;
				align-items: center;
				justify-content: center;
				// margin-bottom: px2rem(20);
				line-height: 30px;
				// height: px2rem(80);
				img {
					width: 20px;
				}

				span {
					font-size: 14px;
					margin: 0 8px;
				}
			}

			.empty {
				width: px2rem(100);
				margin: px2rem(20) 0 px2rem(10);
			}

			p {
				font-size: 14px;
			}

			&.oper {
				display: flex;
				flex-direction: column;
				height: 100%;

				.oper-goods {
					flex: 1;
					height: 100%;
					// padding-bottom: 50px;
					ul {
						height: 100%;
						overflow-y: auto;
						display: flex;
						flex-wrap: wrap;

						li {
							font-size: 14px;
							width: px2rem(165);
							margin-right: px2rem(15);
							margin-bottom: px2rem(10);

							&:nth-child(2n) {
								margin-right: 0;
							}

							div {
								display: flex;
								align-items: center;
								justify-content: center;
								width: px2rem(165);
								height: px2rem(165);
								box-sizing: border-box;
								border: 1px solid rgba(169, 169, 169, 0.2);

								img {
									width: px2rem(160);
								}
							}

							h4 {
								text-align: left;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								line-clamp: 1;
								-webkit-box-orient: vertical;
								margin-bottom: px2rem(8);
								margin-top: px2rem(6);
							}

							p {
								text-align: left;

								strong {
									color: #7abb56;
								}
							}
						}
					}
				}
			}
		}

		.goods {
			height: 100%;
			display: flex;

			.menu-wrapper {
				height: 100%;
				width: px2rem(80);

				.van-sidebar {
					height: 100%;
					overflow-y: auto;

					.van-sidebar-item {
						padding: 15px 12px;
					}

					.van-sidebar-item--select {
						&::before {
							background-color: #7abb56;
						}

						.van-sidebar-item__text {
							color: #7abb56;
						}
					}
				}
			}

			.goods-wrapper {
				flex: 1;
				height: 100%;

				ul {
					height: 100%;
					overflow-y: auto;

					li {
						font-size: 14px;
					}

					.goods-item {
						display: flex;
						padding: px2rem(10);
						box-sizing: border-box;

						img {
							width: px2rem(80);
							height: px2rem(80);
						}

						section {
							flex: 1;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;

							div {
								flex: 1;
								height: 100%;
								padding-left: px2rem(10);
								display: flex;
								flex-direction: column;
								align-items: flex-start;
								justify-content: space-between;

								h4 {
									font-size: 14px;
									text-align: left;
								}

								span {
									color: #999;
									margin-bottom: px2rem(16);
								}

								p {
									strong {
										color: #7abb56;
										font-size: 14px;
									}

									del {
										color: #a1a1a1;
										font-size: 12px;
									}
								}
							}

							img {
								width: px2rem(20);
								height: px2rem(20);
								vertical-align: bottom;
							}
						}
					}
				}

				.van-loading {
					margin-top: px2rem(30);
				}
			}
		}
	}
}
</style>

