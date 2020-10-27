<template>
	<div class="page-shopFoot">
		<van-goods-action>
			<van-goods-action-icon icon="service-o" text="客服" @click="callPhone"/>
			<van-goods-action-icon icon="share-o" text="分享" @click="onClickIcon"/>
			<van-goods-action-icon icon="cart-o" text="购物车" @click="onClickIcon"/>

			<van-goods-action-button color="rgb(57, 148, 113)" type="warning" text="加入购物车" @click="addToShopCar"/>
			<van-goods-action-button color="rgb(151, 202, 103)" type="danger" text="立即购买" @click="showSku"/>
		</van-goods-action>

		<van-popup v-model="show" position="bottom" :style="{ height: 'auto' }" closeable round class="my-popup">
			<div class="top">
				<img :src="detailData.newGoodsImg">
				<div>
					<h3>{{ detailData.goodsName }}</h3>
					<p>
						<strong>
							{{ `￥${stockChoosed.specPrice ? stockChoosed.specPrice : detailData.shopPrice}` }}
						</strong>
						<span>
							{{ `库存:${stockChoosed.specStock ? stockChoosed.specStock : detailData.goodsStock}` }}
						</span>
					</p>
				</div>
			</div>
			<div v-if="detailData.spec.length>0">
				<div class="section" v-for="(item,index) in detailData.spec" :key="index">
					<h6>{{ item.name }}</h6>
					<van-radio-group v-model="land[index].band" direction="horizontal" @change="change">
						<van-radio :name="subItem.itemId" v-for="(subItem,subIndex) in item.list" :key="subIndex">
							<template #icon="props">
								<div :class="['word', props.checked ? 'active':'']">
									{{ subItem.itemName }}
								</div>
							</template>
						</van-radio>
					</van-radio-group>
				</div>
			</div>
			<div class="section">
				<h6>数量</h6>
				<van-stepper v-model="count"/>
			</div>
			<!--			<van-button block color="#7abb56" @click="sure">确定</van-button>-->
			<van-goods-action>
				<van-goods-action-button color="rgb(57, 148, 113)" text="加入购物车" @click="sure"/>
				<van-goods-action-button color="rgb(151, 202, 103)" text="立即购买"/>
			</van-goods-action>
		</van-popup>
	</div>

</template>

<script>
import Vue from "vue";
import {GoodsAction, GoodsActionIcon, GoodsActionButton, Popup, Stepper, Button, RadioGroup, Radio} from "vant";

Vue.use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton).use(Popup).use(Stepper).use(Stepper).use(RadioGroup).use(Radio);

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
			count: 1,
			show2: false,
			radio: '',
			land: [
				{band: 0},
				{band: 1},
				{band: 2},
				{band: 3},
			],
			stockChoosed: {}
		}
	},
	async mounted() {
		console.log(this.detailData)
		if (this.detailData.spec.length > 0) {
			let arr = [];
			this.detailData.spec.map(item => {
				arr.push({band: item.list[0].itemId})
			})
			this.land = arr;
		}
		await this.convert(this.land);
	},
	methods: {
		onClickIcon() {

		},
		callPhone() {
			window.location.href = 'tel:';
		},
		addToShopCar() {
			this.show = true
		},
		showSku() {
			this.show2 = true
		},
		sure() {
			const {detailData, count} = this
			console.log(detailData)
			if (count > 0) {
				console.log(count)
				Request("main", "weapp/carts/addcart", "post", {
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
		},
		convert(arr, cate = 'band', sort = 'asc') {
			let str = ''
			let sortByAsc = _.orderBy(arr, [cate], [sort]);
			sortByAsc.map(item => {
				str += item[cate] + ':'
			})
			let sortStr = str.substring(0, str.length - 1);
			if (!_.isEmpty(this.detailData.saleSpec)) {
				this.stockChoosed = this.detailData.saleSpec[sortStr]
			}
		},
		async change(val) {
			// console.log(val)
			// console.log(this.land)
			await this.convert(this.land)
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
			padding-bottom: 50px;
		}
	}

	.my-popup {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.top {
			display: flex;
			padding: px2rem(15);

			img {
				height: px2rem(80);
				width: px2rem(80);
			}

			div {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				margin-left: px2rem(20);
				margin-right: px2rem(20);

				h3 {
					font-size: 16px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
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

		.section {
			padding: px2rem(10) px2rem(15);
			margin-top: 0;

			h6 {
				font-size: 14px;
				margin-bottom: px2rem(8);
			}

			.van-stepper {
				padding: 0;
			}

			.van-radio-group {
				.van-radio {
					margin-right: px2rem(8);
					margin-bottom: px2rem(6);

					.van-radio__icon {
						height: auto;

						.van-icon {
							&::before {
								content: '';
							}
						}

						.word {
							font-size: 14px;
							width: px2rem(70);
							text-align: center;
							height: px2rem(24);
							line-height: px2rem(24);
							border-radius: px2rem(4);
							border: 1px solid rgba(199, 199, 199, .3);

							&.active {
								background-color: #7abb56;
								color: #fff;
							}
						}
					}

				}
			}
		}
	}
}
</style>
