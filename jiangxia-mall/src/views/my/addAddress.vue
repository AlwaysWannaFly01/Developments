<template>
	<div>
		<Address :childData="data"></Address>
	</div>
</template>

<script>
import Address from '@/components/Address';

export default {
	name: "addAddress",
	components: {
		Address
	},
	data() {
		return {
			data: null
		}
	},
	beforeMount() {
		console.log(this.$route.query.data)
		this.data = this.$route.query.data
	},
	mounted() {
		console.log(this.data)
	}
}
</script>

<style scoped>

</style>
