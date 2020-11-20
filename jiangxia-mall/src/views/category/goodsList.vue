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
				<van-button type="default" size="mini" @click="defaultQuery">
					默认
				</van-button>
			</div>
			<div class="item">
				<van-button type="default" size="mini" @click="priceOrderBy">
					价格
				</van-button>
				<img src="../../assets/images/horn.png" v-if="queryParams.priceOrder === -1">
				<img src="../../assets/images/down.png"
					 v-else-if="queryParams.condition===1&&queryParams.priceOrder === 0">
				<img src="../../assets/images/up.png"
					 v-else-if="queryParams.condition===1&&queryParams.priceOrder === 1">
			</div>
			<div class="item">
				<van-button type="default" size="mini" @click="saleOrderBy">
					销量
				</van-button>
				<img src="../../assets/images/horn.png" v-if="queryParams.saleOrder === -1">
				<img src="../../assets/images/down.png"
					 v-else-if="queryParams.condition===0&&queryParams.saleOrder === 0">
				<img src="../../assets/images/up.png"
					 v-else-if="queryParams.condition===0&&queryParams.saleOrder === 1">
			</div>
			<div class="item">
				<van-button type="default" size="mini" @click="popularOrderBy">
					人气
				</van-button>
				<img src="../../assets/images/horn.png" v-if="queryParams.popularOrder === -1">
				<img src="../../assets/images/down.png"
					 v-else-if="queryParams.condition===2&&queryParams.popularOrder === 0">
				<img src="../../assets/images/up.png"
					 v-else-if="queryParams.condition===2&&queryParams.popularOrder === 1">
			</div>
		</div>
		<div class="container" :style="mainHeight">
			<van-list
				v-if="displayGrid"
				v-model="loading"
				:finished="finished"
				class="grid scrollContent"
				:style="mainHeight"
				finished-text="没有更多了"
				@load="onLoad"
				offset="30"
				:immediate-check="false"
			>
				<van-cell v-for="(item,index) in searchList" :key="index" @click="toDetail(item)">
					<img :src="item.goodsImg">
					<div>
						<h3>{{ item.goodsName }}</h3>
						<strong>{{ `￥${item.shopPrice}` }}</strong>
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
				class="w100 scrollContent"
				@load="onLoad"
				offset="30"
			>
				<van-cell v-for="(item,index) in searchList" :key="index" @click="toDetail(item)">
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
				condition: '',
				priceOrder: -1,
				saleOrder: -1,
				popularOrder: -1
			},
			displayGrid: true,
			scroll: 0,
		}
	},
	beforeMount() {
		console.log(window.innerHeight);
		console.log(document.body.clientHeight)
		this.mainHeight = {
			height: window.innerHeight - 54 - 41 + "px",
		};
		// console.log(this.mainHeight)
		this.searchValue = this.$route.query.searchValue;
	},
	async activated() {
		// console.log(this.$route.query.searchValue);
		this.searchValue = this.$route.query.searchValue;
		// console.log(this.$route.meta.isBack);
		if (!this.$route.meta.isBack) {
			this.queryParams = {
				condition: '',
				priceOrder: -1,
				saleOrder: -1,
				popularOrder: -1
			}
			await this.convert()
		} else {
			//this.$route.meta.isBack为true,则表示从详情页返回的
			const $content = document.querySelector('.scrollContent'); // 列表的外层容器
			$content.scrollTop = this.scroll;
		}
	},
	beforeRouteEnter(to, from, next) {
		// console.log('to ', to)
		// console.log('from ', from)
		if (from.name == 'Detail') { // 这个name是下一级页面的路由name
			to.meta.isBack = true; // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
		} else {
			to.meta.isBack = false;
		}
		next();
	},
	beforeRouteLeave(to, from, next) {
		const $content = document.querySelector('.scrollContent');
		const scrollTop = $content ? $content.scrollTop : 0;
		this.scroll = scrollTop;
		next();
	},
	methods: {
		search(desc = -1) {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/goods/goodslistbycondition", "post", {
					keyword: this.searchValue,
					page: this.queryParams.page,
					desc: desc,
					condition: this.queryParams.condition
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
			if (this.queryParams.condition !== '') {
				const {condition, priceOrder, saleOrder, popularOrder} = this.queryParams;
				switch (condition) {
					case 0:
						await this.convert(saleOrder);
						break;
					case 1:
						await this.convert(priceOrder);
						break;
					case 2:
						await this.convert(popularOrder);
						break;
				}
			} else {
				await this.convert();
			}
		},
		async onLoad() {
			console.log('onLoad加载')
			// console.log(this.queryParams)
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
				this.loading = false;
				if (parseInt(result.data.current_page) < result.data.last_page) {
					this.finished = false;
					this.searchList = this.searchList.concat(result.data.data);
				} else if (parseInt(result.data.current_page) === result.data.last_page) {
					this.finished = true;
					this.searchList = this.searchList.concat(result.data.data);
				}
			}
		},
		clickSearch() {
			this.displayGrid = !this.displayGrid;
		},
		async defaultQuery() {
			this.queryParams = {
				condition: '',
				priceOrder: -1,
				saleOrder: -1,
				popularOrder: -1
			}
			await this.convert();
		},
		async priceOrderBy() {
			// console.log(this.searchValue)
			this.queryParams.condition = 1;
			this.queryParams.saleOrder = -1;
			this.queryParams.popularOrder = -1;
			if (this.queryParams.priceOrder < 1) {
				this.queryParams.priceOrder++;
			} else {
				this.queryParams.priceOrder = -1;
				this.queryParams.condition = '';
			}
			await this.convert(this.queryParams.priceOrder);
		},
		async saleOrderBy() {
			this.queryParams.condition = 0;
			this.queryParams.priceOrder = -1;
			this.queryParams.popularOrder = -1;
			if (this.queryParams.saleOrder < 1) {
				this.queryParams.saleOrder++;
			} else {
				this.queryParams.saleOrder = -1;
				this.queryParams.condition = '';
			}
			await this.convert(this.queryParams.saleOrder);
		},
		async popularOrderBy() {
			this.queryParams.condition = 2;
			this.queryParams.priceOrder = -1;
			this.queryParams.saleOrder = -1;
			if (this.queryParams.popularOrder < 1) {
				this.queryParams.popularOrder++;
			} else {
				this.queryParams.popularOrder = -1;
				this.queryParams.condition = '';
			}
			await this.convert(this.queryParams.popularOrder);
		},
		async convert(orderParam) {
			let isTrue = await this.refresh();
			if (isTrue) {
				let result = await this.search(orderParam);
				console.log(result)
				if (result.status === 1) {
					result.data.data.map(item => {
						if (_.startsWith(item.goodsImg, "http")) {
							return;
						} else {
							item.goodsImg = "http://youyoujiang.com/" + item.goodsImg;
						}
					})
					this.loading = false;
					if (parseInt(result.data.current_page) < result.data.last_page) {
						this.finished = false;
						this.searchList = this.searchList.concat(result.data.data);
					} else if (parseInt(result.data.current_page) === result.data.last_page) {
						this.finished = true;
						this.searchList = this.searchList.concat(result.data.data);
					} else if (parseInt(result.data.current_page) > result.data.last_page) {
						this.searchList = [];
						this.finished = true;
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
				}, 300)
			})
		},
		toDetail(param) {
			this.$router.push({
				name: "Detail",
				query: {
					id: param.goodsId,
				},
			});
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
						border-radius: px2rem(4);
					}

					div {
						flex: 1;
						padding-left: px2rem(10);

						h3 {
							font-size: 14px;
							font-weight: 700;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
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
				height: px2rem(268);

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
						border-radius: px2rem(4);
					}

					div {
						flex: 1;
						width: 100%;
						margin-top: px2rem(10);
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						h3 {
							font-size: 14px;
							line-height: 15px;
							font-weight: 700;
							height: 30px;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
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
				//margin-top: px2rem(-10);

			}
		}
	}
}

</style>
