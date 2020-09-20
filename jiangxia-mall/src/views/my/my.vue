<template>
	<div class="page-my">
		<div class="personal">
			<img src="@/assets/images/jx/default_avatar.png">
			<h2>项目</h2>
		</div>
		<div class="my-order"></div>
	</div>
</template>
<script>
import Vue from 'vue';
import { Image as VanImage } from 'vant';

Vue.use(VanImage);
export default {
	data() {
		return {}
	},
	components: {},
	methods: {}
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/global.scss";

.page-my {
	padding: 0 px2rem(10);
	box-sizing: border-box;
	background-image: url("../../assets/images/jx/my-bg.png");
	background-size: px2rem(375);
	background-repeat: no-repeat;
	.personal {
		width: 100%;
		padding: px2rem(30) 0;
		display: flex;
		align-items: center;
		img{
			width: px2rem(50);
			height: px2rem(50);
			border-radius:px2rem(25);
			margin-right: px2rem(20);
		}
		h2{
			font-size: 20px;
		}
	}

	.my-order {
		width: 100%;
	}
}
</style>

