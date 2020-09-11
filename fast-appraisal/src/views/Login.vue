<template>
	<div class="login">
		<div class="main">
			<img src="../assets/images/kuang.png" class="kuang"/>
			<img src="../assets/images/logo.png" class="logo"/>
			<img src="../assets/images/logo-word.png" class="logo-word"/>

			<div class="form-main">
				<van-form
					@submit="onSubmit"
					label-width="10"
					validate-first
					:show-error-message="false"
				>
					<van-field
						v-model="username"
						name="UserName"
						left-icon="circle"
						placeholder="请输入用户名"
						:rules="[{ required: true,message: '请输入用户名'}]"
					/>
					<van-field
						v-model="password"
						type="password"
						name="Password"
						left-icon="circle"
						placeholder="请输入密码"
						:rules="[{ required: true,message: '请输入密码'}]"
						autocomplete
					></van-field>
					<van-field
						v-model="code"
						name="Code"
						left-icon="circle"
						clearable
						placeholder="请输入验证码"
						:rules="[{ required: true,message: '请输入验证码'}]"
						class="send"
					>
						<template #button>
							<img :src="img" @click="changeCode">
						</template>
					</van-field>
					<div class="btn">
						<van-button round block native-type="submit" class="submit-btn" :loading="loginLoading"
									loading-size="18" loading-text="登录">登录
						</van-button>
					</div>
				</van-form>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import {Button, Form, Field} from "vant";

Vue.use(Button).use(Field).use(Form);

import {getCode, Request} from '@/api';
import HandleToast from '@/utils/toast';
export default {
	name: "Login",
	components: {},
	data() {
		return {
			username: "",
			password: "",
			code: "",
			img: '',
			loginLoading: false
		};
	},
	beforeMount() {
	},
	mounted() {
		this.getCode();
	},
	methods: {
		getCode() {
			getCode().then(response => {
				return 'data:image/png;base64,' + btoa(
					new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), '')
				)
			}).then(data => {
				this.img = data;
			})
		},
		changeCode() {
			this.code = '';
			this.getCode();
		},
		onSubmit(values) {
			const {UserName, Password, Code} = values;
			Request('/Account/Login', 'post', {
				UserName,
				Password,
				Code
			}).then(res => {
				// console.log(res)
				const {MsgContent, IsSuccess} = res
				if (IsSuccess === true) {
					this.loginLoading = true;
					setTimeout(() => {
						this.$router.replace({
							path: "/appraisal",
						});
					}, 1000)
				} else {
					HandleToast(MsgContent,'fail')
				}
			}).catch(err => {
				console.log(err)
			})
		},
	},
};
</script>

<style lang="scss">
@import "../assets/styles/global.scss";

.login {
	background-image: url("../assets/images/loginbg.jpg");
	background-size: 100% 100%;
	width: 100vw;
	height: 100vh;
	position: relative;

	.main {
		width: 70%;
		height: px2rem(445);
		position: relative;
		top: 50%;
		left: 15%;
		transform: translate(0, -50%);
		text-align: center;

		.kuang {
			width: px2rem(265);
			margin-top: px2rem(-40);
			position: absolute;
			top: 0;
			left: 0;
		}

		.logo {
			width: px2rem(53);
			margin-top: px2rem(-20);
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}

		.logo-word {
			width: px2rem(66);
			margin-top: px2rem(60);
			position: relative;
			z-index: 2;
		}

		.form-main {
			width: px2rem(236);
			margin-left: px2rem(15);
			margin-top: px2rem(20);

			.van-form {
				.van-cell {
					line-height: 28px;
					padding: 12px 16px;

					.van-field__left-icon {
						line-height: normal;

						.van-icon::before {
							content: '';
							width: 6px;
							height: 6px;
							background-color: #afafaf;
							border-radius: 3px;
						}
					}

					&::after {
						border-bottom: 1px solid #afafaf;
					}
				}

				.forget-block {
					display: flex;
					padding: 0 16px;
					justify-content: flex-end;

					.forget {
						border: none;
						height: 14px;
						color: #bfbfbf;
					}
				}

				.btn {
					margin: px2rem(35) px2rem(32) 0;

					.submit-btn {
						width: px2rem(170);
						height: px2rem(34);
						background-color: #3869f2;
						color: #fff;
					}
				}

				.send {
					.van-field__button {
						height: px2rem(26);

						img {
							width: px2rem(66);
							height: px2rem(26);
						}
					}
				}

				.van-field--error {
					.van-field__control::placeholder {
						color: #4a0daf !important;
					}

					.van-field__left-icon {
						.van-icon::before {
							background-color: #4a0daf;
						}
					}

					&::after {
						border-bottom: 1px solid #4a0daf;
					}
				}
			}
		}
	}
}
</style>
