<template>
	<div class="page-category">
		<van-tabs v-model="active" line-height="2" @click="onClick" color="#7abb56">
			<van-tab v-for="(item,index) in switchList" :key="index" :title="item.value">
				<template #title>
					{{ item.name }}
				</template>
			</van-tab>
		</van-tabs>
		<van-search v-model="value" placeholder="点击搜索商品名称" />
		<div class="img-block">
			<img src="../../assets/images/bg/cate-zhanwei.png" v-if="active===0">
			<img src="../../assets/images/bg/cate-zhanwei2.png" v-if="active===1">
			<img src="../../assets/images/jx/play.png" class="play"/>
		</div>
		<div class="main-container">
			<div v-if="active===1" class="main">
				<div class="top">
					<img src="../../assets/images/jx/label_icon.png">
					<span>全部商品</span>
					<img src="../../assets/images/jx/label_icon.png">
				</div>
				<img src="../../assets/images/jx/zanwushuju.png" class="empty">
				<p>暂无数据</p>
			</div>
		</div>
		<TabBar></TabBar>
	</div>
</template>
<script>

import Vue from "vue";
import {
	Icon,
	Swipe,
	SwipeItem,
	Search
} from "vant";

Vue.use(Icon).use(Swipe).use(SwipeItem).use(Search)
import TabBar from "../../components/TabBar";
export default {
	data() {
		return {
			active: 0,
			switchList: [
				{
					name: "江夏惠农",
					value: "preferential",
				},
				{
					name: "江夏制造",
					value: "manufacture",
				},
			],
			value:''
		}
	},
	components: {
		TabBar
	},
	beforeMount() {
		// console.log(this.$route.params)
		if(this.$route.params.active){
			this.active = this.$route.params.active
		}
	},
	methods: {
		onClick(name, title) {
			// console.log(name, title);
			// console.log(this.active)
		}
	}
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

.page-category {
	.van-tabs {
		height: 32px;

		.van-tabs__wrap {
			height: 32px;

			.van-tabs__nav {
				width: 200px;

				.van-tab {
					.van-tab__text {
						font-size: 14px;
					}
					&.van-tab--active {
						color: #7abb56;
						//font-weight: 600;
					}
				}

			}

		}
	}
	.van-search{
		padding: 11px px2rem(15) 14px;
		.van-search__content{
			border-radius: px2rem(5);
		}
	}
	.img-block{
		width: 100%;
		box-sizing: border-box;
		padding: 0 px2rem(15);
		height: 194px;
		border-radius: px2rem(5);
		position: relative;
		img{
			width: 100%;
			height: 194px;
		}
		.play {
			position: absolute;
			z-index: 2;
			width: px2rem(47);
			height: px2rem(47);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.main-container{
		width: 100%;
		box-sizing: border-box;
		padding: 0 px2rem(15);
		margin-top: 15px;
		.main{
			text-align: center;
			.top{
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					width: 20px;
				}
				span{
					font-size: 14px;
					margin: 0 5px;
				}
			}
			.empty{
				width: px2rem(100);
				margin: px2rem(20) 0 px2rem(10);
			}
			p{
				font-size: 14px;
			}
		}
	}

}
</style>

