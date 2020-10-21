<template>
	<div id="app">
		<keep-alive>
			<router-view v-if='$route.meta.keepAlive'/>
		</keep-alive>
		<router-view v-if='!$route.meta.keepAlive'/>
	</div>
</template>

<script>
export default {
	name: "App"
};
document.addEventListener("DOMContentLoaded", () => {
	const html = document.querySelector("html");
	let fontSize = window.innerWidth / 10;
	fontSize = fontSize > 50 ? 50 : fontSize;
	html.style.fontSize = fontSize + "px";
});
</script>

<style lang="scss">
#app {
	padding-bottom: 50px;
}
</style>
