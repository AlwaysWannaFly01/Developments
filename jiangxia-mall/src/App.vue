<template>
	<div id="app">
		<router-view/>
<!--		<TabBar></TabBar>-->
	</div>
</template>

<script>
import TabBar from "./components/TabBar";

export default {
	name: "App",
	components: {
		TabBar
	}
};
document.addEventListener("DOMContentLoaded", () => {
	const html = document.querySelector("html");
	let fontSize = window.innerWidth / 10;
	fontSize = fontSize > 50 ? 50 : fontSize;
	html.style.fontSize = fontSize + "px";
});
</script>

<style lang="scss">
	#app{
		padding-bottom: 50px;
	}
</style>
