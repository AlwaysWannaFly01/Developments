<template>
  <div class="page-appraisal" :style="{height: height + 'px'}">
    <div class="appraisal-panel">
      <User />
    </div>
    <div class="center-panel">
      <van-cell value="请选择" icon="shop-o" class="province" value-class="_item">
        <template #title>
          <span class="custom-title">省份:</span>
          <span class="_request">*</span>
        </template>
        <!-- <template #right-icon>
          <span>请选择</span>
        </template>-->
        <span v-if="!selectProvince">请选择</span>
        <van-dropdown-menu>
          <van-dropdown-item v-model="selectProvince" :options="province" />
        </van-dropdown-menu>
        <img src="../assets/images/icon_triangle.png" />
      </van-cell>
      <van-cell icon="shop-o" class="city" value="请选择" value-class="_item">
        <template #title>
          <span class="custom-title">城市:</span>
          <span class="_request">*</span>
        </template>
        <van-dropdown-menu>
          <van-dropdown-item v-model="seleceCity" :options="city" />
        </van-dropdown-menu>
        <img src="../assets/images/icon_triangle.png" />
      </van-cell>
      <van-cell icon="shop-o" class="type" value="请选择" value-class="_item">
        <template #title>
          <span class="custom-title">评估类型:</span>
          <span class="_request">*</span>
        </template>
        <van-dropdown-menu>
          <van-dropdown-item v-model="selectType" :options="type" />
        </van-dropdown-menu>
        <img src="../assets/images/icon_triangle.png" />
      </van-cell>
      <van-cell title="领勘人" icon="shop-o" class="person" value="请选择" value-class="_item">
        <van-dropdown-menu>
          <van-dropdown-item v-model="selectPerson" :options="person" />
        </van-dropdown-menu>
        <img src="../assets/images/icon_triangle.png" />
      </van-cell>
      <van-cell title="联系电话" icon="shop-o" class="tel" value="请选择" value-class="_item">
        <van-dropdown-menu direction="down">
          <van-dropdown-item v-model="selectTel" :options="tel" />
        </van-dropdown-menu>
        <img src="../assets/images/icon_triangle.png" />
      </van-cell>
      <van-field
        v-model="value"
        label="文本"
        placeholder="请输入价格"
        input-align="right"
        left-icon="smile-o"
        class="price"
        type="number"
      ></van-field>
      <!-- <van-cell title="网签价格" icon="shop-o" class="price" value="请选择" value-class="_item"></van-cell> -->
      <van-cell icon="shop-o" class="company" value="请选择" value-class="_item">
        <template #title>
          <span class="custom-title">评估公司:</span>
          <span class="_request">*</span>
        </template>
        <van-dropdown-menu direction="up">
          <van-dropdown-item v-model="selectCompany" :options="company" />
        </van-dropdown-menu>
        <img src="../assets/images/icon_triangle.png" />
      </van-cell>
      <van-cell title="房本附件" icon="shop-o" class="accessory" value="请选择" value-class="_item"></van-cell>

      <van-cell title value value-class="_item" class="_empty"></van-cell>

      <van-cell-group>
        <van-field v-model="value" label="文本" placeholder="请输入用户名">
          <template #button>
            <van-dropdown-menu>
              <van-dropdown-item v-model="selectProvince" :options="province" />
            </van-dropdown-menu>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 挂载到 #app 节点下 -->
      <!-- <van-popup v-model="show" get-container="#app" /> -->

      <!-- 通过函数指定挂载位置 -->
      <!-- <van-popup v-model="show" :get-container="getContainer" /> -->

      <van-cell is-link @click="showPopup">展示弹出层</van-cell>
      <van-popup v-model="show" class="sss">
        <van-picker
          title="标题"
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="onCancel"
          @change="onChange"
        />
      </van-popup>
    </div>

    <div class="btn-panel">
      <van-button type="default" class="btn" @click="click">关闭</van-button>
    </div>
  </div>
</template>

