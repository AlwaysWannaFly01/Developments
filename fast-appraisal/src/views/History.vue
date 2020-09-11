<template>
	<div class="page-history" :style="{height: height + 'px'}">
		<div class="history-panel">
			<User/>
		</div>
		<van-loading size="24px" vertical v-if="loading" class="center-panel loading">加载中...</van-loading>
		<div class="center-panel" v-else>
			<van-cell icon="shop-o" class="province" :value="province" value-class="_item">
				<template #title>
					<span class="custom-title">省份:</span>
					<!--					<span class="_request">*</span>-->
				</template>
			</van-cell>
			<van-cell icon="shop-o" class="city" :value="city" value-class="_item">
				<template #title>
					<span class="custom-title">城市:</span>
					<!--					<span class="_request">*</span>-->
				</template>
			</van-cell>
			<van-cell icon="shop-o" class="type" :value="appraisalType" value-class="_item">
				<template #title>
					<span class="custom-title">评估类型:</span>
					<!--					<span class="_request">*</span>-->
				</template>
			</van-cell>
			<van-cell title="领勘人:" icon="shop-o" class="person" :value="person" value-class="_item"></van-cell>
			<van-cell title="联系电话:" icon="shop-o" class="tel" :value="tel" value-class="_item"></van-cell>
			<van-cell title="网签价格:" icon="shop-o" class="price" :value="price" value-class="_item"></van-cell>
			<van-cell icon="shop-o" class="company" :value="company" value-class="_item">
				<template #title>
					<span class="custom-title">评估公司:</span>
					<!--					<span class="_request">*</span>-->
				</template>
			</van-cell>
			<van-cell title="房本附件:" icon="shop-o" class="accessory" value="请选择" value-class="_item"></van-cell>
			<van-divider/>
		</div>
		<div class="btn-panel">
			<van-button type="default" class="btn">关闭</van-button>
		</div>
	</div>

</template>

<script>
import User from "@/components/user/user";
import Vue from 'vue';
import {Button, Cell, CellGroup, Tag, Icon, Divider, Loading} from 'vant';

Vue.use(Button).use(Cell).use(CellGroup).use(Tag).use(Icon).use(Divider).use(Loading);
import {Request} from '@/api'

export default {
	name: "History",
	components: {
		User,
	},
	data() {
		return {
			loading: true,
			province: '',
			city: '',
			appraisalType: '',
			person: '',
			tel: '',
			price: '',
			company: '',
		};
	},
	beforeMount() {
		this.height = window.innerHeight;
		if (this.$route.params) {
			this.id = this.$route.params.id
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			if (this.id) {
				Request('/Home/GetEstimateFinance/', 'get', {id: this.id}).then(res => {
					console.log(res)
					if (res) {
						this.loading = false;
						this.province = res.HouseProvinceName;
						this.city = res.HouseCityName;
						this.appraisalType = res.PingGuLeiXing === 1 ? '预评' : '正式';
						this.person = res.LingKanRen;
						this.tel = res.ContactNumber;
						this.price = res.ExpectedEvaluationValue;
						this.company = res.AppraiseCompanyID;

					}
				}).catch(err => {
					console.log(err)
				})
			}
		},
	}
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
			&.accessory {
				.van-cell__left-icon {
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

			._request {
				color: red;
			}

			.van-cell__title {
				color: #b8b8b8;

			}

		}

		.van-divider {
			margin: 0 16px;
			border-color: transparent;
		}

		&.loading {
			padding-top: 20px;
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
