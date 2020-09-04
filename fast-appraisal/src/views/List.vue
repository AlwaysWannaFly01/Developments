<template>
	<div class="page-list">
		<div class="fixed-panel">
			<User></User>
		</div>
		<div class="fixed-search">
			<van-search
				v-model="value"
				placeholder="请输入地址"
				class="search"
				:clearable="false"
			>
			</van-search>
		</div>
		<ul class="list-container">
			<li>
				<div>
					<h3>北京市</h3>
					<p>详细地址:详细地址详细地址详细地址详细地址</p>
				</div>
				<aside>
					查看
				</aside>
			</li>
			<li>
				<div>
					<h3>北京市</h3>
					<p>详细地址:详细地址详细地址详细地址详细地址</p>
				</div>
				<aside>
					查看
				</aside>
			</li>
			<li>
				<div>
					<h3>北京市</h3>
					<p>详细地址:详细地址详细地址详细地址详细地址</p>
				</div>
				<aside>
					查看
				</aside>
			</li>
			<li>
				<div>
					<h3>北京市</h3>
					<p>详细地址:详细地址详细地址详细地址详细地址</p>
				</div>
				<aside>
					查看
				</aside>
			</li>
			<li>
				<div>
					<h3>北京市</h3>
					<p>详细地址:详细地址详细地址详细地址详细地址</p>
				</div>
				<aside>
					查看
				</aside>
			</li>
			<li>
				<div>
					<h3>北京市</h3>
					<p>详细地址:详细地址详细地址详细地址详细地址</p>
				</div>
				<aside>
					查看
				</aside>
			</li>


		</ul>
	</div>
</template>
<script>
import User from "@/components/user/user";
import Vue from 'vue';
import {Search} from 'vant';

Vue.use(Search);

export default {
	name: "List",
	components: {
		User,
	},
	data() {
		return {
			value: ''
		};
	},
	methods: {
		onSearch() {
		}
	}
};
</script>
<style lang="scss">
@import "../assets/styles/global.scss";
//body{
//	display: flex;
//	flex-direction: column;
//	height: 100vh;
//}
.page-list {
	position: relative;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: #ebeef5;

	.fixed-panel {
		margin: px2rem(14) px2rem(10) px2rem(0);
	}

	.fixed-search {
		margin: px2rem(10) px2rem(10) px2rem(0);

		.search {
			border-radius: px2rem(5) px2rem(5) 0 0;

			.van-search__content {
				.van-cell {
					flex-flow: row-reverse;
				}
			}
		}
	}

	.list-container {
		flex: 1;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		margin: 0 px2rem(10);
		box-sizing: border-box;
		padding: px2rem(10) px2rem(10) 0;
		background-color: #fff;

		li {
			margin-bottom: px2rem(15);
			display: flex;
			height: px2rem(78);
			align-items: center;
			border-radius: px2rem(10);
			background-color: #f2f4f3;

			div {
				flex: 1;
				height: 100%;
				padding: px2rem(10) px2rem(10);
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				h3 {
					font-size: 16px;
					font-weight: 700;
				}

				p {
					font-size: 14px;
					color: #666;
				}
			}

			aside {
				font-size: 14px;
				width: px2rem(60);
				height: 100%;
				line-height: px2rem(78);
				text-align: center;
				background-color: #19b1f0;
				color: #fff;
				border-radius: 0 px2rem(10) px2rem(10) 0;
			}
		}
	}
}
</style>
