<template>
	<div class="page-login">
		<van-tabs line-height="0" :style="deviceHeight" v-model="activeName">
			<van-tab title="账号登录" name="login">
				<van-form @submit="onSubmit">
					<van-field
						v-model="loginUsername"
						name="loginUsername"
						placeholder="用户名"
					/>
					<van-field
						v-model="loginPassword"
						type="password"
						name="loginPassword"
						placeholder="密码"
					/>
					<van-field
						v-model="loginCode"
						center
						clearable
						placeholder="请输入验证码"
						class="code"
						name="loginCode"
					>
						<template #button>
							<img v-show="codeImg" :src="codeImg" @click="sendCode">
						</template>
					</van-field>
					<div class="btn-block">
						<van-button round block native-type="submit" color="#7abb56">
							登录
						</van-button>
					</div>
				</van-form>
				<p class="new" @click="toRegister">新用户<span>注册</span></p>
			</van-tab>
			<van-tab title="账号注册" name="register">
				<van-form @submit="onSubmitRegister">
					<van-field
						v-model="username"
						name="username"
						placeholder="用户名"
					/>
					<van-field
						v-model="password"
						type="password"
						name="password"
						placeholder="密码"
					/>
					<van-field
						v-model="code"
						center
						clearable
						placeholder="请输入验证码"
						class="code"
						name="code"
					>
						<template #button>
							<img v-show="codeImg" :src="codeImg" @click="sendCode">
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
import HandleToast from '@/utils/toast';

export default {
	name: "login",
	data() {
		return {
			activeName: 'login',
			loginUsername: '',
			loginPassword: '',
			loginCode: '',
			username: '',
			password: '',
			code: '',
			codeImg: '',
		};
	},
	beforeMount() {
		this.deviceHeight = {
			height: window.innerHeight + "px",
		};
	},
	mounted() {
		this.sendCode();
	},
	methods: {
		onSubmit(values) {
			// console.log('submit', values);
			const {loginUsername, loginPassword, loginCode} = values;
			if (!loginUsername) {
				HandleToast('用户名不能为空')
			} else if (!loginPassword) {
				HandleToast('密码不能为空')
			} else if (!loginCode) {
				HandleToast('验证码不能为空')
			} else {
				Request('main', 'weapp/users/login', 'post', {
					loginName: loginUsername,
					loginPwd: loginPassword,
					verifyCode: loginCode,
					loginType: 4
				}).then(res => {
					console.log(res)
					if (res.status == 1) {
						HandleToast(res.msg, 'success', 300);
						localStorage.setItem('userId', res.data.userId);
						setTimeout(() => {
							this.$router.replace({
								name: "Index",
							});
						}, 500)
					} else {
						HandleToast(res.msg);
						this.sendCode();
						this.loginCode = '';
					}
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onSubmitRegister(values) {
			// console.log('submit', values);
			const {username, password, code} = values
			if (!username) {
				HandleToast('用户名不能为空')
			} else if (!password) {
				HandleToast('密码不能为空')
			} else if (!code) {
				HandleToast('验证码不能为空')
			} else {
				Request('main', 'weapp/users/registbyaccount', 'post', {
					loginName: username,
					loginPwd: password,
					verifyCode: code
				}).then(res => {
					console.log(res)
					if (res.status === 1) {
						// HandleToast(res.msg, 'success');
						// localStorage.setItem('userId', res.data.userId);
						// setTimeout(() => {
						// 	this.$router.replace({
						// 		name: "Index",
						// 	});
						// }, 800)
						HandleToast('注册成功,请重新登录', 'success');
						this.sendCode();
						// this.activeName = 'login';
					} else {
						HandleToast(res.msg);
						this.sendCode();
						this.code = '';
					}
				}).catch(err => {
					console.log(err)
				})
			}

		},
		toRegister() {
			this.activeName = 'register';
		},
		toLogin() {
			this.activeName = 'login';
		},
		sendCode() {
			getCode().then(response => {
				return 'data:image/png;base64,' + btoa(
					new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), '')
				)
			}).then(data => {
				this.codeImg = data;
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
	background-color: #fff;
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

					.van-field__button {
						padding-left: 0px;
						box-sizing: border-box;
						width: px2rem(100);
						height: px2rem(31);
						margin-left: px2rem(8);
						img {
							width: px2rem(100);
							height: px2rem(31);
							vertical-align: middle;
						}
					}

					&.code {
						padding: px2rem(13) px2rem(40);
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
