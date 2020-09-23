<template>
	<div class="page-goodslist">
		<van-search
			v-model="searchValue"
			shape="round"
			background="#7abb56"
			placeholder="请输入搜索关键词"
			show-action
		>
			<template #action>
				<div @click="onSearch">搜索</div>
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
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				class="w100"
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
import {Search, Button, List} from 'vant';

Vue.use(Search).use(Button).use(List);
import _ from "lodash";
import {Request} from "@/api/index";

export default {
	name: "goodsList",
	data() {
		return {
			searchList: [],
			loading: false,
			finished: true
		}
	},
	beforeMount() {
		// console.log(this.$route.query)
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
			console.log(result)
			if (result.status === 1) {
				result.data.data.map(item => {
					if (_.startsWith(item.goodsImg, "http")) {
						return;
					} else {
						item.goodsImg =
							"http://youyoujiang.com/" + item.goodsImg;
					}
				})
				this.searchList = result.data.data;
			}
		},
		search(param) {
			return new Promise((resolve, reject) => {
				Request("jxyx", "weapp/goods/goodslistbycondition", "post", {
					keyword: param
				}).then(res => {
					// console.log(res)
					if (res.status === 1) {
						resolve(res)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		},
		onSearch() {

		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-goodslist {
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
			height: 100%;
			overflow-y: auto;
			padding: 0 px2rem(15);
			box-sizing: border-box;

			.van-cell {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				padding: px2rem(10) 0;
				&::after{
					right:0;
					left:0;
				}
				.van-cell__value {
					display:flex;
					img {
						width: px2rem(80);
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
	}
}

</style>
