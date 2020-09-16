<template>
	<div class="panel">
		<img src="../../assets/images/menu.png" class="menu">
		<div class="info" v-show="trueName">
			<img src="../../assets/images/photo.png">
			<p>
				<strong>{{ trueName }}</strong>
			</p>
		</div>
	</div>
</template>
<script>
import {Request} from '@/api';
import HandleToast from '@/utils/toast';

export default {
	name: "user",
	components: {},
	data() {
		return {
			trueName: ''
		}
	},
	beforeMount() {
		this.init()
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
							path:'/login'
						})
					}, 1000)

				}
			}).catch(err => {
				console.log(err)
			})
		},
		selectItem(param) {
			this.$emit('checkLogin', param);
		}
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
}
</style>
