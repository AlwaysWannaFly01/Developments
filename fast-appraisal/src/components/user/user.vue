<template>
	<div class="panel">
		<img src="../../assets/images/menu.png" class="menu">
		<div class="info">
			<img src="../../assets/images/photo.png">
			<p>
				<strong>用户名:李木子</strong>
			</p>
		</div>
	</div>
</template>
<script>
export default {
	name: "user",
	components: {

	},
	data() {
		return {}
	}
};
</script>
<style lang="scss">
@import "../../assets/styles/global";
.panel{
	width: 100%;
	height: px2rem(104);
	box-sizing: border-box;
	padding: px2rem(10) px2rem(14);
	display: flex;
	flex-direction: column;
	background-image: url("../../assets/images/list-bg.png");
	background-size: 100%;
	//position: fixed;
	//margin:px2rem(14) px2rem(10);
	.menu{
		width: px2rem(17);
	}
	.info{
		@include center;
		img{
			width: px2rem(51);
			margin-right: px2rem(16);
		}
		p{
			font-size: 16px;
		}
	}
}
</style>
