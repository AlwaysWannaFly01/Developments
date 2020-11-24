<template>
	<div class="page-detail" v-if="data.goodsId" :style="mainHeight">
		<div class="container" :style="mainHeight">
			<van-swipe class="my-swipe" :autoplay="2000" indicator-color="#7abb56">
				<van-swipe-item v-for="(image, index) in data.newGallery" :key="index">
					<img v-lazy="image"/>
				</van-swipe-item>
			</van-swipe>
			<div class="line"></div>
			<div class="price">
				<div>
					<h4>
						{{ `￥${data.shopPrice}` }}
					</h4>
					<del>
						{{ `￥${data.marketPrice}` }}
					</del>
				</div>
				<span>
				{{ `已售${data.saleNum}件` }}
			</span>
			</div>
			<header>{{ data.goodsName }}</header>
			<article>
				<h4>店铺信息</h4>
				<p class="shopName">{{ data.shop.shopName }}</p>
				<p class="catshops">{{ data.shop.catshops }}</p>
			</article>

			<section>
				<h4>商品描述</h4>
				<div v-html="data.goodsDesc">

				</div>
			</section>
			<div class="line bottom"></div>
		</div>
		<ShopFoot :detailData="data"></ShopFoot>
	</div>
</template>
<script>
import Vue from "vue";
import {Swipe, SwipeItem, Lazyload, Divider, GoodsAction, GoodsActionIcon, GoodsActionButton} from "vant";

Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(Divider).use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton);
import _ from "lodash";
import {Request} from "@/api/index";
import ShopFoot from "../../components/ShopFoot";

export default {
	data() {
		return {
			data: {},
		};
	},
	components: {
		ShopFoot
	},
	beforeMount() {
		this.id = this.$route.query.id;
		this.mainHeight = {
			height: window.innerHeight - 50 + "px",
		};
	},
	mounted() {
		if (this.id) {
			this.init(this.id);
		}
	},
	methods: {
		init(param) {
			// console.log(param);
			Request("jxyx", "weapp/goods/goodsdetail", "post", {
				goodsId: param,
			})
				.then((res) => {
					// console.log(res);
					if (res.status === 1) {
						const {gallery, goodsImg} = res.data;
						let newGallery = [];
						gallery.map((item) => {
							if (_.startsWith(item, "http")) {
								return;
							} else {
								item = "http://youyoujiang.com/" + item;
							}
							newGallery.push(item);
						});
						// console.log(newGallery);

						let newGoodsImg = "";
						if (_.startsWith(goodsImg, "http")) {
							return;
						} else {
							newGoodsImg = "http://youyoujiang.com/" + goodsImg;
						}
						// console.log(newGoodsImg);
						res.data["newGallery"] = newGallery;
						res.data["newGoodsImg"] = newGoodsImg;

						// console.log(res.data);
						this.data = res.data;
					}
				})
				.catch((err) => {
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

.page-detail {
	.container {
		overflow-y: auto;
	}

	.my-swipe {
		.van-swipe-item {
			height: px2rem(230);

			img {
				width: 100%;
				height: px2rem(230);
			}
		}
	}

	.van-divider {
		margin: 0;

		&::before {
			border-width: px2rem(15) 0 0 0;
		}
	}

	.line {
		width: 100%;
		height: px2rem(10);
		background-color: rgba(235, 237, 240, .5);

		&.bottom {
			background-color: #fff;
			//margin-bottom: 50px;
		}
	}

	.price {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		align-items: center;
		width: 100%;
		padding: px2rem(15);
		box-sizing: border-box;

		div {
			display: flex;
			align-items: center;

			h4 {
				font-size: 16px;
				font-weight: 600;
				color: #7abb56;
				margin-right: px2rem(8);
			}

			del {
				font-size: 12px;
			}
		}

		span {
			color: #999;
		}
	}

	header {
		font-size: 14px;
		padding: 0 px2rem(15);
		margin-top: px2rem(20);
		margin-bottom: px2rem(12);
		font-weight: 700;
	}

	article {
		h4 {
			border-left: px2rem(3) solid #7abb56;
			font-size: 14px;
			padding-left: px2rem(12);
		}

		p {
			font-size: 14px;
			margin-top: px2rem(10);
			padding-left: px2rem(15);
		}
	}

	section {
		margin-top: px2rem(15);

		h4 {
			border-left: px2rem(3) solid #7abb56;
			font-size: 14px;
			padding-left: px2rem(12);
		}

		div {
			font-size: 14px;
			padding: 0 px2rem(15);
			margin-top: px2rem(15);
			box-sizing: border-box;

			img {
				width: px2rem(375);
			}

		}

		img {
			width: 100% !important;
		}
	}
}
</style>
