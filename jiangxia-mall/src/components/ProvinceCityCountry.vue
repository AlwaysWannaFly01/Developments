<template>
	<div class="provincecitycountry">
		<van-field label="所在地区" placeholder="选择城市" :value="value" readonly
				   @click="showPickerPop"/>
		<van-popup v-model="showPicker" position="bottom">
			<van-picker
				show-toolbar
				:columns="ProvinceCity"
				@cancel="showPicker = false"
				@confirm="onConfirm"
				@change="onChange"
			/>
		</van-popup>
<!--		<van-divider />-->
	</div>
</template>

<script>
import Vue from "vue";
import {Field, Cell, CellGroup, Popup, Picker,Divider } from "vant";

Vue.use(Cell).use(Field).use(CellGroup).use(Popup).use(Picker).use(Divider);
import _ from 'lodash';
import {Request} from "@/api/index";
import HandleToast from '@/utils/toast';

export default {
	name: "ProvinceCityCountry",
	data() {
		return {
			value: '',
			showPicker: false,
			ProvinceCity: [],
			canClick: false
		}
	},
	mounted() {
		// this.$emit('func', 'add');
		this.init();
	},
	methods: {
		async init() {
			let AllProvince = await this.getProvinceCityCounty();
			this.AllProvince = AllProvince;
			// console.log('所有省份:', AllProvince);
			this.mapCityData()
		},
		async mapCityData() {
			// console.log('Start');
			const promise = this.AllProvince.map(async item => {
				const cityRes = await this.getProvinceCityCounty(item.areaId);
				return cityRes;
			})
			const AllCity = await Promise.all(promise);
			this.AllCity = AllCity;

			let ProvinceCity = []

			if (this.AllCity && this.AllCity.length > 0) {
				// console.log(this.AllCity)

				this.AllProvince.map((el, index) => {
					ProvinceCity.push({
						text: this.AllProvince[index].areaName,
						areaId: this.AllProvince[index].areaId,
						children: this.AllCity[index]
					})
				})
				// console.log(ProvinceCity)
				this.ProvinceCity = ProvinceCity;
				if (this.ProvinceCity && this.ProvinceCity.length > 0) {
					// console.log(this.ProvinceCity);
					let ProvinceCityCountry = [];
					this.ProvinceCity.map(item => {
						// console.log(item)
						item.children.map(subItem => {
							subItem['text'] = subItem.areaName;
						})
					})
					// console.log(this.ProvinceCity);
					let boolList = []
					this.ProvinceCity.map(item => {
						let result = item.children.every(subItem => {
							return subItem.text;
						})
						boolList.push(result);
					})
					if (boolList.every(item => item)) {
						this.checkCountryData(this.ProvinceCity);
					}
				}
			}
		},
		async checkCountryData(param) {
			console.log('开始')
			// console.log(param)
			const promise1 = param.map(async (item, index) => {
				// console.log(item)
				let countryRes = await this.mapCountryData(item);
				return countryRes;
			})

			const allCityCountry = await Promise.all(promise1);
			console.log('所有区县:', allCityCountry);
			// console.log('所有省份城市:', this.ProvinceCity)

			this.ProvinceCity.map((item, index) => {
				item.children.map((subItem, subIndex) => {
					subItem['children'] = allCityCountry[index][subIndex]
				})
			})
			console.log('所有省份城市:', this.ProvinceCity)
			let boolList = []
			this.ProvinceCity.map((item, index) => {
				let result = item.children.every(subItem => {
					if (index === 24) {
						return true;
					}
					return subItem.children.length > 0;
				})
				boolList.push(result);
			})
			console.log(boolList)
			if (boolList.every(item => item)) {
				this.canClick = true;
				// console.log(this.canClick)
			}

			console.log('结束')
		},
		async mapCountryData(param) {
			const promise = param.children.map(async item => {
				const res = await this.getProvinceCityCounty(item.areaId);
				// console.log(res);
				return res;
			})
			const thisCityCountry = await Promise.all(promise);
			return thisCityCountry;
		},
		getProvinceCityCounty(param = 0) {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/users/listQuery", "post", {
					parentId: param,
				}).then(res => {
					if (res.status === 1) {
						// console.log(res)
						res.data.map(item => {
							item['text'] = item.areaName
						})
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		},
		onConfirm(value, index) {
			console.log(value);
			console.log(index);
			const {ProvinceCity} = this;
			const areaId = ProvinceCity[index[0]].children[index[1]].children[index[2]].areaId
			console.log(areaId);
			this.$emit('func',areaId)
			this.value = value.join(',');
			this.showPicker = false;
		},
		onChange(picker, values) {
			// 	// console.log('picker:',picker)
			// 	console.log('values:',values)
			// 	picker.setColumnValues(1, cities[values[0]]);
			// 	picker.setColumnValues(2, cities[values[0]]);
		},
		showPickerPop() {
			// console.log(this.canClick);
			if (this.canClick) {
				this.showPicker = true
			}else{
				HandleToast('省市区正在加载中,请稍后')
			}
		}
	}
}
</script>

<style lang="scss">

</style>
