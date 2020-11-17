<template>
	<div class="page-index">
		<div class="banner"></div>
		<div class="content" @click="toHotPage">
			<img src="../../assets/images/bg/home-zhanwei.png" class="home-zhanwei"/>
			<img src="../../assets/images/jx/play.png" class="play"/>
		</div>
		<div class="category">
			<van-row type="flex" justify="space-between">
				<van-col
					span="4"
					v-for="(item,index) in category"
					:key="index"
					@click="choose(item)"
				>
					<img :src="item.catImg"/>
					<span>{{ item.catName }}</span>
				</van-col>
			</van-row>
		</div>
		<div class="new">
			<div class="top">
				<div class="title">
					<van-tag color="rgb(122, 187, 86)">NEW</van-tag>
					<span class="strong">最新上架</span>
				</div>
				<div class="more" @click="toNewPage">
					<span>查看更多</span>
					<van-icon name="arrow"/>
				</div>
			</div>
			<div class="_swiper">
				<van-swipe :loop="false" :width="115" :show-indicators="false">
					<van-swipe-item v-for="(item,index) in newGoodsList" :key="index">
						<div @click="toDetail(item)">
							<img :src="item.goodsImg"/>
							<van-button
								color="linear-gradient(to right, #7abb56, #F4F4F4)"
							>{{ `已抢${item.visitNum}` }}
							</van-button>
						</div>
						<p>
							<span class="price">￥{{ item.shopPrice }}</span>
							<del v-if="item.marketPrice > item.shopPrice">{{ item.marketPrice }}</del>
						</p>
					</van-swipe-item>
				</van-swipe>
			</div>
		</div>
		<div class="container">
			<van-tabs v-model="active" line-height="0" @click="onClick">
				<van-tab v-for="(item,index) in switchList" :key="index" :title="item.value">
					<template #title>
						<van-icon name="more-o"/>
						{{ item.name }}
					</template>
				</van-tab>
			</van-tabs>
			<div class="block">
				<ul>
					<li v-for="(subItem,subIndex) in switchListData" :key="subIndex">
						<img :src="subItem.goodsImg" @click="toDetail(subItem)"/>
						<h4>{{ subItem.goodsName }}</h4>
						<p>
							<span class="price">￥{{ subItem.shopPrice }}</span>
							<del
								v-if="subItem.marketPrice > subItem.shopPrice"
							>{{ subItem.marketPrice }}
							</del>
						</p>
					</li>
				</ul>
			</div>
		</div>
		<TabBar ref="mychild"></TabBar>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Col,
	Row,
	Cell,
	CellGroup,
	Tag,
	Icon,
	Swipe,
	SwipeItem,
	Button,
	Tab,
	Tabs,
	Loading,
} from "vant";

Vue.use(Col)
	.use(Row)
	.use(Cell)
	.use(CellGroup)
	.use(Tag)
	.use(Icon)
	.use(Swipe)
	.use(SwipeItem)
	.use(Button)
	.use(Tab)
	.use(Tabs)
	.use(Loading);

import _ from "lodash";
import {Request} from "@/api/index";
import TabBar from "../../components/TabBar";
import HandleToast from '@/utils/toast';

