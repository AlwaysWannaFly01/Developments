<template>
	<div class="page-list" :style="{height: height + 'px'}">
		<div class="top" ref="topblock">
			<div class="fixed-panel">
				<User></User>
			</div>
			<div class="fixed-search">
				<van-search v-model="value" placeholder="请输入地址" class="search" :clearable="false"></van-search>
			</div>
		</div>
		<div class="list-container" :style="listHeight">
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<div v-for="(item,index) in list" :key="index" :title="item.name" class="list-item">
					<div>
						<h3>{{ item.name }}</h3>
						<p>{{ item.address }}</p>
					</div>
					<aside>查看</aside>
				</div>
			</van-list>
		</div>
	</div>
</template>
<script>
import User from "@/components/user/user";
import Vue from "vue";
import {Search, List, Cell} from "vant";

Vue.use(Search).use(List).use(Cell);

export default {
	name: "List",
	components: {
		User,
	},
	beforeMount() {
		this.height = window.innerHeight;
		// console.log(window.getComputedStyle(this.$refs.topblock).height)
		this.listHeight = {
			"height": (window.innerHeight - 183) + 'px',
		};
	},
	mounted() {
	},
	data() {
		return {
			value: "",
			height: {},
			list: [
				// {
				//   name: "北京市",
				//   address: "详细地址详细地址详细地址详细地址详细地址详细地址",
				// },
			],
			loading: false,
			finished: false,
		};
	},
	methods: {
		onSearch() {
		},
		onLoad() {
			// 异步更新数据
			// setTimeout 仅做示例，真实场景中一般为 ajax 请求
			setTimeout(() => {
				for (let i = 0; i < 10; i++) {
					this.list.push({
						name: "北京市" + i,
						address: "详细地址详细地址详细地址详细地址详细地址详细地址" + i,
					});
				}

				// 加载状态结束
				this.loading = false;

				// 数据全部加载完成
				if (this.list.length >= 40) {
					this.finished = true;
				}
			}, 2000);
		},
	},
};
</script>
<style lang="scss">
@import "../assets/styles/global.scss";

.page-list {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	background-color: #ebeef5;

	.top {
		height: 183px;
		overflow: hidden;
	}

	.fixed-panel {
		position: fixed;
		width: px2rem(355);
		left: 50%;
		transform: translateX(-50%);
		z-index: 9;
		height: 104px;
		padding: 13px 10px 0;
		background-color: #ebeef5;
	}

	.fixed-search {
		position: fixed;
		top: 118px;
		width: px2rem(355);
		left: 50%;
		transform: translateX(-50%);
		z-index: 9;
		height: 54px;
		padding: 10px 10px 0px;
		background-color: #ebeef5;

		.search {
			border-radius: px2rem(5) px2rem(5) 0 0;

			.van-search__content {
				border-radius: px2rem(20);

				.van-cell {
					flex-flow: row-reverse;
				}
			}
		}
	}

	.list-container {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 182px;
		z-index: 1;
		width: px2rem(355);

		.van-list {
			background-color: #fff;
			padding: 0 px2rem(10);
			overflow-y: scroll;
			height: 100%;
		}

		.van-cell {
			height: 120px;
		}

		.list-item {
			margin-bottom: px2rem(15);
			display: flex;
			height: px2rem(78);
			align-items: center;
			border-radius: px2rem(10);
			background-color: #f2f4f3;
			margin-top: px2rem(10);

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
