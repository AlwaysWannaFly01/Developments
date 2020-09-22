<template>
	<div class="page-manageAddress">
		<div class="empty">
			<img src="../../assets/images/noAddress.png">
		</div>
		<van-button icon="location-o" color="#7abb56" @click="toAddAddress">添加新地址</van-button>
	</div>

</template>

<script>
import Vue from 'vue';
import { Button ,Icon} from 'vant';

Vue.use(Button).use(Icon);
export default {
	name: "manageAddress",
	data(){
		return{

		}
	},
	methods:{
		toAddAddress(){
			this.$router.push({
				name: "AddAddress",
			});
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.page-manageAddress{
	.empty{
		text-align: center;
		padding: px2rem(20);
		img{
			width: px2rem(200);
		}
	}
	.van-button{
		border-radius: 22px;
		position: fixed;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
