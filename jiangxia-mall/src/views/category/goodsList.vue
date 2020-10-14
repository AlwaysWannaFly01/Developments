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
				<van-button type="default" size="mini">
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
				class="grid"
				:style="mainHeight"
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
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				:style="mainHeight"
				class="w100"
				@load="onLoad"
				offset="30"
				v-else
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
			finished: true,
			queryParams: {
				page: 1
			},
			displayGrid: true
		}
	},
	beforeMount() {
		this.searchValue = this.$route.query.searchValue;
		this.init(this.searchValue);

		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 54 - 41 + "px",
		};
	},

	methods: {
		async init(param) {
			const result = await this.search(param);
			// console.log(result)
			if (result.status === 1) {
				result.data.data.map(item => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
					}
				})
				this.searchList = result.data.data;
			}
		},
		search(param) {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/goods/goodslistbycondition", "post", {
					keyword: param ? param : '',
					page: this.queryParams.page
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
			const {searchValue} = this;
			if (!searchValue) {
				this.searchValue = '';
				let isTrue = await this.refresh();
				// console.log(isTrue);
				if (isTrue) {
					const result = await this.search();
					console.log(result)
					if (result.status === 1) {
						result.data.data.map(item => {
							if (_.startsWith(item.goodsImg, "http")) {
								return;
							} else {
								item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
							}
						})
						if (parseInt(result.data.current_page) === result.data.last_page) {
							this.finished = true;
							this.loading = false;
						} else {
							this.searchList = result.data.data;
							this.finished = false;
							this.loading = false;
						}
					}
				}
			} else {
				console.log(searchValue)
			}
		},
		async onLoad() {
			this.queryParams.page++;
			this.loading = true;
			const result = await this.search();
			console.log(result)
			if (result.status === 1) {
				result.data.data.map(item => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
					}
				})
				if (parseInt(result.data.current_page) === result.data.last_page) {
					this.finished = true;
					this.loading = false;
				} else {
					setTimeout(() => {
						this.loading = false;
						this.searchList = this.searchList.concat(result.data.data);
						this.finished = false;
					}, 600)
				}
			}
		},
		clickSearch() {
			this.displayGrid = !this.displayGrid;
		},
		async refresh() {
			return new Promise((resolve, reject) => {
				this.queryParams = {
					page: 1
				}
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
			padding: px2rem(10);
			box-sizing: border-box;
			background-color: #ebedf0;
			overflow-y: auto;
			.van-cell {
				border-radius: px2rem(4);
				&:nth-child(2n-1) {
					margin-right: px2rem(11);
				}
				margin-bottom: px2rem(10);
				width: px2rem(172);

				.van-cell__value {
					display: flex;
					flex-direction: column;
					align-items: center;
					img {
						width: px2rem(80);
					}
				}
			}
		}
	}
}

</style>
