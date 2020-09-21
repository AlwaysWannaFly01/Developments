<template>
	<div class="page-my">
		<div class="personal">
			<img src="@/assets/images/jx/default_avatar.png">
			<h2>项目</h2>
		</div>
		<div class="my-order">
			<h3>我的订单</h3>
			<div class="block">
				<div class="item">
					<img src="../../assets/images/dfk.png">
					<span>待付款</span>
				</div>
				<div class="item">
					<img src="../../assets/images/dfh.png">
					<span>待发货</span>
				</div>
				<div class="item">
					<img src="../../assets/images/dsh.png">
					<span>待收货</span>
				</div>
				<div class="line"></div>
				<div class="item">
					<img src="../../assets/images/jx_order.png">
					<span>订单</span>
				</div>
			</div>
		</div>

		<div class="cell-container">
			<div class="item">
				<img src="../../assets/images/jx/my-position.png">
				<van-cell title="我的地址" />
			</div>
			<div class="item">
				<img src="../../assets/images/jx/my-msg.png">
				<van-cell title="我的消息" />
			</div>
			<div class="item">
				<img src="../../assets/images/jx/store_icon.png">
				<van-cell title="商家入驻" />
			</div>
			<div class="item">
				<img src="../../assets/images/jx/server_icon.png">
				<van-cell title="联系客服" />
			</div>
		</div>
		<TabBar></TabBar>
	</div>
</template>
<script>
import Vue from 'vue';
import { Cell, CellGroup  } from 'vant';

Vue.use(Cell).use(CellGroup);
import TabBar from "../../components/TabBar";
export default {
	data() {
		return {}
	},
	components: {TabBar},
	methods: {}
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/global.scss";

.page-my {
	padding: 0 px2rem(10);
	box-sizing: border-box;
	//background-image: url("../../assets/images/jx/my-bg.png");
	background-size: px2rem(375);
	background-repeat: no-repeat;
	.personal {
		width: 100%;
		padding: px2rem(30) 0;
		display: flex;
		align-items: center;
		img{
			width: px2rem(60);
			height: px2rem(60);
			border-radius:px2rem(30);
			margin-right: px2rem(20);
		}
		h2{
			font-size: 20px;
		}
	}

	.my-order {
		width: 100%;
		height: px2rem(105);
		padding: px2rem(10) px2rem(15);
		box-sizing: border-box;
		border-radius: px2rem(3);
		box-shadow: 0pt 1.5pt 5pt 0pt rgba(169,169,169,.4);
		h3{
			font-size: 16px;
			margin-bottom: px2rem(15);
		}
		.block{
			display: flex;
			align-items: center;
			.item{
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				img{
					width: px2rem(25);
					margin-bottom: px2rem(12);
				}
				span{
					font-size: 14px;
				}
			}
			.line{
				width: 1px;
				height: px2rem(22);
				background-color: #a1a1a1;
				opacity: 0.3;
			}
		}
	}

	.cell-container{
		margin-top: px2rem(20);
		.item{
			display: flex;
			align-items: center;
			img{
				width: px2rem(26);
				height: px2rem(26);
				margin-right: px2rem(10);
			}
			.van-cell{

				.van-cell__title{
					border-bottom: 1px solid rgba(169,169,169,.2);
					height: px2rem(46);
					span{
						font-size: 14px;
					}
				}
			}
		}
	}
}
</style>

