<template>
	<div class="page-shopFoot">
		<van-goods-action>
			<van-goods-action-icon icon="service-o" text="客服" @click="callPhone"/>
			<van-goods-action-icon icon="share-o" text="分享" @click="onClickIcon"/>
			<van-goods-action-icon icon="cart-o" text="购物车" @click="onClickIcon"/>

			<van-goods-action-button color="rgb(57, 148, 113)" type="warning" text="加入购物车" @click="addToShopCar"/>
			<van-goods-action-button color="rgb(151, 202, 103)" type="danger" text="立即购买"/>
		</van-goods-action>

		<van-popup v-model="show" position="bottom" :style="{ height: '30%' }" closeable round class="my-popup">
			<div class="top">
				<img :src="detailData.newGoodsImg">
				<div>
					<h3>{{ detailData.goodsName }}</h3>
					<p>
						<strong>{{ `￥${detailData.shopPrice}` }}</strong>
						<span>{{ `库存:${detailData.goodsStock}` }}</span>
					</p>
				</div>
			</div>
			<van-stepper v-model="count"/>
			<van-button block color="#7abb56" @click="sure">确定</van-button>
		</van-popup>
	</div>

</template>

<script>
import Vue from "vue";
import {GoodsAction, GoodsActionIcon, GoodsActionButton, Popup, Stepper, Button} from "vant";

Vue.use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton).use(Popup).use(Stepper).use(Stepper);

import _ from "lodash";
import {Request} from "@/api/index";

export default {
	name: "ShopFoot",
	props: [
		"detailData"
	],
	data() {
		return {
			show: false,
			count: 1
		}
	},
	mounted() {
		// console.log(this.detailData)
	},
	methods: {
		onClickIcon() {

		},
		callPhone(){
			window.location.href = 'tel:';
		},
		addToShopCar() {
			this.show = true
		},
		sure() {
			const {detailData, count} = this
			console.log(detailData)
			if (count > 0) {
				console.log(count)
				Request("jxyx", "weapp/carts/addcart", "post", {
					goodsId: detailData.goodsId,
					goodsSpecId: detailData.goodsCatId,
					buyNum: count,
					type: 0
				}).then(res => {
					console.log(res)
				}).catch(err => {

				})

			}
			// this.show = true
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

.page-shopFoot {
	.van-popup--bottom {
		&.van-popup--round {
			border-radius: px2rem(5) px2rem(5) 0 0;
		}
	}

	.my-popup {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.top {
			display: flex;
			padding: px2rem(8);

			img {
				height: px2rem(80);
			}

			div {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				h3 {
					font-size: 16px;
				}

				p {
					strong {
						color: #7abb56;
						font-size: 16px;
						font-weight: 700;
					}

					span {
						font-size: 14px;
						color: #a1a1a1;
					}
				}
			}
		}

		.van-stepper {
			padding-left: px2rem(20);
		}
	}
}
</style>
