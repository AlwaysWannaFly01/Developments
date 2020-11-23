<template>
	<div class="page-category">
		<van-tabs v-model="active" line-height="2" @click="onClick" color="#7abb56">
			<van-tab v-for="(item,index) in switchList" :key="index">
				<template #title>{{ item.catName }}</template>
			</van-tab>
		</van-tabs>
		<van-search v-model="value" placeholder="点击搜索商品名称" @search="onSearch" ref="inputText"/>
		<div class="img-block">
			<img src="../../assets/images/bg/live_farm.png" v-if="active===0"/>
			<img src="../../assets/images/bg/live_oper.png" v-if="active===1"/>
			<!--			<img src="../../assets/images/jx/play.png" class="play"/>-->
		</div>

		<div class="main-container" :style="mainHeight">
			<div v-if="active===0" class="main goods">
				<!-- 分类列表 -->
				<div class="menu-wrapper">
					<van-sidebar v-model="activeKey" @change="onChange" class="menuWrapper">
						<van-sidebar-item
							:title="item.catName"
							v-for="(item,index) in switchList[0].childList"
							:key="index"
						/>
					</van-sidebar>
				</div>
				<!-- 商品列表 -->
				<div class="goods-wrapper">
					<van-list
						class="goodWrapper"
						:finished="finished"
						v-model="loading"
						finished-text="没有更多了"
						:immediate-check="false"
						@load="loadMore"
						offset="30"
					>
						<van-cell v-for="(item,index) in goodsList" :key="index" class="goods-item"
								  @click="toDetail(item)">
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
						</van-cell>
					</van-list>
				</div>
			</div>
			<div v-if="active===1" class="main oper">
				<!-- <div class="top">
					<img src="../../assets/images/jx/label_icon.png" />
					<span>全部商品</span>
					<img src="../../assets/images/jx/label_icon.png" />
				</div>-->
				<div
					class="oper-goods"
					v-if="!operEmpty&&operGoods.length>0"
				>
					<van-list
						class="operaWrapper"
						:finished="operFinished"
						v-model="operLoading"
						finished-text="没有更多了"
						:immediate-check="false"
						@load="loadMoreOper"
						offset="30"
					>
						<van-cell v-for="(item,index) in operGoods" :key="index">
							<div @click="toDetail(item)">
								<img :src="item.goodsImg"/>
							</div>
							<h4>{{ item.goodsName }}</h4>
							<p>
								<strong>{{ `￥${item.shopPrice}` }}</strong>
							</p>
						</van-cell>
					</van-list>
				</div>
				<div
					class="empty-goods"
					v-if="operEmpty&&operGoods.length===0"
				>
					<img src="../../assets/images/jx/zanwushuju.png" class="empty"/>
					<p>暂无数据</p>
				</div>
			</div>
		</div>
		<TabBar ref="mychild"></TabBar>
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
	List
} from "vant";

Vue.use(Icon)
	.use(Swipe)
	.use(SwipeItem)
	.use(Search)
	.use(Sidebar)
	.use(SidebarItem)
	.use(List)
	.use(Loading);
