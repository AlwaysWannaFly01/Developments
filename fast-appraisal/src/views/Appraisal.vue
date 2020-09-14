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
				<div @click="showPopup('province')">
					<span>{{ selectProvince.value ? selectProvince.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="city" value-class="_item">
				<template #title>
					<span class="custom-title">城市:</span>
					<span class="_require">*</span>
				</template>
				<div @click="showPopup('city')">
					<span>{{ selectCity.value ? selectCity.value : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell icon="shop-o" class="type" value-class="_item">
				<template #title>
					<span class="custom-title">评估类型:</span>
					<span class="_require">*</span>
				</template>
				<div @click="showPopup('appraisalType')">
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
				<div @click="showPopup('company')">
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
					<div class="tyr">
						<img v-if="fileSrc" class="qqq" :src="fileSrc">
						<!--						<img :src="fileSrc" class="image-to-base64 rotate2" v-else-if="fileSrc&&rotateState==2">-->
						<!--						<img :src="fileSrc" class="image-to-base64 rotate3" v-else-if="fileSrc&&rotateState==3">-->
						<!--						<img :src="fileSrc" class="image-to-base64 rotate4" v-else-if="fileSrc&&rotateState==4">-->
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
					console.log(this.selectedCompany);
					break;
				default:
					break;
			}
		},
		submit() {
			const {selectedProvince, selectedCity, selectAppraisalType, person, tel, price, selectedCompany, file} = this;
			const params = {
				HouseProvinceID: selectedProvince.Value || '',       /*省份Id*/
				HouseProvinceName: selectedProvince.Text || '',     /*省份名称*/
				HouseCityID: selectedCity.Value || '',             /*城市Id*/
				HouseCityName: selectedCity.Text || '',           /*城市名称*/
				PingGuLeiXing: selectAppraisalType || '',  		 /*评估类型*/
				LingKanRen: person || '',     				    /*领勘人*/
				ContactNumber: tel || '',     				   /*联系电话*/
				ExpectedEvaluationValue: price || '',     	  /*网签价格*/
				AppraiseCompanyID: selectedCompany.CusOrganizationID || '',    /*评估公司*/
				fangben: file
			}
			console.log(params)
			if (_.every(params)) {
				if (!this.checkPhone(params.ContactNumber)) {
					HandleToast('手机号码有误，请重新填写')
				} else {
					Request('/Home/OnSaveEntrust', 'post', params).then(res => {
						// console.log(res)
						if (res.IsSuccess) {
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
			this.imgPreview(this.file);

		},
		imgPreview(file) {
			// console.log(file)
			let self = this;
			let Orientation;
			//去获取拍照时的信息，解决拍出来的照片旋转问题
			Exif.getData(file, function () {
				Orientation = Exif.getTag(this, "Orientation");
				console.log('Orientation:', Orientation)
			});

			// if (Orientation == 1) {
			// 	_this.rotateState = 1;
			// } else if (Orientation == 3) {
			// 	_this.rotateState = 2;
			// } else if (Orientation == 6) {
			// 	_this.rotateState = 3;
			// }
			// 看支持不支持FileReader
			// if (!file || !window.FileReader) return;
			// console.log('file1: ', file)
			// if (/^image/.test(file.type)) {
			// 	// 创建一个reader
			// 	let reader = new FileReader();
			// 	// 将图片2将转成 base64 格式
			// 	reader.readAsDataURL(file);
			// 	// 读取成功后的回调
			// 	reader.onloadend = function () {
			// 		let result = this.result;
			// 		let img = new Image();
			// 		img.src = result;
			// 		console.log('this.result', this.result);
			// 		//判断图片是否大于500K,是就直接上传，反之压缩图片
			// 		if (this.result.length <= 500 * 1024) {
			// 			// self.headerImage = this.result;
			// 		} else {
			// 			img.onload = function () {
			// 				let data = self.compress(img, Orientation);
			// 				// self.headerImage = data;
			// 			};
			// 		}
			// 	};
			// }
		},
		// 压缩图片
		compress(img, Orientation) {
			console.log('img', img)
			console.log('Orientation', Orientation)
			let canvas = document.createElement("canvas");
			let ctx = canvas.getContext("2d");
			//瓦片canvas
			let tCanvas = document.createElement("canvas");
			let tctx = tCanvas.getContext("2d");
			// let initSize = img.src.length;
			let width = img.width;
			let height = img.height;
			//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
			let ratio;
			if ((ratio = (width * height) / 4000000) > 1) {
				// console.log("大于400万像素");
				ratio = Math.sqrt(ratio);
				width /= ratio;
				height /= ratio;
			} else {
				ratio = 1;
			}
			canvas.width = width;
			canvas.height = height;
			//        铺底色
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			//如果图片像素大于100万则使用瓦片绘制
			let count;
			if ((count = (width * height) / 1000000) > 1) {
				// console.log("超过100W像素");
				count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
				//            计算每块瓦片的宽和高
				let nw = ~~(width / count);
				let nh = ~~(height / count);
				tCanvas.width = nw;
				tCanvas.height = nh;
				for (let i = 0; i < count; i++) {
					for (let j = 0; j < count; j++) {
						tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
						ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
					}
				}
			} else {
				ctx.drawImage(img, 0, 0, width, height);
			}
			//修复ios上传图片的时候 被旋转的问题
			if (Orientation != "" && Orientation != 1) {
				switch (Orientation) {
					case 6: //需要顺时针（向左）90度旋转
						this.rotateImg(img, "left", canvas);
						break;
					case 8: //需要逆时针（向右）90度旋转
						this.rotateImg(img, "right", canvas);
						break;
					case 3: //需要180度旋转
						this.rotateImg(img, "right", canvas); //转两次
						this.rotateImg(img, "right", canvas);
						break;
				}
			}
			//进行最小压缩
			let ndata = canvas.toDataURL("image/jpeg", 0.1);
			tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
			return ndata;
		},
		// 旋转图片
		rotateImg(img, direction, canvas) {
			//最小与最大旋转方向，图片旋转4次后回到原方向
			const min_step = 0;
			const max_step = 3;
			if (img == null) return;
			//img的高度和宽度不能在img元素隐藏后获取，否则会出错
			let height = img.height;
			let width = img.width;
			let step = 2;
			if (step == null) {
				step = min_step;
			}
			if (direction == "right") {
				step++;
				//旋转到原位置，即超过最大值
				step > max_step && (step = min_step);
			} else {
				step--;
				step < min_step && (step = max_step);
			}
			//旋转角度以弧度值为参数
			let degree = (step * 90 * Math.PI) / 180;
			let ctx = canvas.getContext("2d");
			switch (step) {
				case 0:
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0);
					break;
				case 1:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, 0, -height);
					break;
				case 2:
					canvas.width = width;
					canvas.height = height;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, -height);
					break;
				case 3:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, 0);
					break;
			}
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

		.rotate1 {
			transform: rotate(0deg);
		}

		.rotate2 {
			transform: rotate(180deg);
		}

		.rotate3 {
			transform: rotate(90deg);
		}

		.rotate4 {
			transform: rotate(270deg);
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
