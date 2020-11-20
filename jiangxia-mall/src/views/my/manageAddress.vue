<template>
	<div class="page-manageAddress">
		<div class="empty" v-if="myAddressList&&myAddressList.length === 0">
			<img src="../../assets/images/noAddress.png">
		</div>
		<div class="address-list" :style="mainHeight" v-if="myAddressList&&myAddressList.length > 0">
			<div class="list-container">
				<div v-for="(item,index) in myAddressList" :key="index" class="list-item">
					<div class="list-item-top">
						<h3>{{ `收货人:${item.userName}  ${item.userPhone}` }}</h3>
						<p>{{ `收获地址: ${item.fullAddress}` }}</p>
					</div>
					<van-divider/>
					<div class="list-item-bottom">
						<van-checkbox v-model="item.isDefault" checked-color="#7abb56" @click="setDefault(item)"
									  :disabled="item.isDefault?true:false">设为默认
						</van-checkbox>
						<div class="oper">
							<div class="edit" @click="editAddress(item)">
								<van-icon name="edit"/>
								<span>编辑</span>
							</div>
							<div class="delete" @click="deleteAddress(item)">
								<van-icon name="delete"/>
								<span>删除</span>
							</div>
						</div>
					</div>
				</div>
				<p>我也是有底线的</p>
			</div>
		</div>
		<div class="btn-block">
			<van-button icon="location-o" color="#7abb56" @click="toAddAddress">添加新地址</van-button>
		</div>
	</div>

</template>

<script>
import Vue from 'vue';
import {Button, Icon, Divider, Checkbox} from 'vant';

Vue.use(Button).use(Icon).use(Divider).use(Checkbox);
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "manageAddress",
	data() {
		return {
			myAddressList: null,
			checked: false
		}
	},
	beforeMount() {
		this.deviceHeight = window.innerHeight;
		this.mainHeight = {
			height: window.innerHeight - 53 + "px",
		};
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
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		async deleteAddress(param) {
			if (param) {
				const res = await this.interDel(param.addressId);
				HandleToast(res, 'success');
				let result = await this.interMyShippingAddress();
				setTimeout(() => {
					this.myAddressList = result;
				}, 800)
			}
		},
		interDel(addressId) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/del', 'post', {addressId}).then(res => {
					console.log(res)
					if (res.status === 1) {
						resolve(res.msg)
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		async setDefault(param) {
			console.log(param)
			console.log(this.myAddressList);
			let newArr = [];
			this.myAddressList.map(item => {
				if (item.addressId === param.addressId) {
					item.isDefault = 1;
				} else {
					item.isDefault = 0;
				}
				newArr.push(item)
			})
			// console.log(newArr)
			this.myAddressList = newArr;
			if (param) {
				const res = await this.interSetDefault(param.addressId);
				HandleToast(res, 'success', 500);
			}
		},
		interSetDefault(addressId) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/setdefault', 'post', {addressId}).then(res => {
					console.log(res)
					if (res.status === 1) {
						resolve(res.msg)
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		editAddress(param) {
			console.log(param);
			this.$router.push({
				name: 'AddAddress',
				query: {
					data: {
						addressId: param.addressId,
						userName: param.userName,
						userPhone: param.userPhone,
						areaName: param.areaName,
						userAddress: param.userAddress,
						isDefault: param.isDefault,
						areaId: param.areaId
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

.page-manageAddress {
	background-color: #fff;
	//padding-bottom: 53px;
	.empty {
		text-align: center;
		padding: px2rem(20);

		img {
			width: px2rem(200);
		}
	}

	&::before {
		position: fixed;
		right: 0;
		top: 0;
		left: 0;
		height: 2px;
		background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
		background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
		background-size: 80px;
		content: '';
	}

	.address-list {
		overflow-y: auto;
		background: rgba(201, 201, 201, 0.1);

		.list-container {
			//margin-bottom: 53px;
			.list-item {
				display: flex;
				flex-direction: column;
				padding: px2rem(20) px2rem(15) 0;
				border-bottom: px2rem(5) solid rgba(201, 201, 201, 0.1);

				.list-item-top {
					h3 {
						font-size: 16px;
						font-weight: 600;
						margin-bottom: px2rem(10);
					}

					p {
						font-size: 16px;
					}
				}

				.list-item-bottom {
					margin-bottom: px2rem(10);
					display: flex;
					align-items: center;
					justify-content: space-between;

					.van-checkbox {
						.van-checkbox__label {
							font-size: 16px;

							&.van-checkbox__label--disabled {
								color: #000;
							}
						}

						.van-checkbox__icon--disabled .van-icon {
							border-color: rgb(122, 187, 86);
							background-color: rgb(122, 187, 86);
							color: #fff;
						}
					}

					.oper {
						font-size: 16px;
						display: flex;
						width: px2rem(140);
						justify-content: space-between;

						.edit {
							display: flex;
							align-items: center;
						}

						.delete {
							display: flex;
							align-items: center;
						}

						span {
							margin-left: px2rem(6);
						}
					}
				}

				.van-divider {
					margin: px2rem(12) 0;
				}
			}

			> p {
				height: px2rem(40);
				line-height: px2rem(40);
				text-align: center;
				font-size: 14px;
				background: rgba(201, 201, 201, 0.1);
			}
		}
	}

	.btn-block {
		position: fixed;
		width: 100%;
		padding: 4px;
		bottom: 0;
		left: 50%;
		background-color: #fff;
		transform: translateX(-50%);
		text-align: center;

		.van-button {
			border-radius: 22px;
			padding: 0 20px;
		}
	}
}
</style>
