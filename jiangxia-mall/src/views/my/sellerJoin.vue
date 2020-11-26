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
			<van-field name="license2" label="上传公司营业执照" class="flex-d-c">
				<template #input>
					<van-uploader v-model="license" :max-count="1" :after-read="afterRead"/>
				</template>
			</van-field>
			<van-field name="logo2" label="上传公司logo" class="flex-d-c">
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
import ProvinceCityCountryData from '@/assets/data/ProvinceCityCountry';
// import {uploadToken} from '@/utils/qiniuUploadToken';

export default {
	name: "sellerJoin",
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
			provinceCityCountry: [],
			// 实名认证后创建的存储空间对应的上传地址(华东，华南等等不一样：https://developer.qiniu.com/kodo/manual/1671/region-endpoint)
			qiniuDomain: "https://upload-z2.qiniup.com",
			// qiniuDomain: "http://youyoujiang.com",
			// 创建成功后官方随机分配的公开图片地址前缀，即上传成功后对应的公用图片地址前缀
			qiniuViewHost: "http://qkbzu8sr4.hn-bkt.clouddn.com",
			// qiniuViewHost: "http://youyoujiang.com",
		}
	},
	async mounted() {
		this.provinceCityCountry = ProvinceCityCountryData;
	},
	methods: {
		async submit() {
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
			console.log(params)
			if (_.every(params)) {
				if (!this.checkPhone(params.applyLinkTel)) {
					HandleToast('手机号码有误，请重新填写');
				} else if (_.isEmpty(params.businessLicenceImg)) {
					HandleToast('请上传公司营业执照');
				} else if (_.isEmpty(params.shopImg)) {
					HandleToast('请上传公司logo');
				} else {
					let res = await this.interAdd(params);
					console.log(res)
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
			this.areaIdPath = areaId;
			this.showPicker = false;
		},
		onChange(picker, values) {
			// console.log('picker:', picker)
			// console.log('values:', values)
			// 	picker.setColumnValues(1, cities[values[0]]);
			// 	picker.setColumnValues(2, cities[values[0]]);
		},
		interAdd(params) {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/shopapplys/add', 'post', params).then(res => {
					console.log(res);
					if (res.status === 1) {
						resolve(res)
					} else {
						HandleToast(res.msg, 'fail', 800, () => {
							this.$router.replace({
								name: 'Login'
							})
						});
					}
				}).catch(err => {
					reject(err);
				})
			})
		},
		afterRead(file) {
			// 此时可以自行将文件上传至服务器
			console.log(file);
			// this.file = file.file;//文件流
			// this.fileSrc = file.content;
			// console.log(this.fileList)
			this.upLoadQiniu(file);
		},
		interAuthToken() {
			return new Promise((resolve, reject) => {
				Request('main', 'weapp/upload/authToken', 'post', {}).then(res => {
					// console.log(res)
					if (res.status === 1) {
						resolve(res)
					}
				}).catch(err => {
					// console.log(err)
					reject(err)
				})
			})
		},
		async upLoadQiniu(req) {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			}
			let fileType = '';
			if (req.file.type === 'image/png') {
				fileType = 'png'
			} else {
				fileType = 'jpg'
			}
			// 重命名要上传的文件
			const keyname = `${new Date().getTime()}${Math.random().toString(36).slice(2)}.${fileType}`;
			const res = await this.interAuthToken();
			const token = res.data;
			const formdata = new FormData();
			formdata.append('file', req.file);
			formdata.append('token', token);
			formdata.append('key', keyname)
			// const result = await this.$axios.post(this.qiniuDomain, formdata, config);

			const result = await Request('main', this.qiniuDomain, 'post', formdata);
			console.log(result)

			console.log(`${this.qiniuViewHost}/${result.key}`)
			this.license = [
				{url: `${this.qiniuViewHost}/${result.key}`}
			]
		}
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
