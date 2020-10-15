<template>
	<div class="page-goodslist">
		<van-search
			v-model="searchValue"
			shape="round"
			background="#7abb56"
			placeholder="请输入搜索关键词"
			show-action
			clearable
			clear-trigger="focus"
			class="searchInput"
			@search="onSearch"
		>
			<template #action>
				<div @click="clickSearch">
					<van-icon name="wap-nav" size="20" color="#fff" v-if="displayGrid"/>
					<van-icon name="apps-o" size="20" color="#fff" v-else/>
				</div>
			</template>
		</van-search>
		<div class="sort-group">
			<div class="item">
				<van-button type="default" size="mini">
					默认
				</van-button>
			</div>
			<div class="item">
				<van-button type="default" size="mini" @click="priceOrderBy">
					价格
				</van-button>

				<img src="../../assets/images/horn.png">
			</div>
			<div class="item">
				<van-button type="default" size="mini">
					销量
				</van-button>
				<img src="../../assets/images/horn.png">
			</div>
			<div class="item">
				<van-button type="default" size="mini">
					人气
				</van-button>
				<img src="../../assets/images/horn.png">
			</div>
		</div>
		<div class="container" :style="mainHeight">
			<van-list
				v-if="displayGrid"
				v-model="loading"
				:finished="finished"
				class="grid"
				:style="mainHeight"
				finished-text="没有更多了"
				@load="onLoad"
				offset="30"
			>
				<van-cell v-for="(item,index) in searchList" :key="index">
					<img :src="item.goodsImg">
					<div>
						<h3>{{ item.goodsName }}</h3>
						<strong>{{ `￥${item.costPrice}` }}</strong>
						<p>
							<del>{{ `￥${item.marketPrice}` }}</del>
							<span>{{ `已售${item.saleNum}` }}</span>
						</p>
					</div>
				</van-cell>
			</van-list>

			<van-list
				v-else
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				:style="mainHeight"
				class="w100"
				@load="onLoad"
				offset="30"
			>
				<van-cell v-for="(item,index) in searchList" :key="index">
					<img :src="item.goodsImg">
					<div>
						<h3>{{ item.goodsName }}</h3>
						<strong>{{ `￥${item.costPrice}` }}</strong>
						<p>
							<del>{{ `￥${item.marketPrice}` }}</del>
							<span>{{ `已售${item.saleNum}` }}</span>
						</p>
					</div>
				</van-cell>
			</van-list>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import {Search, Button, List, Icon} from 'vant';

Vue.use(Search).use(Button).use(List).use(Icon);
import _ from "lodash";
import {Request} from "@/api/index";

