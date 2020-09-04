<template>
	<div class="page-list">
		<div class="fixed-panel">
			<User></User>
		</div>

		<div class="list-container">
			<van-search
				v-model="value"
				placeholder="请输入地址"
				class="search"
				:clearable="false"
			>
				<!--				<template #action>-->
				<!--					<img src="../assets/images/search.png" @click="onSearch">-->
				<!--				</template>-->
			</van-search>
			<ul>
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

.page-list {
	position: relative;
	//padding: px2rem(14) px2rem(10);
	min-width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #ebeef5;
	.fixed-panel{
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		left: 0;
		top: 0;
		padding: px2rem(14) px2rem(10);
		z-index: 9;
	}
	.list-container {
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: px2rem(5);
		padding: px2rem(20) px2rem(10);
		//margin-top: px2rem(10);
		position: absolute;
		top: px2rem(124);
		left: 0;
		z-index: 1;
		.search {
			padding: 0;
			height: px2rem(33);

			.van-search__content {
				border-radius: px2rem(16);
				background-color: #f2f4f3;

				.van-cell {
					flex-flow: row-reverse;
				}
			}

			img {
				width: px2rem(15);
			}
		}

		ul {
			width: 100%;
			display: flex;
			flex-direction: column;
			margin-top: px2rem(20);

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
}
</style>
