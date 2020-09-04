<template>
	<div class="page-list">
		<User/>
	</div>

</template>

<script>
import User from "@/components/user/user";
export default {
	name: "History",
	components: {
		User,
	},
	data() {
		return {
		};
	},
	methods: {

	}
}
</script>

<style lang="scss">
@import "../assets/styles/global.scss";

.page-list {
	min-width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #ebeef5;
	padding: px2rem(14) px2rem(10);
}

</style>
