<template>
	<div class="page-appraisal" :style="{height: height + 'px'}">
		<div class="appraisal-panel">
			<User/>
		</div>
		<div class="center-panel">
			<van-cell value="请选择" icon="shop-o" class="province" value-class="_item">
				<template #title>
					<span class="custom-title">省份:</span>
					<span class="_request">*</span>
				</template>
				<van-dropdown-menu>
					<van-dropdown-item v-model="value1" :options="option1"/>
				</van-dropdown-menu>
				<img src="../assets/images/icon_triangle.png">
			</van-cell>
			<van-cell icon="shop-o" class="city" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">城市:</span>
					<span class="_request">*</span>
				</template>
				<van-dropdown-menu>
					<van-dropdown-item v-model="value1" :options="option1"/>
				</van-dropdown-menu>
				<img src="../assets/images/icon_triangle.png">
			</van-cell>
			<van-cell icon="shop-o" class="type" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">评估类型:</span>
					<span class="_request">*</span>
				</template>
				<van-dropdown-menu>
					<van-dropdown-item v-model="value1" :options="option1"/>
				</van-dropdown-menu>
				<img src="../assets/images/icon_triangle.png">
			</van-cell>
			<van-cell title="领勘人" icon="shop-o" class="person" value="请选择" value-class="_item">
				<van-dropdown-menu>
					<van-dropdown-item v-model="value1" :options="option1"/>
				</van-dropdown-menu>
				<img src="../assets/images/icon_triangle.png">
			</van-cell>
			<van-cell title="联系电话" icon="shop-o" class="tel" value="请选择" value-class="_item">
				<van-dropdown-menu direction="down">
					<van-dropdown-item v-model="value1" :options="option1"/>
				</van-dropdown-menu>
				<img src="../assets/images/icon_triangle.png">
			</van-cell>
			<van-cell title="网签价格" icon="shop-o" class="price" value="请选择" value-class="_item"></van-cell>
			<van-cell icon="shop-o" class="company" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">评估公司:</span>
					<span class="_request">*</span>
				</template>
				<van-dropdown-menu direction="up">
					<van-dropdown-item v-model="value1" :options="option1"/>
				</van-dropdown-menu>
				<img src="../assets/images/icon_triangle.png">
			</van-cell>
			<van-cell title="房本附件" icon="shop-o" class="accessory" value="请选择" value-class="_item"></van-cell>

			<van-cell title="" value="" value-class="_item" class="_empty"></van-cell>

		</div>
		<div class="btn-panel">
			<van-button type="default" class="btn" >关闭</van-button>
		</div>
	</div>
</template>

<script>
import User from "@/components/user/user";
import Vue from 'vue';
import {Overlay, DropdownMenu, DropdownItem, Picker, Toast, Dialog} from 'vant';

Vue.use(Overlay).use(DropdownMenu).use(DropdownItem).use(Picker).use(Dialog);
export default {
	name: "Appraisal",
	components: {
		User,
	},
	data() {
		return {
			show: false,
			value1: 0,
			option1: [
				{text: '请选择', value: 0},
				{text: '新款商品', value: 1},
				{text: '活动商品', value: 2},
				{text: '全部商品', value: 3},
				{text: '默认排序', value: 4},
				{text: '好评排序', value: 5},
				{text: '销量排序', value: 6},
			],
		};
	},
	beforeMount() {
		this.height = window.innerHeight;
	},
	methods: {
	}
}
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
			&.province,
			&.city,
			&.type,
			&.person,
			&.tel,
			&.price,
			&.company,
			&.accessory,
			{
				.van-cell__left-icon{
					background-size: 20px 20px;
					background-repeat: no-repeat;
					font-size: 20px;
					&::before {
						content: '';
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
			}
			&.company {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_company.png");
				}
			}
			&.accessory {
				.van-cell__left-icon {
					background-image: url("../assets/images/icon_accessory.png");
				}
			}

			._item {
				//text-align: right;
				color: #999;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				img{
					width: 12px;
					height: 11px;
				}
			}
			._request{
				color: red;
			}
			.van-cell__title{
				color: #b8b8b8;

			}
			&._empty{
				padding: 0;
			}
		}
		.van-dropdown-item {
			left: 10px;
			right: 10px;
		}

		.van-cell {
			._item {
				.van-dropdown-menu {
					.van-dropdown-menu__bar {
						height: auto;
						box-shadow: 0 0 0 0 transparent;
						.van-dropdown-menu__item{
							::after{
								opacity: 0 !important;
							}

						}
					}

					.van-dropdown-item {
						margin-top: 10px;
						margin-bottom: 10px;
						border-bottom: 1px solid #ebedf0;
						border-top: 1px solid #ebedf0;
					}
				}

			}
			&._empty{
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
}
</style>
