<template>
	<van-tabbar v-model="active" @change="onChange" class="awy-tabbar">
		<van-tabbar-item icon="wap-home-o" to="/index" url="/index">首页</van-tabbar-item>
		<van-tabbar-item icon="apps-o" to="/category" url="/category">分类</van-tabbar-item>
		<van-tabbar-item icon="desktop-o" to="/live" url="/live">直播</van-tabbar-item>
		<van-tabbar-item icon="shopping-cart-o" to="/shop" url="/shop">购物车</van-tabbar-item>
		<van-tabbar-item icon="user-circle-o" to="/my" url="/my">我的</van-tabbar-item>
	</van-tabbar>
</template>

<script>
import Vue from "vue";
import {Tabbar, TabbarItem, Notify} from "vant";

Vue.use(Tabbar).use(TabbarItem).use(Notify);

export default {
	name: "TabBar",
	beforeMount() {
		console.log(this.$router.history.current.path)
		switch (this.$router.history.current.path) {
			case "/index":
				this.active = 0;
				break;
			case "/category":
				this.active = 1;
				break;
			case "/live":
				this.active = 2;
				break;
			case "/shop":
				this.active = 3;
				break;
			case "/my":
				this.active = 4;
				break;
		}
	},
	data() {
		return {
			active: 0,
		}
	},
	methods: {
		onChange(index) {
			// console.log(index)
			// Notify({type: 'primary', message: index});
		},
		changeByParent(param){
			// console.log(param)
			this.active = param
		}
	}
}
</script>

<style lang="scss">
.awy-tabbar {
	.van-tabbar-item {
		.van-icon {
			&::before {
				content: '';
				width: 24px;
				height: 23px;
				background-size: 24px auto;
			}
		}

		.van-icon-wap-home-o {
			&::before {
				background-image: url("../assets/images/1-001.png");
			}
		}

		.van-icon-apps-o {
			&::before {
				background-image: url("../assets/images/2-001.png");
			}
		}

		.van-icon-desktop-o {
			&::before {
				background-image: url("../assets/images/3-001.png");
			}
		}

		.van-icon-shopping-cart-o {
			&::before {
				background-image: url("../assets/images/4-001.png");
			}
		}

		.van-icon-user-circle-o {
			&::before {
				background-image: url("../assets/images/5-001.png");
			}
		}
	}

	.van-tabbar-item--active {
		.van-tabbar-item__text {
			color: rgb(122, 187, 86);
		}

		.van-icon-wap-home-o {
			&::before {
				background-image: url("../assets/images/1-002.png");
			}
		}

		.van-icon-apps-o {
			&::before {
				background-image: url("../assets/images/2-002.png");
			}
		}

		.van-icon-desktop-o {
			&::before {
				background-image: url("../assets/images/3-002.png");
			}
		}

		.van-icon-shopping-cart-o {
			&::before {
				background-image: url("../assets/images/4-002.png");
			}
		}

		.van-icon-user-circle-o {
			&::before {
				background-image: url("../assets/images/5-002.png");
			}
		}
	}

}
</style>
