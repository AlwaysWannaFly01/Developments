<template>
	<div class="page-shop">
		<div class="top-banner">
			<van-row>
				<van-col span="1">
				</van-col>
				<van-col span="8">
					<van-icon name="passed"/>
					100%正品保证
				</van-col>
				<van-col span="9">
					<van-icon name="passed"/>
					所有商品精挑细选
				</van-col>
				<van-col span="6">
					<van-icon name="passed"/>
					售后无忧
				</van-col>
			</van-row>
			<div class="oper-block">
				<p>
					购物数量
				</p>
				<van-button type="default" size="small">默认按钮</van-button>
			</div>
		</div>
		<div class="line"></div>
		<div class="empty">
			<img src="../../assets/images/noShopper.png" >
		</div>
		<div class="hot">
			<div class="top">
				<img src="../../assets/images/jx/label_icon.png">
				<span>热门推荐</span>
				<img src="../../assets/images/jx/label_icon.png">
			</div>
			<div class="block">
				<ul>
					<li v-for="(item,index) in recomList" :key="index">
						<img :src="item.goodsImg" @click="toDetail(item)"/>
						<h4>{{ item.goodsName }}</h4>
						<p>
							<span class="price">￥{{ item.shopPrice }}</span>
							<del
								v-if="item.marketPrice > item.shopPrice"
							>{{ item.marketPrice }}</del>
						</p>
					</li>
				</ul>
			</div>
		</div>

		<TabBar></TabBar>
	</div>
</template>
<script>
import Vue from 'vue';
import {Col, Row, Icon,Button } from 'vant';

Vue.use(Col).use(Row).use(Icon).use(Button);
import TabBar from "../../components/TabBar";
import _ from "lodash";
import { Request } from "@/api/index";
export default {
	data() {
		return {
			recomList:[]
		}
	},
	mounted() {
		this.init()
	},
	components: {TabBar},
	methods: {
		init(){
			Request("jxyx", "weapp/goods/getgoodslist", "post", {
				type: 'recom',
				num: 5,
			}).then((res) => {
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
					this.recomList = res.data;
				}
			}).catch((err) => {
					console.log(err);
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
	}
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
#app{
	padding-bottom: 0;
}
.page-shop {
	.top-banner {
		.van-row {
			background-color: rgba(201, 201, 201,.3);

			.van-col {
				height: 50px;
				line-height: 50px;
				font-size: 12px;
			}
		}
		.oper-block{
			height: 50px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 px2rem(15);
			box-sizing: border-box;
			p{
				font-size: 14px;
			}
		}
	}
	.line {
		width: 100%;
		height: px2rem(10);
		background-color: rgba(235, 237, 240, .5);
	}
	.empty{
		text-align: center;
		padding: px2rem(20);
		img{
			width: px2rem(200);
		}
	}
	.hot{
		width: 100%;
		padding: 0 px2rem(15);
		box-sizing: border-box;
		.top{
			display: flex;
			align-items: center;
			justify-content: center;
			margin: px2rem(10) 0;
			img{
				width: 20px;
			}
			span{
				font-size: 14px;
				margin: 0 8px;
			}
		}
		.block {
			margin-bottom: 50px;
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

