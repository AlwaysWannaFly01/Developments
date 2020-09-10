<template>
	<div class="page-list" :style="{height: height + 'px'}">
		<div class="top" ref="topblock">
			<div class="fixed-panel">
				<User></User>
			</div>
			<div class="fixed-search">
				<!--				<form action="/">-->
				<!--					<van-search v-model="value" @search="onSearch" placeholder="请输入地址" class="search"-->
				<!--								:clearable="true" right-icon="star-o"></van-search>-->
				<!--				</form>-->

				<van-search
					v-model="value"
					show-action
					placeholder="请输入地址"
					@search="onSearch"
					class="search"
				>
					<template #action>
						<img src="../assets/images/icon_search.png" @click="clickSearch">
					</template>
				</van-search>
			</div>
		</div>
		<div class="list-container" :style="listHeight">
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="50"
					  :error.sync="error"
					  error-text="请求失败，点击重新加载">
				<div v-for="(item,index) in list" :key="index" :title="item.name" class="list-item">
					<!--					<div>-->
					<!--						<h3>{{ item.CompoundName }}</h3>-->
					<!--						<p>{{ '详细地址:' + item.RoomAddress }}</p>-->
					<!--					</div>-->
					<div>
						<h3>{{ item.id }}</h3>
						<p>{{ '详细地址:' + item.title }}</p>
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
import {postData, getData, getListData, getItemData, getTopicList} from '@/api';
import handleToast from '@/utils/toast';

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
		this.init()
	},
	data() {
		return {
			value: "",
			height: {},
			list: [],
			loading: false,
			finished: false,
			default: {
				page: 0,
				size: '10',
				limit: 10
			},
			error: false,
		};
	},
	methods: {
		init() {
		},
		onLoad() {
			// getListData({
			// 	page: this.default.page,
			// 	size: this.default.size
			// }).then(res => {
			// 	// console.log(res)
			// 	if (res.code === 0) {
			// 		// handleToast('成功','success');
			// 		setTimeout(() => {
			// 			this.loading = false; // 加载状态结束
			// 			this.list = res.data;
			// 		}, 1000)
			// 	} else {
			// 		handleToast('失败', 'fail');
			// 	}
			// }).catch(err => {
			// 	console.log(err)
			// })
			this.default.page++;
			console.log(this.default.page)
			this.getTopicList().then(res => {
				// console.log(res.data)
				setTimeout(() => {
					this.loading = false;
					this.list = this.list.concat(res.data)
					console.log(this.list)
					// this.finished = true;
				}, 900)
			}).catch(err => {
				this.error = true;
				this.loading = false;
				console.log(err)
			})
		},
		async getTopicList() {
			return await getTopicList({
				page: this.default.page,
				limit: this.default.limit
			})
		},
		async onSearch(val) {
			console.log(val)
			if (val) {
				let fake = '5ee1ee83b703280f0bcb922a';
				let result = await this.searchBy(fake)
				if (result.success) {
					this.loading = false;
					this.list.push(result.data)
					this.finished = true;
				}
			} else {
				this.list = [];
				this.finished = false;
				this.onLoad()
			}
		},
		async clickSearch() {
			if (this.value) {
				let fake = '5433d5e4e737cbe96dcef312';
				let result = await this.searchBy(fake)
				// console.log(result)
				if (result.success) {
					this.loading = false;
					this.list.push(result.data)
					this.finished = true;
				}
			} else {
				this.list = [];
				this.finished = false;
				this.onLoad()
			}
		},
		async searchBy(param) {
			this.list = [];
			this.loading = true;
			this.finished = false;
			let a = await this.refresh();//清空 page, size 等属性
			console.log(a)
			return new Promise((resolve, reject) =>
				getData('https://cnodejs.org/api/v1/topic/' + param).then(res => {
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			)
		},
		async refresh() {
			return new Promise((resolve, reject) => {
				resolve(
					this.default = {
						page: 0,
						size: 10,
						limit: 10
					}
				)
			})

		}
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
		//background-color: #fff;
		.search {
			border-radius: px2rem(5) px2rem(5) 0 0;
			//padding-right: 16px;
			padding: 10px 12px;
			background-color: #fff;

			.van-search__content {
				border-radius: px2rem(20) 0 0 px2rem(20);

				.van-cell {
					//flex-flow: row-reverse;
					height: 34px;

					.van-field__left-icon {
						.van-icon-search {
							display: none;
						}
					}
				}

				.van-field__body {
					.van-icon-clear {
					}
				}
			}

			.van-search__action {
				height: 34px;
				line-height: 34px;
				background-color: #f7f8fa;
				padding: 0;
				width: 40px;
				text-align: center;
				border-radius: 0 px2rem(20) px2rem(20) 0;

				img {
					width: 16px;
					height: 16px;
					vertical-align: middle;
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
				height: 100%;
				padding: px2rem(10) px2rem(10);
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				width: px2rem(275);
				box-sizing: border-box;

				h3 {
					font-size: 16px;
					font-weight: 700;
				}

				p {
					box-sizing: border-box;
					font-size: 14px;
					color: #666;
					line-height: 15px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
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
