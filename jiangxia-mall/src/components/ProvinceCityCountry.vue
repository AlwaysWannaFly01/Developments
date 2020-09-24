<template>
	<div>
		<van-field label="所在地区" placeholder="选择城市" :value="value" readonly clickable
				   @click="showPicker = true"/>
		<van-popup v-model="showPicker" position="bottom">
			<van-picker
				show-toolbar
				:columns="columns"
				@cancel="showPicker = false"
				@confirm="onConfirm"
				@change="onChange"
			/>
		</van-popup>
	</div>
</template>

<script>
import Vue from "vue";
import {Field, Cell, CellGroup, Popup, Picker} from "vant";

Vue.use(Cell).use(Field).use(CellGroup).use(Popup).use(Picker);
import _ from 'lodash';
import {Request} from "@/api/index";


export default {
	name: "ProvinceCityCountry",
	data() {
		return {
			value: '',
			showPicker: false,
			columns: [
				{
					text: '浙江',
					children: [
						{
							text: '杭州',
							children: [
								{text: '西湖区'},
								{text: '余杭区'}
							],
						},
						{
							text: '温州',
							children: [
								{text: '鹿城区'},
								{text: '瓯海区'}
							],
						},
					],
					areaId: 31
				},
				{
					text: '福建',
					children: [
						{
							text: '福州',
							children: [{text: '鼓楼区'}, {text: '台江区'}],
						},
						{
							text: '厦门',
							children: [{text: '思明区'}, {text: '海沧区'}],
						},
					],
				},
			],
			// Data:[]
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
			console.log('所有省份:', AllProvince);
			this.mapCityData()
		},
		async mapCityData() {
			console.log('Start');
			const promise = this.AllProvince.map(async item => {
				const cityRes = await this.getProvinceCityCounty(item.areaId);
				return cityRes;
			})
			const AllCity = await Promise.all(promise);
			this.AllCity = AllCity;

			let ProvinceCity = []

			if (this.AllCity && this.AllCity.length > 0) {
				console.log(this.AllCity)

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
							// console.log(subItem)
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
						// console.log('全部为真')
						// console.log(this.ProvinceCity);
						this.checkCountryData(this.ProvinceCity);
					}
					// this.mapCountryData();
				}


			}
		},
		async checkCountryData(param) {
			// console.log(param)
			let countryData = [];

			// param.map(async (item, index) => {
				// console.log(item)
				// let countryRes = await this.mapCountryData(item.children);
				// console.log(countryRes)
			// })

			param[28].children.map(async item=>{
				const res = await this.mapCountryData(item);
				console.log(res)
			})

		},
		async mapCountryData(param) {
			// console.log(param)
			// const promise = param.map(async item => {
				const countryRes = await this.getProvinceCityCounty(param.areaId);
				console.log(countryRes);
				// return countryRes;
			// })
			// const thisCityCountry = await Promise.all(promise);
			// console.log(thisCityCountry)
		},

		getProvinceCityCounty(param = 0) {
			return new Promise((resolve, reject) => {
				Request("main", "weapp/users/listQuery", "post", {
					parentId: param,
				}).then(res => {
					if (res.status === 1) {
						resolve(res.data)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		},
		onConfirm(value) {
			console.log(value)
			this.value = value.join(',');
			this.showPicker = false;
		},
		onChange(picker, values) {
			// 	// console.log('picker:',picker)
			// 	console.log('values:',values)
			// 	picker.setColumnValues(1, cities[values[0]]);
			// 	picker.setColumnValues(2, cities[values[0]]);
		},
	}
}
</script>

<style lang="scss">

</style>
