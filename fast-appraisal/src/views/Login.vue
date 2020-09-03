<template>
    <div class="login">
        <div class="main">
            <img src="../assets/images/kuang.png" class="kuang" />
            <img src="../assets/images/logo.png" class="logo" />
			<img src="../assets/images/logo-word.png" class="logo-word">
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Button } from "vant";

Vue.use(Button);
export default {
    name: "Login",
};
</script>

<style lang="scss">
@import "../assets/styles/global.scss";
.login {
    background-image: url("../assets/images/login-bg.jpg");
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;
    position: relative;
    .main {
        width: 70%;
        height: px2rem(445);
        // background-color: darkorange;
        position: relative;
        top: 50%;
        left: 15%;
        transform: translate(0, -50%);
        text-align: center;
        .kuang {
            width: px2rem(265);
			margin-top: px2rem(-40);
			position: absolute;
			top:0;
			left:0;
        }
        .logo {
			width: px2rem(53);
			margin-top: px2rem(-20);
			position: absolute;
			top:0;
			left:50%;
			transform: translateX(-50%);
		}
		.logo-word{
			width: px2rem(66);
			margin-top: px2rem(60);
			position: relative;
			z-index: 2;
		}
    }
}
</style>