export default {
	name: "goodsList",
	data() {
		return {
			searchValue: '',
			searchList: [],
			loading: false,
			finished: false,
			queryParams: {
				page: 0,
				priceOrder: -1
			},
			displayGrid: true
		}
	},
	beforeMount() {
		this.searchValue = this.$route.query.searchValue;
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 54 - 41 + "px",
		};
	},

	methods: {
		search(param) {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/goods/goodslistbycondition", "post", {
					keyword: param ? param : '',
					page: this.queryParams.page,
					desc: this.queryParams.priceOrder
				}).then(res => {
					if (res.status === 1) {
						resolve(res)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		},
		async onSearch() {
			let isTrue = await this.refresh();
			if (isTrue) {
				let result = await this.search(this.searchValue);
				if (result.status === 1) {
					result.data.data.map(item => {
						if (_.startsWith(item.goodsImg, "http")) {
							return;
						} else {
							item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
						}
					})
					if (parseInt(result.data.current_page) < result.data.last_page) {
						this.finished = false;
						this.loading = false;
						this.searchList = this.searchList.concat(result.data.data);
					} else if (parseInt(result.data.current_page) === result.data.last_page) {
						this.finished = true;
						this.loading = false;
						this.searchList = this.searchList.concat(result.data.data);
					}
				}
			}
		},
		async onLoad() {
			this.queryParams.page++;
			this.loading = true;
			const result = await this.search(this.searchValue);
			console.log(result)
			if (result.status === 1) {
				result.data.data.map(item => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
					}
				})
				if (parseInt(result.data.current_page) < result.data.last_page) {
					setTimeout(() => {
						this.loading = false;
						this.searchList = this.searchList.concat(result.data.data);
						this.finished = false;
					}, 600)
				} else if (parseInt(result.data.current_page) === result.data.last_page) {
					this.loading = false;
					this.finished = true;
					this.searchList = this.searchList.concat(result.data.data);
				}
			}
		},
		clickSearch() {
			this.displayGrid = !this.displayGrid;
		},
		async priceOrderBy() {
			if (this.queryParams.priceOrder < 1) {
				this.queryParams.priceOrder++;
			} else {
				this.queryParams.priceOrder = -1;
			}
			console.log(this.queryParams.priceOrder);
			let isTrue = await this.refresh();
			if (isTrue) {
				let result = await this.search();
				console.log(result)
				if (result.status === 1) {
					result.data.data.map(item => {
						if (_.startsWith(item.goodsImg, "http")) {
							return;
						} else {
							item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
						}
					})
					if (parseInt(result.data.current_page) < result.data.last_page) {
						this.finished = false;
						this.loading = false;
						this.searchList = this.searchList.concat(result.data.data);
					} else if (parseInt(result.data.current_page) === result.data.last_page) {
						this.finished = true;
						this.loading = false;
						this.searchList = this.searchList.concat(result.data.data);
					}
				}
			}

		},
		async refresh() {
			return new Promise((resolve, reject) => {
				this.queryParams.page = 1;
				this.searchList = [];
				this.loading = true;
				this.finished = false;
				setTimeout(() => {
					if (this.searchList.length === 0) {
						resolve(true)
					}
				}, 500)
			})
		},
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-goodslist {
	.searchInput {
		.van-search__action {
			div {
				display: flex;
				align-items: center;
			}

			&:active {
				background-color: #7abb56;
			}
		}
	}

	.sort-group {
		display: flex;
		border-bottom: 1px solid rgba(161, 161, 161, .3);

		.item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40px;

			.van-button {
				border-color: transparent;
			}

			img {
				width: px2rem(12);
				height: px2rem(12);
			}
		}
	}

	.container {
		.w100 {
			width: 100%;
			overflow-y: auto;
			padding: 0 px2rem(15);
			box-sizing: border-box;

			.van-cell {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				padding: px2rem(10) 0;

				&::after {
					right: 0;
					left: 0;
				}

				.van-cell__value {
					display: flex;

					img {
						width: px2rem(80);
						height: px2rem(80);
					}

					div {
						flex: 1;
						padding-left: px2rem(10);

						h3 {
							font-size: 16px;
							font-weight: 700;
						}

						strong {
							font-size: 14px;
							color: #7abb56;
							font-weight: 700;
						}

						p {
							display: flex;
							justify-content: space-between;

							del {
								color: #afafaf;
								font-size: 12px;
							}

							span {
								color: #afafaf;
								font-size: 12px;
							}
						}
					}
				}
			}
		}

		.grid {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			padding: px2rem(10) px2rem(10) px2rem(0);
			box-sizing: border-box;
			background-color: rgba(249, 249, 249, .8);
			overflow-y: auto;

			.van-cell {
				border-radius: px2rem(4);

				&:nth-child(2n-1) {
					margin-right: px2rem(11);
				}

				margin-bottom: px2rem(10);
				width: px2rem(172);
				padding: px2rem(10);
				box-sizing: border-box;

				&::after {
					right: 0;
					left: 0;
					border-bottom: none;
				}

				.van-cell__value {
					display: flex;
					flex-direction: column;
					align-items: center;

					img {
						width: px2rem(152);
						height: px2rem(152);
					}

					div {
						flex: 1;
						width: 100%;
						margin-top: px2rem(10);
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						h3 {
							font-size: 16px;
							font-weight: 700;
						}

						strong {
							font-size: 14px;
							color: #7abb56;
							font-weight: 700;
						}

						p {
							display: flex;
							justify-content: space-between;

							del {
								color: #afafaf;
								font-size: 12px;
							}

							span {
								color: #afafaf;
								font-size: 12px;
							}
						}
					}
				}
			}

			.van-list__finished-text {
				width: 100%;
			}

			.van-list__loading {
				width: 100%;
				margin-top: px2rem(-10);
			}
		}
	}
}

</style>
