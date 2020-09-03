<template>
  <div class="login">
    <div class="main">
      <img src="../assets/images/kuang.png" class="kuang" />
      <img src="../assets/images/logo.png" class="logo" />
      <img src="../assets/images/logo-word.png" class="logo-word" />

      <div class="form-main">
        <van-form @submit="onSubmit" label-width="10" validate-first :show-error-message="false">
          <van-field
            v-model="username"
            name="用户名"
            label="*"
            placeholder="请输入用户名"
            :rules="[{ required: true,message: '请输入用户名'}]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="*"
            placeholder="请输入密码"
            :rules="[{ required: true,message: '请输入密码'}]"
          />
          <van-field
            v-model="sms"
            clearable
            label="*"
            placeholder="请输入验证码"
            :rules="[{ required: true,message: '请输入验证码'}]"
          >
            <template #button>
              <van-button size="small" type="primary">发送验证码</van-button>
            </template>
          </van-field>
          <div class="btn">
            <van-button round block native-type="submit" class="submit-btn">登录</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Button, Form, Field } from "vant";

Vue.use(Button).use(Field).use(Form);

export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      sms: "",
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
  },
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
      .van-form {
        .van-cell {
          line-height: 28px;
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
      }
    }
  }
}
</style>
