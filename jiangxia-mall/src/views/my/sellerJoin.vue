<template>
	<div class="page-sellerJoin">
		<van-cell-group>
			<!-- 输入任意文本 -->
			<van-field v-model="companyName" label="公司名称" placeholder="请输入公司名称"/>
			<van-field v-model="number" label="执照编号" placeholder="请输入营业执照编号"/>
			<van-field v-model="contactName" label="联系人" placeholder="请输入联系人姓名"/>
			<van-field v-model="tel" type="tel" maxlength="11" label="联系电话" placeholder="请输入联系电话"/>
			<van-field label="所在地区" placeholder="省, 市, 区" :value="value" readonly
					   right-icon="location-o" @click="showPickerPop"/>
			<van-field
				v-model="address"
				rows="2"
				autosize
				label="详细地址"
				type="textarea"
				placeholder="街道门牌信息"
			/>
			<van-field
				v-model="companyDesc"
				rows="3"
				autosize
				label="公司简介"
				type="textarea"
				placeholder="请输入公司简介"
			/>
			<van-field
				v-model="businessScope"
				rows="3"
				autosize
				label="经营范围"
				type="textarea"
				placeholder="请输入经营范围"
			/>
			<van-field name="license" label="上传公司营业执照" class="flex-d-c">
				<template #input>
					<van-uploader v-model="license" :max-count="1"/>
				</template>
			</van-field>
			<van-field name="logo" label="上传公司logo" class="flex-d-c">
				<template #input>
					<van-uploader v-model="logo" :max-count="1"/>
				</template>
			</van-field>
		</van-cell-group>
		<van-button type="primary" size="large" color="#7abb56" @click="submit">提交申请</van-button>
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
import Vue from "vue";
import {Field, Cell, CellGroup, Uploader, Button, Divider, Toast} from "vant";

Vue.use(Cell).use(Field).use(CellGroup).use(Uploader).use(Button).use(Divider).use(Toast);
import _ from 'lodash';
import HandleToast from '@/utils/toast';
import {Request} from "@/api/index";

export default {
	name: "sellerJoin",
	mounted() {
		this.provinceCityCountry = JSON.parse(localStorage.getItem('localProvinceCityCountry'));
		console.log(this.provinceCityCountry)
	},
	data() {
		return {
			companyName: '',
			number: '',
			contactName: '',
			tel: '',
			address: '',
			companyDesc: '',
			businessScope: '',
			license: [],
			logo: [],
			showPicker: false,
			value: '',
			provinceCityCountry: []
		}
	},
	methods: {
		getDataFormSon(data) {
			console.log(data)
			if (data) {
				this.areaIdPath = data;
			}
		},
		submit() {
			const {companyName, number, contactName, tel, address, companyDesc, businessScope, license, logo, areaIdPath} = this;
			const params = {
				shopCompany: companyName,
				shopAddress: address,
				areaIdPath: areaIdPath,
				shopImg: logo,
				businessLicence: number,
				businessLicenceImg: license,
				empiricalRange: businessScope,
				applyLinkTel: tel,
				applyLinkMan: contactName,
				companyProfile: companyDesc
			}
			if (_.every(params)) {
				if (!this.checkPhone(params.applyLinkTel)) {
					HandleToast('手机号码有误，请重新填写');
				} else if (_.isEmpty(params.businessLicenceImg)) {
					HandleToast('请上传公司营业执照');
				} else if (_.isEmpty(params.shopImg)) {
					HandleToast('请上传公司logo');
				} else {
					console.log(params)
					Request('main', 'weapp/shopapplys/add', 'post', params).then(res => {
						console.log(res);
						if (res.status === 1) {

						} else {
							Toast({
								message: '功能正在完善中,敬请期待...',
								icon: 'smile-o',
							});

							setTimeout(() => {
								this.$router.push({
									name: 'My'
								})
							})
						}
					}).catch(err => {
						console.log(err)
					})
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
		showPickerPop() {
			this.showPicker = true;
		},
		onConfirm(value, index) {
			console.log(value);
			console.log(index);
			const {provinceCityCountry} = this;
			const areaId = provinceCityCountry[index[0]].children[index[1]].children[index[2]].areaId
			// console.log(areaId);
			this.value = value.join(', ');
			this.showPicker = false;
		},
		onChange(picker, values) {
			// console.log('picker:', picker)
			// console.log('values:', values)
			// 	picker.setColumnValues(1, cities[values[0]]);
			// 	picker.setColumnValues(2, cities[values[0]]);
		},
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-sellerJoin {
	.flex-d-c {
		.van-cell__title {
			width: 100%;
		}
	}

	.van-button {
		width: px2rem(345);
		margin: px2rem(20) px2rem(15);
		height: px2rem(40);
		border-radius: px2rem(20);
	}

	.van-divider {
		margin: 0 16px;
	}

	.provincecitycountry {
		.van-cell {
			&::after {
				border-bottom-color: transparent;
			}
		}
	}
}
</style>
