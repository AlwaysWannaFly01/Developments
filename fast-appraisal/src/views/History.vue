<template>
	<div class="page-history" :style="{height: height + 'px'}">
		<div class="history-panel">
			<User/>
		</div>
		<div class="center-panel">
			<van-cell value="请选择" icon="shop-o" class="province" value-class="_item">
				<template #title>
					<span class="custom-title">省份:</span>
					<span class="_request">*</span>
				</template>
			</van-cell>
			<van-cell icon="shop-o" class="city" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">城市:</span>
					<span class="_request">*</span>
				</template>
			</van-cell>
			<van-cell icon="shop-o" class="type" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">评估类型:</span>
					<span class="_request">*</span>
				</template>
			</van-cell>
			<van-cell title="领勘人" icon="shop-o" class="person" value="请选择" value-class="_item"></van-cell>
			<van-cell title="联系电话" icon="shop-o" class="tel" value="请选择" value-class="_item"></van-cell>
			<van-cell title="网签价格" icon="shop-o" class="price" value="请选择" value-class="_item"></van-cell>
			<van-cell icon="shop-o" class="company" value="请选择" value-class="_item">
				<template #title>
					<span class="custom-title">评估公司:</span>
					<span class="_request">*</span>
				</template>
			</van-cell>
			<van-cell title="房本附件" icon="shop-o" class="accessory" value="请选择" value-class="_item"></van-cell>
			<van-cell title="" value="" value-class="_item" class="_empty"></van-cell>
		</div>
		<div class="btn-panel">
			<van-button type="default" class="btn">关闭</van-button>
		</div>
	</div>

</template>

<script>
import User from "@/components/user/user";
import Vue from 'vue';
import {Button, Cell, CellGroup, Tag, Icon} from 'vant';

Vue.use(Button).use(Cell).use(CellGroup).use(Tag).use(Icon);

export default {
	name: "History",
	components: {
		User,
	},
	data() {
		return {};
	},
	beforeMount() {
		this.height = window.innerHeight;
		// this.centerHeight = window.innerHeight - 127-74

	},
	methods: {}
}
</script>

<style lang="scss">
@import "../assets/styles/global.scss";

.page-history {
	box-sizing: border-box;
	background-color: #ebeef5;
	display: flex;
	flex-direction: column;

	.history-panel {
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
				text-align: left;
				color: #999;
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
