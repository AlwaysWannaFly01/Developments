<template>
	<div class="page-address">
		<van-cell-group>
			<van-field v-model="name" label="姓名" placeholder="请输入姓名"/>
			<van-field v-model="tel" type="tel" label="联系电话" placeholder="请输入联系电话" maxlength="11"/>
			<van-field label="所在地区" placeholder="省, 市, 区" :value="value" readonly
					   right-icon="location-o" @click="showPickerPop"/>
			<van-field v-model="address" label="详细地址" placeholder="请输入详细地址"/>
		</van-cell-group>
		<section>
			<van-checkbox v-model="checked" checked-color="#7abb56">设置为默认地址</van-checkbox>
		</section>
		<van-button type="primary" size="large" color="#7abb56" @click="saveAddress">立即保存</van-button>
		<van-popup v-model="showPicker" position="bottom">
			<van-picker
				show-toolbar
				:columns="provinceCityCountry"
				@cancel="showPicker = false"
				@confirm="onConfirm"
				@change="onChange"
			/>
		</van-popup>
	</div>
</template>

<script>
import Vue from 'vue';
import {Form, Field, Popup, Checkbox, Picker} from 'vant';

Vue.use(Form).use(Field).use(Popup).use(Checkbox).use(Picker);
import _ from "lodash";
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';
import ProvinceCityCountryData from '@/assets/data/ProvinceCityCountry';
export default {
	name: "Address",
	props: [
		"childData"
	],
	data() {
		return {
			name: '',
			tel: '',
			address: '',
			value: '',
			showPicker: false,
			checked: true,
			provinceCityCountry: [],
			areaId: '',
			addressId: ''
		}
	},
	beforeMount() {
		console.log(this.childData)
		if (this.childData) {
			this.name = this.childData.userName;
			this.tel = this.childData.userPhone;
			this.address = this.childData.userAddress;
			this.checked = this.childData.isDefault;
			this.value = this.childData.areaName;
			this.areaId = this.childData.areaId;
			this.addressId = this.childData.addressId;
		}
	},
	mounted() {
		this.provinceCityCountry = ProvinceCityCountryData;
	},
	methods: {
		showPickerPop() {
			this.showPicker = true;
		},
		onConfirm(value, index) {
			console.log(value);
			console.log(index);
			const {provinceCityCountry} = this;
			const areaId = provinceCityCountry[index[0]].children[index[1]].children[index[2]].areaId
			this.value = value.join(', ');
			this.areaId = areaId;
			this.showPicker = false;
			console.log(areaId)
		},
		onChange(picker, values) {
		},
		async saveAddress() {
			const {name, tel, areaId, address, checked, addressId} = this;
			let params = {
				userName: name,
				userPhone: tel,
				userAddress: address,
				areaId
			}

			console.log(params);
			if (_.every(params)) {
				if (!this.checkPhone(params.userPhone)) {
					HandleToast('手机号码有误，请重新填写');
				} else {
					params['isDefault'] = checked;
					params['addressId'] = addressId;
					let res = await this.interEdits(params);
					console.log(res)
					HandleToast(res.msg, 'success');
					setTimeout(() => {
						this.$router.replace({
							name: "ManageAddress",
						})
					}, 800)
				}
			} else {
				HandleToast('请将内容填写完整')
			}
		},
		checkPhone(phoneNumber) {
			if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
				return false;
			}
			return true;
		},

		/*新增我的地址*/
		interEdits(params) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/users/edits', 'post', params).then(res => {
					if (res.status === 1) {
						resolve(res);
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
		}
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-address {
	background-color: rgba(242, 244, 243, .5);
	height: 100vh;
	box-sizing: border-box;

	.line {
		width: 100%;
		height: px2rem(10);
		background-color: rgba(235, 237, 240, .5);
	}

	section {
		height: 44px;
		margin-top: px2rem(10);
		padding-left: px2rem(15);
		background-color: #fff;

		.van-checkbox {
			height: 44px;

			.van-checkbox__label {
				font-size: 14px;
			}
		}
	}

	.van-button {
		height: 40px;
		border-radius: 20px;
		margin: px2rem(20) px2rem(10) 0;
		width: px2rem(355);
	}
}
</style>