<script>
import User from "@/components/user/user";
import Vue from "vue";
import {
  Overlay,
  DropdownMenu,
  DropdownItem,
  Picker,
  Toast,
  Dialog,
  Popup
} from "vant";

Vue.use(Overlay)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Picker)
  .use(Dialog)
  .use(Popup);
export default {
  name: "Appraisal",
  components: {
    User,
  },
  data() {
    return {
      show: false,
      province: [
        // { text: "请选择", value: '0' },
        { text: "新款商品", value: "1" },
        { text: "活动商品", value: "2" },
      ],
      selectProvince: "",
      city: [
        { text: "请选择", value: 0 },
        {
          text: "武汉",
          value: 1,
        },
        {
          text: "长沙",
          value: 2,
        },
      ],
      seleceCity: 0,
      type: [],
      selectType: "",
      person: [],
      selectPerson: "",
      company: [],
      selectCompany: "",
      tel: [],
      selectTel: "",

	  value: "",

	  columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
    };
  },
  beforeMount() {
    this.height = window.innerHeight;
  },
  methods: {
    getContainer() {
      //   return document.querySelector(".my-container");
    },
    showPopup() {
      this.show = true;
    },
    click() {
      this.show = true;
	},
	onConfirm(value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onChange(picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      Toast('取消');
    },
  },
};
</script>

<style lang="scss">
@import "../assets/styles/global.scss";

.page-appraisal {
  box-sizing: border-box;
  background-color: #ebeef5;
  display: flex;
  flex-direction: column;

  .appraisal-panel {
    padding: 13px 10px 10px;
    box-sizing: border-box;
  }

  .center-panel {
    overflow-y: auto;
    margin: 0 10px;
    flex: 1;
    background-color: #fff;
    border-radius: px2rem(5);
    .van-cell {
      &.province,
      &.city,
      &.type,
      &.person,
      &.tel,
      &.price,
      &.company,
      &.accessory {
        .van-cell__left-icon {
          background-size: 20px 20px;
          background-repeat: no-repeat;
          font-size: 20px;
          &::before {
            content: "";
          }
        }
        .van-field__left-icon {
          .van-icon {
            background-size: 20px 20px;
            background-repeat: no-repeat;
            font-size: 20px;
          }
        }
      }

      &.province {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_province.png");
        }
      }

      &.city {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_city.png");
        }
      }

      &.type {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_type.png");
        }
      }

      &.person {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_person.png");
        }
      }

      &.tel {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_tel.png");
        }
      }
      &.price {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_price.png");
        }
        .van-field__left-icon {
          .van-icon {
            background-image: url("../assets/images/icon_price.png");
            &::before {
              content: "";
            }
          }
        }
      }
      &.company {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_company.png");
        }
      }
      &.accessory {
        .van-cell__left-icon {
          background-image: url("../assets/images/icon_accessory.png");
        }
      }

      ._item {
        //text-align: right;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img {
          width: 12px;
          height: 11px;
        }
      }
      ._request {
        color: red;
      }
      .van-cell__title {
        color: #b8b8b8;
      }
      &._empty {
        padding: 0;
      }
    }
    .van-dropdown-item {
      left: 10px;
      right: 10px;
    }

    .van-cell {
      ._item {
        .van-dropdown-menu {
          // width: 100%;
          .van-dropdown-menu__bar {
            height: auto;
            box-shadow: 0 0 0 0 transparent;
            width: 100px;
            margin-left: -80px;
            .van-dropdown-menu__item {
              ::after {
                opacity: 0 !important;
              }
            }
          }

          .van-dropdown-item {
            margin-top: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ebedf0;
            border-top: 1px solid #ebedf0;
          }
        }
      }
      &._empty {
        padding: 0;
      }
    }
  }

  .btn-panel {
    padding: 0 10px;

    .btn {
      height: 44px;
      margin: 15px 0;
      width: 100%;
      background-color: transparent;
      background-image: url("../assets/images/list-bg.png");
      background-size: cover;
      border-radius: px2rem(20);
      color: #fff;
      border: none;
    }
  }
}
.sss {
  width: px2rem(350);
  height: px2rem(400);
}
</style>
