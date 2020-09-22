<template>
	<div class="page-address">
		<van-cell-group>
			<van-field v-model="name" label="姓名" placeholder="请输入姓名"/>
			<van-field v-model="tel" type="tel" label="联系电话" placeholder="请输入联系电话"/>
			<van-field
				readonly
				clickable
				name="area"
				:value="value"
				label="地区选择"
				placeholder="点击选择省市区"
				@click="showArea = true"
			/>
			<van-field v-model="address" label="详细地址" placeholder="请输入详细地址"/>
		</van-cell-group>
<!--		<div class="line"></div>-->
		<section>
			<van-checkbox v-model="checked" checked-color="#7abb56">设置为默认地址</van-checkbox>
		</section>
		<van-button type="primary" size="large" color="#7abb56">立即保存</van-button>
		<van-popup v-model="showArea" position="bottom">
			<van-area
				:area-list="areaList"
				@confirm="onConfirm"
				@cancel="showArea = false"
			/>
		</van-popup>
	</div>
</template>

<script>
import Vue from 'vue';
import {Form, Field, Popup, Area,Checkbox } from 'vant';

Vue.use(Form).use(Field).use(Popup).use(Area).use(Checkbox);
import _ from "lodash";
import {Request} from "@/api/index";

export default {
	name: "Address",
	data() {
		return {
			name: '',
			tel: '',
			address: '',
			value: '',
			showArea: false,
			areaList: {
				province_list: {
					110000: '北京市',
					120000: '天津市'
				},
				city_list: {
					110100: '北京市',
					110200: '县',
					120100: '天津市',
					120200: '县'
				},
				county_list: {
					110101: '东城区',
					110102: '西城区',
					110105: '朝阳区',
					110106: '丰台区',
					120101: '和平区',
					120102: '河东区',
					120103: '河西区',
					120104: '南开区',
					120105: '河北区',
				}
			},
			checked: true,
		}
	},
	mounted() {
		// this.init()
	},
	methods: {
		async init() {
			let province = await this.getAddress(0);
			console.log(province)
			let provinceObj = {};
			let cityObj = {};
			let cityList = [];

			province.map(item => {
				// console.log(item)
				provinceObj[item.areaId] = item.areaName;
				this.getAddress(item.areaId).then(res => {
					// console.log(res)
					res.map(subItem => {
						cityObj[subItem.areaId] = subItem.areaName
					})
				})
			})
			// console.log(provinceObj)
			this.areaList['province_list'] = provinceObj;
			this.areaList['city_list'] = cityObj;
			console.log(cityObj)
			// if(cityList.length > 0){
			// 	console.log(cityList)
			// }

			// let city = await this.getAddress(24)

			// console.log(city)
		},
		getAddress(param) {
			return new Promise((resolve, reject) => {
				Request("jxyx", "weapp/users/listQuery", "post", {
					parentId: param
				}).then(res => {
					// console.log(res)
					if (res.status === 1) {
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		},

		onConfirm() {

		},
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
#app{
	padding-bottom: 0;
}
.page-address {
	background-color: rgba(242,244,243,.5);
	padding: px2rem(15);
	height: 100vh;
	box-sizing: border-box;
	.line{
		width: 100%;
		height: px2rem(10);
		background-color: rgba(235, 237, 240, .5);
	}
	section{
		height: 44px;
		margin-top: px2rem(10);
		padding-left: px2rem(15);
		background-color: #fff;
		.van-checkbox{
			height: 44px;
			.van-checkbox__label{
				font-size: 14px;
			}
		}
	}
	.van-button{
		margin-top: px2rem(20);
		height: 40px;
		border-radius: 20px;
	}
}
</style>
