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
				</div>
				<div class="item" @click="handleClick(2)">
					<img src="../../assets/images/dfh.png"/>
					<span>待发货</span>
				</div>
				<div class="item" @click="handleClick(3)">
					<img src="../../assets/images/dsh.png"/>
					<span>待收货</span>
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
			canClick: false
		};
	},
	components: {TabBar},
	async mounted() {
		let res = await this.interMyIndex();
		console.log(res)
		this.serviceTel = res.serviceTel;
		// console.log(JSON.parse(localStorage.getItem('localProvinceCityCountry')))
		if (!localStorage.getItem('localProvinceCityCountry')) {
			this.init()
		}
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
		},

		/*请求省市区*/
		async init() {
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
		},
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

				img {
					width: px2rem(25);
					margin-bottom: px2rem(12);
				}

				span {
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

