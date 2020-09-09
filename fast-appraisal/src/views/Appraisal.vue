<template>
	<div class="page-appraisal" :style="{height: height + 'px'}">
		<div class="appraisal-panel">
			<User/>
		</div>
		<div class="center-panel">
			<van-cell icon="shop-o" class="province" value-class="_item">
				<template #title>
					<span class="custom-title">省份:</span>
					<span class="_request">*</span>
				</template>
				<div @click="showPopup('province')">
					<span>{{ selectProvince ? selectProvince : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="city" value-class="_item">
				<template #title>
					<span class="custom-title">城市:</span>
					<span class="_request">*</span>
				</template>
				<div @click="showPopup('city')">
					<span>{{ selectCity.value ? selectCity.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="type" value-class="_item">
				<template #title>
					<span class="custom-title">评估类型:</span>
					<span class="_request">*</span>
				</template>
				<div @click="showPopup('appraisalType')">
					<span>{{ selectAppraisalType ? selectAppraisalType : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-field
				v-model="person"
				label="领勘人"
				placeholder="请输入领勘人"
				input-align="right"
				left-icon="smile-o"
				class="person"
			></van-field>
			<van-field
				v-model="tel"
				label="联系电话"
				placeholder="请输入电话"
				input-align="right"
				left-icon="smile-o"
				class="tel"
				type="tel"
			></van-field>
			<van-field
				v-model="price"
				label="网签价格"
				placeholder="请输入价格"
				input-align="right"
				left-icon="smile-o"
				class="price"
				type="number"
			></van-field>
			<van-cell icon="shop-o" class="company" value-class="_item">
				<template #title>
					<span class="custom-title">评估公司:</span>
					<span class="_request">*</span>
				</template>
				<div @click="showPopup('company')">
					<span>{{ selectCompany.value ? selectCompany.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="accessory" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">房本附件:</span>
				</template>
				<div @click="showUpload">
					<img src="../assets/images/icon.png"/>
				</div>
			</van-cell>

			<van-cell title value value-class="_item" class="_empty"></van-cell>

			<van-popup v-model="show" position="bottom">
				<van-picker
					title="标题"
					show-toolbar
					:columns="columns"
					@confirm="onConfirm"
					@cancel="onCancel"
					@change="onChange"
				/>
			</van-popup>

			<van-popup v-model="uploadShow" class="_uploadClass" position="bottom">
				<van-uploader :after-read="afterRead" v-model="fileList" multiple/>
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
	Uploader
} from "vant";

Vue.use(Overlay)
	.use(DropdownMenu)
	.use(DropdownItem)
	.use(Picker)
	.use(Dialog)
	.use(Popup)
	.use(Uploader);

import {postData, getData} from '@/api';
import _ from 'lodash';

export default {
	name: "Appraisal",
	components: {
		User,
	},
	data() {
		return {
			show: false,
			selectProvince: "",
			selectedProvince: {},
			selectCity: {},
			selectedCity: {},
			selectAppraisalType: "",
			person: '',
			tel: '',
			selectCompany: {},
			selectedCompany: {},
			price: "",
			columns: [],
			uploadShow: false,
			fileList: [
				{url: 'https://img.yzcdn.cn/vant/leaf.jpg'},
				// Uploader 根据文件后缀来判断是否为图片文件
				// 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
				{url: 'https://img.yzcdn.cn/vant/tree.jpg', isImage: true},
			],
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
			/*获取城市*/
			postData('/Home/BindCaadRegionDropdownListJson', {
				parentId: 0
			}).then(res => {
				console.log(res)
				/*测试数据*/
				// res = [{
				// 	Disabled: false,
				// 	Group: null,
				// 	Selected: false,
				// 	Text: "北京市",
				// 	Value: "110000"
				// }, {
				// 	Disabled: false,
				// 	Group: null,
				// 	Selected: false,
				// 	Text: "武汉市",
				// 	Value: "110001"
				// }]
				/*测试数据*/
				this.cityColumn = _.map(res, 'Text');
				this.cityData = res;
			}).catch(err => {
				console.log(err)
			})


			/*获取评估公司*/
			getData('/Home/GetApprovalCompanyList').then(res => {
				console.log(res)
				this.companyColumn = _.map(res, 'CompanyName');
				this.companyData = res;
				console.log('this.companyColumn', this.companyColumn)
				console.log('this.companyData', this.companyData)
			}).catch(err => {
				console.log(err)
			})

		},
		showPopup(type) {
			this.show = true;
			switch (type) {
				case 'province':
					this.columns = ['湖北', '浙江', '湖南', '江西', '四川', '河北', '广西', '江苏'];
					this.selectedOption = 'province';
					break;
				case 'city':
					this.columns = this.cityColumn;
					this.selectedOption = 'city';
					break;
				case 'appraisalType':
					this.columns = ['预评', '正式'];
					this.selectedOption = 'appraisalType';
					break;
				case 'company':
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
			console.log(this.selectedOption)
			switch (this.selectedOption) {
				case "province":
					this.selectProvince = value;
					break;
				case 'city':
					this.selectCity = {value, index};
					this.selectData('city');
					break;
				case 'appraisalType':
					this.selectAppraisalType = value;
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
					this.selectedProvince = {};
					break;
				case 'city':
					this.selectedCity = this.cityData[this.selectCity.index];
					break;
				case 'company':
					this.selectedCompany = this.companyData[this.selectCompany.index];
					break;

				default:
					break;

			}
		},
		submit() {
			const {selectedProvince, selectedCity, selectAppraisalType, person, tel, price, selectedCompany} = this;
			console.log('selectedProvince: ', selectedProvince)
			console.log('selectedCity: ', selectedCity)
			console.log('selectAppraisalType: ', selectAppraisalType)
			console.log('selectedCompany: ', selectedCompany)
			console.log('person: ', person)
			console.log('tel: ', tel)
			console.log('price: ', price)


			const params = {
				HouseProvinceID: selectedProvince.Value || '',       /*省份Id*/
				HouseProvinceName: selectedProvince.Text || '',     /*省份名称*/
				HouseCityID: selectedCity.Value || '',             /*城市Id*/
				HouseCityName: selectedCity.Text || '',           /*城市名称*/
				PingGuLeiXing: selectAppraisalType || '',        /*评估类型*/
				LingKanRen: person || '',     				    /*领勘人*/
				ContactNumber: tel || '',     				   /*联系电话*/
				ExpectedEvaluationValue: price || '',     	  /*网签价格*/
				AppraiseCompanyID: selectedCompany || '',    /*评估公司*/
				fangben: ''
			}
			console.log(params)
			// postData('/Home/OnSaveEntrust', params).then(res => {
			// 	console.log(res)
			// 	if(res.IsSuccess){
			//
			// 	}
			// }).catch(err => {
			// 	console.log(err)
			// })

			Toast({
				type: "success",
				message: '提交成功'
			});
		},
		showUpload() {
			this.uploadShow = true
		},
		afterRead(file) {
			// 此时可以自行将文件上传至服务器
			console.log(file);
		},
	},
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
				//.van-cell__left-icon {
				//	background-image: url("../assets/images/icon_person.png");
				//}
				.van-field__left-icon {
					.van-icon {
						background-image: url("../assets/images/icon_price.png");

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
					div {
						height: px2rem(35);

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

			._request {
				color: red;
			}

			.van-cell__title {
				color: #b8b8b8;
			}

			&._empty {
				padding: 0;
			}
		}

		.van-cell {
			&._empty {
				padding: 0;
			}
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

	._uploadClass {
		.van-uploader {
			padding: px2rem(8);
			max-height: 308px;

			.van-image,
			.van-uploader__upload {
				width: px2rem(80);
				height: px2rem(80);
			}
		}

	}
}
</style>