import TabBar from "../../components/TabBar";
import _ from "lodash";
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

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
			goodsList: [],
			operGoods: [],
			activeKey: 0,
			menuScrollTop: 0,
			goodScrollTop: 0,
			operaScrollTop: 0,
			finished: false,
			loading: false,
			queryParams: {
				page: 1,
				pagesize: 10
			},
			operFinished: false,
			operLoading: false,
			operEmpty: false
		};
	},
	components: {
		TabBar,
	},
	beforeMount() {
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 32 - 59 - 170 - 50 + "px",
		};
		this.active = this.$route.params.active ? this.$route.params.active : 0;
		this.init();
	},
	async activated() {
		// console.log(this.$route.params)
		// this.active = this.$route.params.active ? this.$route.params.active : 0;
		// await this.init();

		// console.log(this.menuScrollTop)

		const menuContent = document.querySelector('.menuWrapper'); // 列表的外层容器
		if (menuContent) {
			menuContent.scrollTop = this.menuScrollTop;
		}
		// console.log(this.goodScrollTop)

		const goodContent = document.querySelector('.goodWrapper');
		// console.log(goodContent)
		if (goodContent) {
			goodContent.scrollTop = this.goodScrollTop;
		}
		if (this.active === 1) {
			const operaContent = document.querySelector('.operaWrapper');
			// console.log(operaContent)
			if (operaContent) {
				operaContent.scrollTop = this.operaScrollTop;
			}
		}

	},
	beforeRouteEnter(to, from, next) {
		// console.log('to ', to)
		// console.log('from ', from)
		// console.log(this.active)
		next(vm => {
			// console.log(vm)
			// console.log('to ', to)
			// console.log('from ', from)
			vm.$refs.mychild.changeByParent(1);
			if (to.params.active === 1) {
				vm.active = 1;
				vm.onClick(to.params.active);
			} else if (to.params.active === 0) {
				vm.active = 0;
				vm.onClick(to.params.active);
			}
		})
	},
	beforeRouteLeave(to, from, next) {
		const menuContent = document.querySelector('.menuWrapper');
		const menuScrollTop = menuContent ? menuContent.scrollTop : 0;
		this.menuScrollTop = menuScrollTop;

		const goodContent = document.querySelector('.goodWrapper');
		const goodScrollTop = goodContent ? goodContent.scrollTop : 0;
		// console.log(goodScrollTop)
		this.goodScrollTop = goodScrollTop;

		const operaContent = document.querySelector('.operaWrapper');
		const operaScrollTop = operaContent ? operaContent.scrollTop : 0;
		this.operaScrollTop = operaScrollTop;
		// console.log('to ', to)
		// console.log('from ', from)
		next();
	},
	computed: {},
	methods: {
		async onClick(name) {
			// console.log(name);
			// console.log(this.active);
			HandleToast('加载中', 'loadType', 300);
			// console.log(this.switchList);
			this.activeKey = 0;
			let isTrue = await this.refresh();
			if (isTrue) {
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

					if (parseInt(operGoodsRes.current_page) < operGoodsRes.last_page) {
						this.operFinished = false;
						this.operLoading = false;
						this.operGoods = this.operGoods.concat(operGoodsRes.data);
					} else if (parseInt(operGoodsRes.current_page) === operGoodsRes.last_page) {
						this.operFinished = true;
						this.operLoading = false;
						this.operGoods = this.operGoods.concat(operGoodsRes.data);
						// console.log(this.operGoods)
					}
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

					if (parseInt(firstMenu.current_page) < firstMenu.last_page) {
						this.finished = false;
						this.loading = false;
						this.goodsList = this.goodsList.concat(firstMenu.data);
					} else if (parseInt(firstMenu.current_page) === firstMenu.last_page) {
						this.finished = true;
						this.loading = false;
						this.goodsList = this.goodsList.concat(firstMenu.data);
					}
				}
			}
		},
		async init() {
			// console.log('init触发')
			HandleToast('加载中', 'loadType', 300);
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
				if (parseInt(firstMenu.current_page) < firstMenu.last_page) {
					this.finished = false;
					this.loading = false;
					this.goodsList = this.goodsList.concat(firstMenu.data);
				} else if (parseInt(firstMenu.current_page) === firstMenu.last_page) {
					this.finished = true;
					this.loading = false;
					this.goodsList = this.goodsList.concat(firstMenu.data);
				}
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
				// this.operGoods = operGoodsRes;
				if (parseInt(operGoodsRes.current_page) < operGoodsRes.last_page) {
					this.operFinished = false;
					this.operLoading = false;
					this.operGoods = this.operGoods.concat(operGoodsRes.data);
				} else if (parseInt(operGoodsRes.current_page) === operGoodsRes.last_page) {
					this.operFinished = true;
					this.operLoading = false;
					this.operGoods = this.operGoods.concat(operGoodsRes.data);
				}
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
					page: this.queryParams.page,
					pagesize: this.queryParams.pagesize,
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
			const goodContent = document.querySelector('.goodWrapper');
			// console.log(goodContent)
			if (goodContent) {
				goodContent.scrollTop = 0;
			}
			this.activeKey = index;
			console.log(this.menuList)
			let isTrue = await this.refresh();
			if (isTrue) {
				let menuData = await this.getGoodsList(this.menuList[index].catId);
				menuData.data.map((item) => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
					}
				});
				// console.log(menuData)
				if (parseInt(menuData.current_page) < menuData.last_page) {
					this.finished = false;
					this.loading = false;
					this.goodsList = this.goodsList.concat(menuData.data);
				} else if (parseInt(menuData.current_page) === menuData.last_page) {
					this.finished = true;
					this.loading = false;
					this.goodsList = this.goodsList.concat(menuData.data);
					if (this.goodsList.length === 0) {
						this.operEmpty = true
					}
				}
			}
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
			if (this.value) {
				this.$refs.inputText.blur();//软键盘隐藏
				/*解决输入框弹起软键盘,跳转到下一页,获取window.innerHeight计算错误的问题*/
				setTimeout(() => {
					this.$router.push({
						name: 'GoodsList',
						query: {
							searchValue: this.value
						}
					})
				}, 400)
			} else {
				HandleToast('请填写要搜索的产品信息', null, 500)
			}
		},
		async loadMore() {
			this.queryParams.page++;
			this.loading = true;
			// console.log(this.queryParams.page)
			// console.log(this.activeKey)
			// console.log(this.menuList)
			const result = await this.getGoodsList(this.menuList[this.activeKey].catId)
			result.data.map((item) => {
				if (_.startsWith(item.goodsImg, "http")) {
					return;
				} else {
					item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
				}
			});
			// console.log(result)
			if (parseInt(result.current_page) < result.last_page) {
				this.finished = false;
				this.loading = false;
				this.goodsList = this.goodsList.concat(result.data);
			} else if (parseInt(result.current_page) === result.last_page) {
				this.finished = true;
				this.loading = false;
				this.goodsList = this.goodsList.concat(result.data);
			}
		},
		async loadMoreOper() {

		},
		async refresh() {
			return new Promise((resolve, reject) => {
				this.queryParams.page = 1;
				this.goodsList = [];
				this.operGoods = [];
				this.loading = true;
				this.finished = false;
				setTimeout(() => {
					if (this.goodsList.length === 0) {
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

					.van-list {
						height: 100%;
						overflow-y: auto;
						display: flex;
						flex-wrap: wrap;

						.van-cell {
							width: 50%;
							padding: 0;
							margin-bottom: px2rem(10);

							&::after {
								border-bottom: none;
							}

							.van-cell__value {
								font-size: 14px;
								width: px2rem(165);

								&:nth-child(2n) {
									margin-right: 0;
								}

								div {
									display: flex;
									align-items: center;
									justify-content: center;
									box-sizing: border-box;
									width: px2rem(165);
									height: px2rem(165);
									box-sizing: border-box;
									border: 1px solid rgba(169, 169, 169, 0.2);

									img {
										width: px2rem(158);
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

						.van-list__loading {
							width: 100%;
						}

						.van-list__finished-text {
							width: 100%;
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

				.van-list {
					height: 100%;
					overflow-y: auto;

					.van-cell {
						font-size: 14px;
						padding: 0;
					}

					.goods-item {
						.van-cell__value {
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
										overflow: hidden;
										text-overflow: ellipsis;
										display: -webkit-box;
										-webkit-line-clamp: 1;
										line-clamp: 1;
										-webkit-box-orient: vertical;
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

					.van-list__loading {
						.van-loading {
							margin-top: 0;
						}
					}

					.van-list__finished-text {
						line-height: 40px;
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

