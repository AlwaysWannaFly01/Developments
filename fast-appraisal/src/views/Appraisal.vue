<template>
	<div class="page-appraisal" :style="{height: height + 'px'}">
		<div class="appraisal-panel">
			<User/>
		</div>
		<div class="center-panel">
			<van-cell icon="shop-o" class="province" value-class="_item">
				<template #title>
					<span class="custom-title">省份:</span>
					<span class="_require">*</span>
				</template>
				<div class="_desc" @click="showPopup('province')">
					<span>{{ selectProvince.value ? selectProvince.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="city" value-class="_item">
				<template #title>
					<span class="custom-title">城市:</span>
					<span class="_require">*</span>
				</template>
				<div class="_desc" @click="showPopup('city')">
					<span>{{ selectCity.value ? selectCity.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="type" value-class="_item">
				<template #title>
					<span class="custom-title">评估类型:</span>
					<span class="_require">*</span>
				</template>
				<div class="_desc" @click="showPopup('appraisalType')">
					<span>{{ selectAppraisalTypeValue ? selectAppraisalTypeValue : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-field
				v-model="person"
				label="领勘人:"
				placeholder="请输入领勘人"
				input-align="right"
				left-icon="smile-o"
				class="person"
			>
			</van-field>
			<van-field
				v-model="tel"
				label="联系电话:"
				placeholder="请输入电话"
				input-align="right"
				left-icon="smile-o"
				class="tel"
				type="tel"
				maxlength="11"
				@blur="handleTelBlur"
			></van-field>
			<van-field
				v-model="price"
				label="网签价格:"
				placeholder="请输入价格"
				input-align="right"
				left-icon="smile-o"
				class="price"
				type="number"
			></van-field>
			<van-cell icon="shop-o" class="company" value-class="_item">
				<template #title>
					<span class="custom-title">评估公司:</span>
					<span class="_require">*</span>
				</template>
				<div class="_desc" @click="showPopup('company')">
					<span>{{ selectCompany.value ? selectCompany.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="accessory" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">房本附件:</span>
					<span class="_require">*</span>
				</template>
				<van-uploader v-model="fileList" :after-read="afterRead" @delete="deleteFile" :max-count="1">
					<div>
						<img v-if="fileSrc" :src="fileSrc">
						<img v-else src="../assets/images/icon.png"/>
					</div>
				</van-uploader>
			</van-cell>

			<van-divider/>

			<van-popup v-model="show" position="bottom">
				<van-picker
					title="标题"
					show-toolbar
					:columns="columns"
					@confirm="onConfirm"
					@cancel="onCancel"
					@change="onChange"
					:loading="loading"
				/>
			</van-popup>

		</div>

		<div class="btn-panel">
			<van-button type="default" class="btn" @click="submit">委托预评</van-button>
		</div>
	</div>
</template>

<script>
import User from "@/components/user/user";
import Vue from "vue";
import {
	Overlay,
	DropdownMenu,
	DropdownItem,
	Picker,
	Toast,
	Dialog,
	Popup,
	Uploader,
	Notify,
	Divider
} from "vant";

Vue.use(Overlay)
	.use(DropdownMenu)
	.use(DropdownItem)
	.use(Picker)
	.use(Dialog)
	.use(Popup)
	.use(Uploader)
	.use(Notify)
	.use(Divider);
import Vconsole from 'vconsole';

// let vConsole = new Vconsole()
// Vue.use(vConsole)

import {Request} from '@/api';
import _ from 'lodash';
import HandleToast from '@/utils/toast';
import Exif from 'exif-js';

export default {
	name: "Appraisal",
	components: {
		User,
	},
	data() {
		return {
			show: false,
			selectProvince: {},
			selectedProvince: {},
			selectCity: {},
			selectedCity: {},
			selectAppraisalType: "",
			selectAppraisalTypeValue: '',
			person: '',
			tel: '',
			selectCompany: {},
			selectedCompany: {},
			price: "",
			columns: [],
			fileSrc: null,
			fileList: [],
			loading: null,
			rotateState: 1
		};
	},
	beforeMount() {
		this.height = window.innerHeight;
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			/*获取省份 : parentId: 0*/
			Request('/Home/BindCaadRegionDropdownListJson', 'post', {parentId: 0}).then(res => {
				// console.log(res)
				this.provinceColumn = _.map(res, 'Text');
				this.provinceData = res;
			}).catch(err => {
				console.log(err)
			})

			/*获取评估公司*/
			Request('/Home/GetApprovalCompanyList', 'get').then(res => {
				// console.log(res)
				this.companyColumn = _.map(res, 'CompanyName');
				this.companyData = res;
				// 	// console.log('this.companyColumn', this.companyColumn)
				// 	// console.log('this.companyData', this.companyData)
			}).catch(err => {
				console.log(err)
			})
		},

		async getCity(param) {
			return await Request('/Home/BindCaadRegionDropdownListJson', 'post', {
				parentId: param
			})
		},
		showPopup(type) {
			switch (type) {
				case 'province':
					this.show = true;
					this.columns = this.provinceColumn;
					this.selectedOption = 'province';
					break;
				case 'city':
					// console.log(this.selectedProvince)
					if (!this.selectedProvince.Value || !this.selectedProvince.Text) {
						this.show = false;
						HandleToast('请先选择省份')
					} else {
						this.columns = [];
						this.show = true;
						this.loading = true;
						this.getCity(this.selectedProvince.Value).then(res => {
							// setTimeout(() => {
							this.cityColumn = _.map(res, 'Text');
							this.cityData = res;
							this.columns = this.cityColumn;
							this.selectedOption = 'city';
							this.loading = false;
							// }, 500)
						}).catch(err => {
							console.log(err)
						})
					}
					break;
				case 'appraisalType':
					this.show = true;
					this.columns = ['预评', '正式'];
					this.selectedOption = 'appraisalType';
					break;
				case 'company':
					this.show = true;
					this.columns = this.companyColumn;
					this.selectedOption = 'company';
					break;
				default:
					break;
			}

		},
		click() {
			this.show = true;
		},
		onChange(picker, value, index) {
			Toast(`当前值：${value}, 当前索引：${index}`);
		},
		onCancel() {
			Toast('取消');
			this.show = false;
		},
		onConfirm(value, index) {
			Toast(`当前值：${value}, 当前索引：${index}`);
			// console.log(this.selectedOption)
			switch (this.selectedOption) {
				case "province":
					this.selectProvince = {value, index};
					this.selectData('province');
					break;
				case 'city':
					this.selectCity = {value, index};
					this.selectData('city');
					break;
				case 'appraisalType':
					if (value === '预评') {
						this.selectAppraisalTypeValue = '预评';
						this.selectAppraisalType = '1';
					} else if (value === '正式') {
						this.selectAppraisalTypeValue = '正式';
						this.selectAppraisalType = '2'
					}
					break;
				case 'company':
					this.selectCompany = {value, index};
					this.selectData('company');
					break;
				default:
					break;
			}
			this.show = false;
		},
		selectData(param) {
			switch (param) {
				case 'province':
					this.selectedProvince = this.provinceData[this.selectProvince.index];
					break;
				case 'city':
					this.selectedCity = this.cityData[this.selectCity.index];
					break;
				case 'company':
					this.selectedCompany = this.companyData[this.selectCompany.index];
					// console.log(this.selectedCompany);
					break;
				default:
					break;
			}
		},
		submit() {
			const {selectedProvince, selectedCity, selectAppraisalType, person, tel, price, selectedCompany, file} = this;
			let params = {
				HouseProvinceID: selectedProvince.Value || '',       /*省份Id*/
				HouseProvinceName: selectedProvince.Text || '',     /*省份名称*/
				HouseCityID: selectedCity.Value || '',             /*城市Id*/
				HouseCityName: selectedCity.Text || '',           /*城市名称*/
				PingGuLeiXing: selectAppraisalType || '',  		 /*评估类型*/
				LingKanRen: person || '',     				    /*领勘人*/
				ContactNumber: tel || '',     				   /*联系电话*/
				ExpectedEvaluationValue: price || '',     	  /*网签价格*/
				AppraiseCompanyID: selectedCompany.ID || '',    /*评估公司*/
				fangben: file
			}
			if (_.every(params)) {
				if (!this.checkPhone(params.ContactNumber)) {
					HandleToast('手机号码有误，请重新填写')
				} else {
					let formData = new FormData();
					formData.append('HouseProvinceID', params.HouseProvinceID)
					formData.append('HouseProvinceName', params.HouseProvinceName)
					formData.append('HouseCityID', params.HouseCityID)
					formData.append('HouseCityName', params.HouseCityName)
					formData.append('PingGuLeiXing', params.PingGuLeiXing)
					formData.append('LingKanRen', params.LingKanRen)
					formData.append('ContactNumber', params.ContactNumber)
					formData.append('ExpectedEvaluationValue', params.ExpectedEvaluationValue)
					formData.append('AppraiseCompanyID', params.AppraiseCompanyID)
					formData.append('fangben', params.fangben)

					console.log(params)

					const instance = this.$axios.create({
						withCredentials: true    /*axios 默认不允许跨域请求,会将file拦截下来,所以后台接收不到数据的,这样修改*/
					})

					instance.post('/Home/OnSaveEntrust', formData, {
						headers: { //添加请求头
							"Content-Type": "multipart/form-data"
						}
					}).then(res => {
						console.log(res)
						if (res.data.IsSuccess) {
							HandleToast('上传成功', 'success', 800);
							setTimeout(() => {
								this.$router.push({
									path: "/list",
								});
							}, 1000)
						}
					}).catch(err => {
						console.log(err)
					})


					// Request('/Home/OnSaveEntrust', 'post', params).then(res => {
					// 	// console.log(res)
					// 	if (res.IsSuccess) {
					// 		HandleToast('上传成功', 'success', 800);
					// 		setTimeout(() => {
					// 			this.$router.push({
					// 				path: "/list",
					// 			});
					// 		}, 1000)
					// 	}
					// }).catch(err => {
					// 	console.log(err)
					// })
				}
			} else {
				HandleToast('请将内容填写完整')
			}
		},
		afterRead(file) {
			// 此时可以自行将文件上传至服务器
			// console.log(file);
			this.file = file.file;//文件流
			this.fileSrc = file.content;
			// console.log(this.fileList)
		},

		async deleteFile(file) {
			return new Promise((resolve, reject) => {
				// console.log("删除文件的回调,delete");
				// console.log(file)
				// console.log(this.fileList)
				if (this.fileList.length < 1) {
					// console.log(this.fileSrc)
					this.fileSrc = '';
				}
				resolve();
			});
		},
		handleTelBlur(e) {
			const {value} = e.target;
			if (!this.checkPhone(value)) {
				HandleToast('手机号码有误，请重新填写')
			}

		},
		checkPhone(phoneNumber) {
			if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
				return false;
			}
			return true;
		}
	}
};
</script>

<style lang="scss">
@import "../assets/styles/global.scss";

.page-appraisal {
	box-sizing: border-box;
	background-color: #ebeef5;
	display: flex;
	flex-direction: column;

	.appraisal-panel {
		padding: 13px 10px 10px;
		box-sizing: border-box;
	}

	.center-panel {
		overflow-y: auto;
		margin: 0 10px;
		flex: 1;
		background-color: #fff;
		border-radius: px2rem(5);

		.van-cell {
			padding-right: px2rem(20);

			&.province,
			&.city,
			&.type,
			&.person,
			&.tel,
			&.price,
			&.company,
			&.accessory {
				.van-cell__left-icon {
					background-size: 20px 20px;
					background-repeat: no-repeat;
					font-size: 20px;

					&::before {
						content: "";
					}
				}

				.van-field__left-icon {
					.van-icon {
						background-size: 20px 20px;
						background-repeat: no-repeat;
						font-size: 20px;
					}
				}
			}

			&.province {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_province.png");
				}
			}

			&.city {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_city.png");
				}
			}

			&.type {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_type.png");
				}
			}

			&.person {
				.van-field__left-icon {
					.van-icon {
						background-image: url("../assets/images/icon_person.png");

						&::before {
							content: "";
						}
					}
				}
			}

			&.tel {
				.van-field__left-icon {
					.van-icon {
						background-image: url("../assets/images/icon_tel.png");

						&::before {
							content: "";
						}
					}
				}
			}

			&.price {
				.van-field__left-icon {
					.van-icon {
						background-image: url("../assets/images/icon_price.png");

						&::before {
							content: "";
						}
					}
				}
			}

			&.company {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_company.png");
				}
			}

			&.accessory {
				padding: 5px 16px;
				display: flex;
				align-items: center;

				.van-cell__left-icon {
					background-image: url("../assets/images/icon_accessory.png");
				}

				._item {
					.van-uploader {
						height: px2rem(35);

						.van-uploader__preview {
							margin: 0;

							.van-image {
								width: px2rem(35);
								height: px2rem(35);

								.van-image__img {
									margin-left: 0;
								}
							}

							.van-uploader__preview-delete {
								width: px2rem(14);
								height: px2rem(14);
							}
						}

						img {
							width: px2rem(35);
							height: px2rem(35);
						}
					}

				}
			}

			._item {
				//text-align: right;
				color: #999;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				img {
					width: 12px;
					height: 11px;
					margin-left: px2rem(10);
				}
			}

			._require {
				color: red;
			}

			.van-cell__title {
				color: #b8b8b8;
			}

			&._empty {
				padding: 0;
			}

			._desc {
				display: flex;
				align-items: center;
			}
		}

		.van-cell {
			&._empty {
				padding: 0;
			}
		}

		.van-field {
			.van-cell__title {
				span {
					&::after {
						content: " *";
						color: red;
					}
				}
			}
		}

		.van-divider {
			margin: 0 16px;
			border-color: transparent;
		}
	}

	.btn-panel {
		padding: 0 10px;

		.btn {
			height: 44px;
			margin: 15px 0;
			width: 100%;
			background-color: transparent;
			background-image: url("../assets/images/list-bg.png");
			background-size: cover;
			border-radius: px2rem(20);
			color: #fff;
			border: none;
		}
	}
}
</style>