export default {
	data() {
		return {
			category: [],
			newGoodsList: [],
			active: 0,
			switchList: [
				{
					name: "推荐好品",
					value: "recom",
				},
				{
					name: "热销排行",
					value: "hot",
				},
			],
			switchListData: [],
		};
	},
	components: {
		TabBar,
	},
	mounted() {
		this.init();
		if (!localStorage.getItem('localProvinceCityCountry')) {
			this.addressInit();
		}
	},
	methods: {
		init() {
			Request("main", "weapp/articles/homePageCat").then((res) => {
				// console.log(res);
				if (res.status === 1) {
					res.data.map((item) => {
						if (_.startsWith(item.catImg, "http")) {
							return;
						} else {
							item.catImg =
								"http://youyoujiang.com/" + item.catImg;
						}
					});
					// console.log(res.data)
					this.category = res.data;
				}
			});

			this.getGoods("new")
				.then((res) => {
					if (res.status === 1) {
						res.data.map((item) => {
							if (_.startsWith(item.goodsImg, "http")) {
								return;
							} else {
								item.goodsImg =
									"http://youyoujiang.com/" + item.goodsImg;
							}
						});

						this.newGoodsList = res.data;
						// console.log(this.newGoodsList)
					}
				})
				.catch((err) => {
					console.log(err);
				});

			this.getGoods("recom")
				.then((res) => {
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
						this.switchListData = res.data;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getGoods(param) {
			return Request("jxyx", "weapp/goods/getgoodslist", "post", {
				type: param,
				num: 5,
			});
		},

		onClick(name, title) {
			// console.log(name, title);
			HandleToast('加载中', 'loadType', 300)
			this.getGoods(title)
				.then((res) => {
					if (res.status === 1) {
						res.data.map((item) => {
							if (_.startsWith(item.goodsImg, "http")) {
								return;
							} else {
								item.goodsImg =
									"http://youyoujiang.com/" + item.goodsImg;
							}
						});
						this.switchListData = res.data;
						// console.log(this.switchListData)
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		choose(param) {
			switch (param.catName) {
				case "江夏惠农":
					// this.$refs.mychild.changeByParent(1);
					this.$router.replace({
						name: "Category",
						params: {active: 0},
					});
					break;
				case "江夏制造":
					this.$router.replace({
						name: "Category",
						params: {active: 1},
					});
					break;
				case "江夏科创":
					this.$router.push({
						name: "Science",
					});
					break;
				case "江夏文旅":
					this.$router.push({
						name: "Culture",
					});
					break;
				case "江夏健康":
					this.$router.push({
						name: "Healthy",
					});
					break;
			}
		},
		toNewPage() {
			this.$router.push({
				name: "Racking",
			});
		},
		toHotPage() {
			this.$router.push({
				name: "Hot",
			});
		},
		toDetail(param) {
			// console.log(param);
			this.$router.push({
				name: "Detail",
				query: {
					id: param.goodsId,
				},
			});
		},
		/*请求省市区*/
		async addressInit() {
			let AllProvince = await this.getProvinceCityCounty();
			this.AllProvince = AllProvince;
			// console.log('所有省份:', AllProvince);
			this.mapCityData()
		},
		async mapCityData() {
			// console.log('Start');
			const promise = this.AllProvince.map(async item => {
				const cityRes = await this.getProvinceCityCounty(item.areaId);
				return cityRes;
			})
			const AllCity = await Promise.all(promise);
			this.AllCity = AllCity;

			let ProvinceCity = []

			if (this.AllCity && this.AllCity.length > 0) {
				// console.log(this.AllCity)

				this.AllProvince.map((el, index) => {
					ProvinceCity.push({
						text: this.AllProvince[index].areaName,
						areaId: this.AllProvince[index].areaId,
						children: this.AllCity[index]
					})
				})
				// console.log(ProvinceCity)
				this.ProvinceCity = ProvinceCity;
				if (this.ProvinceCity && this.ProvinceCity.length > 0) {
					// console.log(this.ProvinceCity);
					let ProvinceCityCountry = [];
					this.ProvinceCity.map(item => {
						// console.log(item)
						item.children.map(subItem => {
							subItem['text'] = subItem.areaName;
						})
					})
					// console.log(this.ProvinceCity);
					let boolList = []
					this.ProvinceCity.map(item => {
						let result = item.children.every(subItem => {
							return subItem.text;
						})
						boolList.push(result);
					})
					if (boolList.every(item => item)) {
						this.checkCountryData(this.ProvinceCity);
					}
				}
			}
		},
		async checkCountryData(param) {
			console.log('开始')
			// console.log(param)
			const promise1 = param.map(async (item, index) => {
				// console.log(item)
				let countryRes = await this.mapCountryData(item);
				return countryRes;
			})

			const allCityCountry = await Promise.all(promise1);
			console.log('所有区县:', allCityCountry);
			// console.log('所有省份城市:', this.ProvinceCity)

			this.ProvinceCity.map((item, index) => {
				item.children.map((subItem, subIndex) => {
					subItem['children'] = allCityCountry[index][subIndex]
				})
			})
			console.log('所有省份城市:', this.ProvinceCity)
			let boolList = []
			this.ProvinceCity.map((item, index) => {
				let result = item.children.every(subItem => {
					if (index === 24) {
						return true;
					}
					return subItem.children.length > 0;
				})
				boolList.push(result);
			})
			console.log(boolList)
			if (boolList.every(item => item)) {
				this.canClick = true;
				if (!localStorage.getItem('localProvinceCityCountry')) {
					localStorage.setItem('localProvinceCityCountry', JSON.stringify(this.ProvinceCity));
					localStorage.setItem('canClick', true)
				}
			}
			console.log('结束')
		},
		async mapCountryData(param) {
			const promise = param.children.map(async item => {
				const res = await this.getProvinceCityCounty(item.areaId);
				// console.log(res);
				return res;
			})
			const thisCityCountry = await Promise.all(promise);
			return thisCityCountry;
		},
		getProvinceCityCounty(param = 0) {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/users/listQuery", "post", {
					parentId: param,
				}).then(res => {
					if (res.status === 1) {
						// console.log(res)
						res.data.map(item => {
							item['text'] = item.areaName
						})
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
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

.page-index {
	position: relative;
	bottom: 50px;

	.banner {
		width: 100%;
		height: px2rem(260);
		background-image: url("../../assets/images/bg/banner.png");
		background-size: px2rem(375) auto;
		background-repeat: no-repeat;
		background-position-y: px2rem(50);
	}

	.content {
		position: absolute;
		top: px2rem(183);
		left: 50%;
		transform: translateX(-50%);
		width: px2rem(345);
		height: px2rem(194);
		z-index: 1;

		.home-zhanwei {
			width: px2rem(345);
			height: px2rem(194);
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

	.category {
		width: 100%;
		padding: 0 px2rem(15);
		box-sizing: border-box;
		height: px2rem(105);
		margin-top: px2rem(108);

		.van-row {
			height: px2rem(105);
			padding: px2rem(26) 0 px2rem(16);
			box-sizing: border-box;

			.van-col {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;
				align-items: center;

				img {
					width: px2rem(46);
					height: px2rem(46);
					margin-bottom: px2rem(4);
				}

				span {
					font-size: 12px;
					text-align: center;
					font-family: PingFangSC-Medium;
				}
			}
		}
	}

	.new {
		width: 100%;
		padding: 0 px2rem(15);
		box-sizing: border-box;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		margin-top: px2rem(15);

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				display: flex;
				align-items: center;

				.van-tag {
					font-size: 10px;
				}

				span {
					&.strong {
						font-weight: 800;
						font-size: 16px;
						margin-left: px2rem(4);
					}
				}
			}

			.more {
				color: #a1a1a1;
				display: flex;
				align-items: center;
			}
		}

		._swiper {
			margin-top: px2rem(10);

			.van-swipe {
				min-height: 122px;

				.van-swipe-item {
					box-sizing: border-box;
					padding-right: 15px;

					div {
						position: relative;
						margin-bottom: px2rem(6);

						.van-button {
							position: absolute;
							bottom: 0;
							left: 0;
							width: 100px;
							height: 14px;

							.van-button__content {
								justify-content: flex-start;
								padding-left: 3px;
							}

							.van-button__text {
								font-size: 12px;
							}
						}
					}

					img {
						width: 100px;
						height: 100px;
						border-radius: 5px;
					}

					p {
						.price {
							color: #7abb56;
							font-weight: 600;
						}

						del {
							color: #a1a1a1;
							font-size: 12px;
						}
					}
				}
			}
		}

		.custom-title {
			margin-right: 4px;
			vertical-align: middle;
		}

		.search-icon {
			font-size: 16px;
			line-height: inherit;
		}
	}

	.container {
		width: 100%;
		padding: 0 px2rem(15);
		box-sizing: border-box;
		margin-top: px2rem(15);

		.van-tabs {
			.van-tabs__wrap {
				.van-tabs__nav {
					.van-tab {
						.van-icon {
							&::before {
								content: "";
								width: 20px;
								height: 20px;
								background-image: url("../../assets/images/jx/head-select-no.png");
								background-size: 20px;
							}
						}

						&.van-tab--active {
							color: #7abb56;

							.van-icon {
								&::before {
									background-image: url("../../assets/images/jx/head-select.png");
								}
							}
						}

						.van-tab__text {
							display: flex;
						}
					}
				}
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
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						line-clamp: 1;
						-webkit-box-orient: vertical;
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

