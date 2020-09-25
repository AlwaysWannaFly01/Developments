<template>
	<div class="page-list" :style="{height: height + 'px'}">
		<div class="top" ref="topblock">
			<div class="fixed-panel">
				<User @checkLogin='loginStatus'></User>
			</div>
			<div class="fixed-search">
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
		<van-empty description="暂无内容" class="list-container" :style="listHeight" v-if="!isLogin"/>
		<div class="list-container" :style="listHeight" v-if="isLogin">
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="50"
					  :error.sync="error"
					  error-text="请求失败，点击重新加载">
				<div v-for="(item,index) in list" :key="index" :title="item.name" class="list-item">
					<div>
						<h3>{{ item.ID }}</h3>
						<p>{{ '城市:' + item.HouseCityName }}</p>
						<p v-if="item.RoomAddress">{{ `详细地址: ${item.RoomAddress}` }}</p>
						<p>{{ `评估类型: ${item.PingGuLeiXing == 1 ? '预评' : '正式'}` }}</p>

					</div>
					<aside @click="toHistory(item.ID)">查看</aside>
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
import {getListData, Request, postSearchData} from '@/api';

export default {
	name: "List",
	components: {
		User,
	},
	beforeMount() {
		this.height = window.innerHeight;
		this.listHeight = {
			"height": (window.innerHeight - 183) + 'px',
		};
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
				size: 10
			},
			error: false,
			isLogin: true
		};
	},
	methods: {
		async onLoad() {
			let result = await this.getListData();
			// console.log(result)
			if (result.data.length > 0) {
				setTimeout(() => {
					this.loading = false;
					this.list = this.list.concat(result.data)
				}, 900)
			} else {
				this.loading = false;
				this.finished = true;
			}
		},
		async getListData() {
			this.default.page++;
			return new Promise((resolve, reject) => {
				getListData({
					page: this.default.page,
					size: this.default.size
				}).then(res => {
					if (res) {
						resolve(res)
					}
				}).catch(err => {
					console.log(err)
				})
			})
		},
		async onSearch(val) {
			// console.log('点击回车触发了')
			if (val) {
				// console.log(val)
				this.searchBy(val)
			} else {
				this.list = [];
				this.loading = true;
				this.finished = false;
				let isTrue = await this.refresh();
				if (isTrue) {
					this.onLoad()
				}
			}
		},
		async clickSearch() {
			// console.log('点击搜索按钮触发了')
			if (this.value) {
				this.searchBy(this.value)
			} else {
				this.list = [];
				this.loading = true;
				this.finished = false;
				let isTrue = await this.refresh();
				if (isTrue) {
					this.onLoad()
				}
			}
		},
		async searchBy(param) {
			this.list = [];
			this.loading = true;
			this.finished = false;
			let isTrue = await this.refresh();//清空 page, size 等属性
			if (isTrue) {
				this.searchData(param)
			}
		},
		searchData(param) {
			this.default.page ++;
			postSearchData({
				param: {
					RoomAddress: param,
					LingKanRen: '',
					PingGuLeiXing: '',
				},
				page: this.default.page,
				size: this.default.size
			}).then(res => {
				if (res) {
					if (res.count > 0) {
						this.list = res.data;
					} else {
						this.list = [];
					}
					this.finished = true;

				}
			})
		},
		async refresh() {
			return new Promise((resolve, reject) => {
				this.default = {
					page: 0,
					size: 10
				}
				setTimeout(() => {
					if (this.default.page === 0) {
						resolve(true)
					}
				}, 1500)
			})
		},
		toHistory(param) {
			if (param) {
				this.$router.push({
					name: 'History',
					params: {id: param}
				})
			}
		},
		loginStatus(singer) {
			this.isLogin = singer;
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
		//top: 164px;
		width: px2rem(355);
		left: 50%;
		transform: translateX(-50%);
		//z-index: 9;
		z-index: 8;
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
		//top: 228px;
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
			//height: px2rem(78);
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
					margin-top: px2rem(6);
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

	.van-empty{
		&.list-container{
			background-color: #fff;
		}
	}
}
</style>
