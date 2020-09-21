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
		<TabBar></TabBar>
	</div>
</template>
<script>
import Vue from 'vue';
import {Col, Row, Icon,Button } from 'vant';

Vue.use(Col).use(Row).use(Icon).use(Button);
import TabBar from "../../components/TabBar";

export default {
	data() {
		return {}
	},
	components: {TabBar},
	methods: {}
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

.page-shop {
	.top-banner {
		.van-row {
			background-color: rgba(201, 201, 201,.5);

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
}
</style>

