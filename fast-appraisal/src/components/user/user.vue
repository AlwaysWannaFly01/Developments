<template>
	<div class="panel">
		<img src="../../assets/images/menu.png" class="menu" @click="showPopup">
		<div class="info" v-show="trueName">
			<img src="../../assets/images/photo.png">
			<p>
				<strong>{{ trueName }}</strong>
			</p>
		</div>
		<div :class="['drawer',{ 'open':opened}]">
			<div @click="naviagteTo('List')" :class="[{'active':actived==='List'}]">
				<span>查看列表</span>
				<van-icon name="arrow"/>
			</div>
			<div @click="naviagteTo('Appraisal')" :class="[{'active':actived==='Appraisal'}]">
				<span>去评估</span>
				<van-icon name="arrow"/>
			</div>
		</div>
		<div :class="[{'mask-all': opened}]" @click="close"></div>
	</div>
</template>
<script>
import {Request} from '@/api';
import HandleToast from '@/utils/toast';
import Vue from 'vue';
import {Popup, Icon} from 'vant';

Vue.use(Popup).use(Icon);
export default {
	name: "user",
	data() {
		return {
			trueName: '',
			opened: false,
		}
	},
	beforeMount() {
		this.init();
		const {name} = this.$route;
		// console.log(name)
		this.actived = name;
	},
	methods: {
		init() {
			Request('/Account/GetUserInfo').then(res => {
				console.log(res)
				if (res.IsSuccess) {
					this.trueName = '用户名: ' + res.Data.TrueName;
					this.selectItem(res.IsSuccess);
				} else {
					this.selectItem(res.IsSuccess);
					HandleToast('请先登录', 'fail', 800)
					setTimeout(() => {
						this.$router.replace({
							path: '/login'
						})
					}, 1000)

				}
			}).catch(err => {
				console.log(err)
			})
		},
		selectItem(param) {
			this.$emit('checkLogin', param);
		},
		showPopup() {
			this.opened = true;
		},
		close() {
			this.opened = false;
		},
		naviagteTo(param) {
			// console.log(this.$route)
			const {name} = this.$route;
			if (name !== param) {
				this.$router.push({
					name: param,
				})
			}
		},
	}
};
</script>
<style lang="scss">
@import "../../assets/styles/global";

.panel {
	width: 100%;
	height: 104px;
	box-sizing: border-box;
	padding: px2rem(10) px2rem(14);
	display: flex;
	flex-direction: column;
	background-image: url("../../assets/images/list-bg.png");
	background-size: cover;
	border-radius: px2rem(5);
	position: relative;
	overflow: hidden;

	.menu {
		width: px2rem(17);
	}

	.info {
		@include center;

		img {
			width: px2rem(51);
			margin-right: px2rem(16);
		}

		p {
			font-size: 16px;
		}
	}

	.van-popup {
		height: 100%;
		top: 13px;
		left: 10px;
	}

	.drawer {
		position: absolute;
		left: px2rem(-101);
		top: 0;
		width: px2rem(100);
		height: 104px;
		background-color: #fff;
		-webkit-transition: all 0.3s ease;
		transition: all 0.3s ease;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		box-sizing: border-box;
		padding: px2rem(8);

		div {
			font-size: 14px;
			margin-bottom: px2rem(15);
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			&:nth-last-child(1) {
				margin-bottom: 0;
			}
			&.active{
				color: #19b1f0;
			}
		}

		&.open {
			transform: translateX(px2rem(100));
			-webkit-transition: all 0.6s ease;
			transition: all 0.6s ease;
		}
	}

	.mask-all {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(161, 161, 161, .01);
		z-index: 99;
	}
}
</style>
