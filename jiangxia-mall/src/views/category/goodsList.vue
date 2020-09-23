<template>
	<div>
		goodsList
	</div>
</template>

<script>
import _ from "lodash";
import {Request} from "@/api/index";

export default {
	name: "goodsList",
	data() {
		return {}
	},
	beforeMount() {
		// console.log(this.$route.query)
		this.searchValue = this.$route.query.searchValue;
		this.init(this.searchValue);
	},

	methods: {
		async init(param) {
			const result = await this.search(param);
			console.log(result)
		},
		search(param) {
			return new Promise((resolve, reject) => {
				Request("jxyx", "weapp/goods/goodslistbycondition", "post", {
					keyword:param
				}).then(res => {
					// console.log(res)
					if(res.status === 1){
						resolve(res)
					}
				}).catch(err => {
					console.log(err)
					reject(err)
				})
			})
		}
	}
}
</script>

<style lang="scss">

</style>
