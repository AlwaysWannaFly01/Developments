<template>
	<div class="page-selllist">
		<van-swipe class="my-swipe" :autoplay="2000">
			<van-swipe-item>
				<img src="../assets/images/bg/2.png"/>
			</van-swipe-item>
		</van-swipe>
		<div class="block">
			<van-divider>
				<van-icon name="fire-o" v-if="sellType==='new'"/>
				<van-icon name="hot-o" v-if="sellType==='hot'"/>
				<span v-if="sellType==='new'">最新上架</span>
				<span v-else-if="sellType==='hot'">热销排行</span>
			</van-divider>
		</div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset="50">
			<div class="list-item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<img :src="item.goodsImg" class="left"/>
				<div class="right">
					<div class="info">
						<p>{{ item.goodsName }}</p>
						<h4>￥<span>{{ item.shopPrice }}</span></h4>
						<del>￥{{ item.marketPrice }}</del>
					</div>

					<van-icon name="shopping-cart-o" color="#7abb56"/>
				</div>
			</div>
		</van-list>
	</div>
</template>
<script>
import Vue from "vue";
import {Swipe, SwipeItem, Lazyload, Divider, Icon, List} from "vant";

Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(Divider).use(Icon).use(List);
import _ from "lodash";
import {Request} from "@/api/index";

export default {
	props: ["sellType"],
	data() {
		return {
			list: [],
			loading: false,
			finished: false,
		};
	},
	mounted() {
		// console.log(this.sellType);
		if (this.sellType) {
			this.init(this.sellType);
		}
	},
	methods: {
		init(param) {
			Request("jxyx", "weapp/goods/getgoodslist", "post", {
				type: param,
				num: 30,
			})
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
						setTimeout(() => {
							this.list = res.data;
							this.loading = false;
							// 数据全部加载完成
							this.finished = true;
						}, 500);

						// console.log(this.list);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		toDetail(param) {
			console.log(param);
			this.$router.push({
				name: "Detail",
				query: {
					id: param.goodsId,
				},
			});
		},
	},
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-selllist {
	.my-swipe .van-swipe-item {
		text-align: center;
		height: px2rem(140);
		overflow: hidden;

		img {
			width: 100%;
			height: px2rem(140);
		}
	}

	.block {
		width: 100%;
		height: px2rem(60);
		box-sizing: border-box;
		padding: px2rem(16) px2rem(16);
		line-height: px2rem(60);
		background-color: rgba(169, 169, 169, 0.1);

		.van-divider {
			border-color: #999;
			margin: 0;

			span {
				color: #000;
				margin-left: px2rem(6);
			}
		}
	}

	.van-list {
		div:nth-last-child(3) {
			.right {
				border-bottom-color: transparent;
			}
		}

		.list-item {
			display: flex;

			&:nth-last-child(1) {
				padding: 10px;

				.right {
					border-bottom-color: transparent;
				}
			}

			.left {
				width: px2rem(100);
				height: px2rem(100);
				margin: px2rem(10);
				border-radius: px2rem(5);
			}

			.right {
				flex: 1;
				border-bottom: 1px solid rgba(169, 169, 169, 0.3);
				display: flex;
				justify-content: space-between;
				padding: px2rem(10);
				padding-left: 0;
				align-items: flex-end;

				.info {
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					p {
						font-size: 16px;
					}

					h4 {
						font-size: 14px;
						color: #7abb56;

						span {
							font-weight: 700;
							font-size: 16px;
						}
					}

					del {
						font-size: 14px;
					}
				}

				.van-icon {
					width: px2rem(26);
					height: px2rem(26);
					line-height: px2rem(26);
					border-radius: 50%;
					border: 1px solid #7abb56;
					font-size: 16px;
					text-align: center;
				}
			}
		}
	}
}
</style>
