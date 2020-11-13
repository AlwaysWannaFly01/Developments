<template>
	<div class="page-address">
		<van-cell-group>
			<van-field v-model="name" label="姓名" placeholder="请输入姓名"/>
			<van-field v-model="tel" type="tel" label="联系电话" placeholder="请输入联系电话"/>
			<van-field label="所在地区" placeholder="省, 市, 区" :value="value" readonly
					   right-icon="location-o" @click="showPickerPop"/>

			<van-field v-model="address" label="详细地址" placeholder="请输入详细地址"/>
		</van-cell-group>
		<!--		<div class="line"></div>-->
		<section>
			<van-checkbox v-model="checked" checked-color="#7abb56">设置为默认地址</van-checkbox>
		</section>
		<van-button type="primary" size="large" color="#7abb56">立即保存</van-button>
		<van-popup v-model="showPicker" position="bottom">
			<van-picker
				show-toolbar
				:columns="provinceCityCountry"
				@cancel="showPicker = false"
				@confirm="onConfirm"
				@change="onChange"
			/>
		</van-popup>
	</div>
</template>

<script>
import Vue from 'vue';
import {Form, Field, Popup, Checkbox, Picker} from 'vant';

Vue.use(Form).use(Field).use(Popup).use(Checkbox).use(Picker);
import _ from "lodash";
import {Request} from "@/api/index";

export default {
	name: "Address",
	props: [
		"childData"
	],
	data() {
		return {
			name: '',
			tel: '',
			address: '',
			value: '',
			showPicker: false,
			checked: true,
			provinceCityCountry: []
		}
	},
	mounted() {
		// this.init()
		// console.log(this.childData)
		this.provinceCityCountry = JSON.parse(localStorage.getItem('localProvinceCityCountry'));
	},
	methods: {
		async init() {

		},
		showPickerPop() {
			this.showPicker = true;
		},
		onConfirm(value, index) {
			console.log(value);
			console.log(index);
			const {provinceCityCountry} = this;
			const areaId = provinceCityCountry[index[0]].children[index[1]].children[index[2]].areaId
			this.value = value.join(', ');
			this.showPicker = false;
		},
		onChange(picker, values) {
		},
	}
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-address {
	background-color: rgba(242, 244, 243, .5);
	height: 100vh;
	box-sizing: border-box;

	.line {
		width: 100%;
		height: px2rem(10);
		background-color: rgba(235, 237, 240, .5);
	}

	section {
		height: 44px;
		margin-top: px2rem(10);
		padding-left: px2rem(15);
		background-color: #fff;

		.van-checkbox {
			height: 44px;

			.van-checkbox__label {
				font-size: 14px;
			}
		}
	}

	.van-button {
		height: 40px;
		border-radius: 20px;
		margin: px2rem(20) px2rem(10) 0;
		width: px2rem(355);
	}
}
</style>
