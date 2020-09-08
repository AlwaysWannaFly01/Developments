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
					<span>{{ selectCity ? selectCity : '请选择' }}</span>
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
			<van-cell title="领勘人" icon="shop-o" class="person" value-class="_item">
				<div @click="showPopup('person')">
					<span>{{ selectPerson ? selectPerson : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-cell title="联系电话" icon="shop-o" class="tel" value-class="_item">
				<div @click="showPopup('tel')">
					<span>{{ selectTel ? selectTel : '请选择' }}</span>
					<img src="../assets/images/icon_triangle.png"/>
				</div>
			</van-cell>
			<van-field
				v-model="value"
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
					<span>{{ selectCompany ? selectCompany : '请选择' }}</span>
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
			<van-button type="default" class="btn">委托预评</van-button>
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

import {postData} from '@/api';

export default {
	name: "Appraisal",
	components: {
		User,
	},
	data() {
		return {
			show: false,
			selectProvince: "",
			selectCity: '',
			selectAppraisalType: "",
			selectPerson: "",
			selectCompany: "",
			selectTel: "",
			value: "",
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
			postData('/Home/BindCaadRegionDropdownListJson', {
				parentId: 0
			}).then(response => {
				console.log(response)
			})
		},
		showPopup(type) {
			console.log(type)
			this.show = true;
			switch (type) {
				case 'province':
					this.columns = ['湖北', '浙江', '湖南', '江西', '四川', '河北', '广西', '江苏'];
					this.selectedOption = 'province';
					break;
				case 'city':
					this.columns = ['武汉', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'];
					this.selectedOption = 'city';
					break;
				case 'appraisalType':
					this.columns = ['appraisalType1', 'appraisalType12'];
					this.selectedOption = 'appraisalType';
					break;
				case 'person':
					this.columns = ['person1', 'person2', 'person3'];
					this.selectedOption = 'person';
					break;
				case 'tel':
					this.columns = ['12312312323', '24434645', '233590', '8888', '354'];
					this.selectedOption = 'tel';
					break;
				case 'company':
					this.columns = ['阿里', '腾讯', '百度', '字节跳动'];
					this.selectedOption = 'company';
					break;
				default:
					break;

			}

		},
		click() {
			this.show = true;
		},
		onConfirm(value, index) {
			Toast(`当前值：${value}, 当前索引：${index}`);
			console.log(this.selectedOption)
			switch (this.selectedOption) {
				case "province":
					this.selectProvince = value;
					break;
				case 'city':
					this.selectCity = value;
					break;
				case 'appraisalType':
					this.selectAppraisalType = value;
					break;
				case 'person':
					this.selectPerson = value;
					break;
				case 'tel':
					this.selectTel = value;
					break;
				case 'company':
					this.selectCompany = value;
					break;
				default:
					break;
			}
			this.show = false;
		},
		onChange(picker, value, index) {
			Toast(`当前值：${value}, 当前索引：${index}`);
		},
		onCancel() {
			Toast('取消');
			this.show = false;
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
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_person.png");
				}
			}

			&.tel {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_tel.png");
				}
			}

			&.price {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_price.png");
				}

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
