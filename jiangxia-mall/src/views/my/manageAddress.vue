<template>
	<div class="page-manageAddress">
		<div class="empty" v-if="myAddressList.length === 0">
			<img src="../../assets/images/noAddress.png">
		</div>
		<van-button icon="location-o" color="#7abb56" @click="toAddAddress">添加新地址</van-button>
	</div>

</template>

<script>
import Vue from 'vue';
import {Button, Icon} from 'vant';

Vue.use(Button).use(Icon);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "manageAddress",
	data() {
		return {
			myAddressList: []
		}
	},
	async mounted() {
		let res = await this.interMyShippingAddress();
		// console.log(res)
		this.myAddressList = res;
	},
	methods: {
		toAddAddress() {
			this.$router.push({
				name: "AddAddress"
			});
		},
		interMyShippingAddress() {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/myshippingaddress', 'get').then(res => {
					console.log(res)
					if (res.status === 1) {
						resolve(res.data)
					}
				}).catch(err => {
					reject(err)
				})
			})
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

.page-manageAddress {
	.empty {
		text-align: center;
		padding: px2rem(20);

		img {
			width: px2rem(200);
		}
	}

	.van-button {
		border-radius: 22px;
		position: fixed;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		padding: 0 20px;
	}
}
</style>
