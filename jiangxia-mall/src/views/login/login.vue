<template>
	<div class="page-login">
		<van-tabs @click="onClick" line-height="0" :style="deviceHeight" v-model="activeName">
			<van-tab title="账号登录" name="login">
				<van-form @submit="onSubmit">
					<van-field
						v-model="loginUsername"
						name="用户名"
						placeholder="用户名"
					/>
					<van-field
						v-model="loginPassword"
						type="password"
						name="密码"
						placeholder="密码"
					/>
					<div class="btn-block">
						<van-button round block native-type="submit" color="#7abb56">
							登录
						</van-button>
					</div>
				</van-form>
				<p class="new" @click="toRegister">新用户<span>注册</span></p>
			</van-tab>
			<van-tab title="账号注册" name="register">
				<van-form @submit="onSubmit2">
					<van-field
						v-model="username"
						name="账号"
						placeholder="账号"
					/>
					<van-field
						v-model="password"
						type="password"
						name="密码"
						placeholder="密码"
					/>
					<van-field
						v-model="sms"
						center
						clearable
						placeholder="请输入验证码"
					>
						<template #button>
							<van-button size="small" type="primary" @click="sendCode">发送验证码</van-button>
						</template>
					</van-field>
					<div class="btn-block">
						<van-button round block native-type="submit" color="#7abb56">
							注册
						</van-button>
					</div>
				</van-form>
				<p class="new" @click="toLogin">已有账号<span>去登录</span></p>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import Vue from 'vue';
import {Tab, Tabs, Toast, Form, Field} from 'vant';

Vue.use(Tab).use(Tabs).use(Toast).use(Form).use(Field);
import _ from "lodash";
import {Request, getCode} from "@/api/index";

export default {
	name: "login",
	data() {
		return {
			activeName: 'login',
			loginUsername: '',
			username: '',
			loginPassword: '',
			password: '',
			sms: ''
		};
	},
	beforeMount() {
		this.deviceHeight = {
			height: window.innerHeight + "px",
		};
	},
	mounted() {
	},
	methods: {
		onClick(name, title) {
			// console.log(name)
			Toast(title);
		},
		onSubmit(values) {
			console.log('submit', values);
		},
		onSubmit2(values) {
			// console.log('submit', values);
		},
		toRegister() {
			this.activeName = 'register';
		},
		toLogin() {
			this.activeName = 'login';
		},
		sendCode() {
			getCode().then(response => {
				// console.log(response)
				// return 'data:image/png;base64,' + btoa(
				// 	new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), '')
				// )
			}).then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		}
	},
}
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-login {
	.van-tabs {
		.van-tabs__wrap {
			height: px2rem(60);
			padding-right: px2rem(40);
			padding-left: px2rem(40);

			.van-tab {
				line-height: px2rem(60);
				font-size: 16px;
				padding: 0;

				.van-tab__text {
					flex: 1;
					font-weight: 800;
					color: rgb(153, 153, 153);
					font-family: "Microsoft YaHei UI Light";
				}
			}

			.van-tab--active {
				.van-tab__text {
					font-size: 28px;
					font-weight: 800;
					color: #000;
				}
			}
		}

		.van-tabs__content {
			.van-form {
				.van-cell {
					padding: px2rem(16) px2rem(40);

					&::after {
						right: px2rem(40);
						left: px2rem(40);
					}
				}

				.btn-block {
					padding: px2rem(20) px2rem(40);
				}
			}

			p.new {
				font-size: 14px;
				text-align: right;
				padding: 0 px2rem(40);

				span {
					color: rgba(235, 73, 63, 1);
				}
			}
		}
	}
}
</style>
