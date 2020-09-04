<template>
  <div class="page-list" :style="height">
    <div class="fixed-panel">
      <User></User>
    </div>
    <div class="fixed-search">
      <van-search v-model="value" placeholder="请输入地址" class="search" :clearable="false"></van-search>
    </div>
    <div class="list-container" :style="listHeight">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
        <div v-for="(item,index) in list" :key="index" :title="item.name" class="list-item">
          <div>
            <h3>{{item.name}}</h3>
            <p>{{item.address}}</p>
          </div>
          <aside>查看</aside>
        </div>
      </van-list>
    </div>

    <!-- <ul class="list-container">
      <li>
        <div>
          <h3>北京市</h3>
          <p>详细地址:详细地址详细地址详细地址详细地址</p>
        </div>
        <aside>查看</aside>
      </li>
    </ul>-->
  </div>
</template>
<script>
import User from "@/components/user/user";
import Vue from "vue";
import { Search, List, Cell } from "vant";

Vue.use(Search).use(List).use(Cell);

export default {
  name: "List",
  components: {
    User,
  },
  beforeMount() {
    this.height = {
      //   height: window.innerHeight + "px",
    };
    this.listHeight = {
      // height: (window.innerHeight)
      "min-height": "800px",
    };
  },
  mounted() {},
  data() {
    return {
      value: "",
      height: {},
      list: [
        // {
        //   name: "北京市",
        //   address: "详细地址详细地址详细地址详细地址详细地址详细地址",
        // },
      ],
      loading: false,
      finished: false,
    };
  },
  methods: {
    onSearch() {},
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          //   this.list.push(this.list.length + 1);
          this.list.push({
            name: "北京市" + i,
            address: "详细地址详细地址详细地址详细地址详细地址详细地址" + i,
          });
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 2000);
    },
  },
};
</script>
<style lang="scss">
@import "../assets/styles/global.scss";
.page-list {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #ebeef5;
  // background-color: #fff;

  .fixed-panel {
    position: fixed;
    width: px2rem(355);
    left: 0;
    z-index: 9;
    height: px2rem(104);
    // margin: px2rem(14) px2rem(10) px2rem(0);
    padding: px2rem(14) px2rem(10) px2rem(0);
    background-color: #ebeef5;
  }

  .fixed-search {
    position: fixed;
    top: px2rem(118);
    width: px2rem(355);
    left: 0;
    z-index: 9;
    height: px2rem(54);
    padding: px2rem(10) px2rem(10) px2rem(0);
    background-color: #ebeef5;

    .search {
      border-radius: px2rem(5) px2rem(5) 0 0;

      .van-search__content {
        .van-cell {
          flex-flow: row-reverse;
        }
      }
    }
  }

  .list-container {
    position: absolute;
    left: 0;
    top: px2rem(180);
    z-index: -1;
    width: px2rem(355);
    background-color: #ebeef5;

    // height: px2rem(485);
    // overflow-y: scroll;
    // display: flex;
    // flex-direction: column;
    padding: 0 px2rem(10);
	.van-list{
		background-color: #fff;
	}
    .van-cell {
      height: 120px;
    }
	.list-item {
      margin-bottom: px2rem(15);
      display: flex;
      height: px2rem(78);
      align-items: center;
      border-radius: px2rem(10);
      background-color: #f2f4f3;

      div {
        flex: 1;
        height: 100%;
        padding: px2rem(10) px2rem(10);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        h3 {
          font-size: 16px;
          font-weight: 700;
        }

        p {
          font-size: 14px;
          color: #666;
        }
      }

      aside {
        font-size: 14px;
        width: px2rem(60);
        height: 100%;
        line-height: px2rem(78);
        text-align: center;
        background-color: #19b1f0;
        color: #fff;
        border-radius: 0 px2rem(10) px2rem(10) 0;
      }
    }
    // padding: px2rem(10) px2rem(10) 0;
    // background-color: #fff;
    // li {
    //   margin-bottom: px2rem(15);
    //   display: flex;
    //   height: px2rem(78);
    //   align-items: center;
    //   border-radius: px2rem(10);
    //   background-color: #f2f4f3;

    //   div {
    //     flex: 1;
    //     height: 100%;
    //     padding: px2rem(10) px2rem(10);
    //     box-sizing: border-box;
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: space-around;

    //     h3 {
    //       font-size: 16px;
    //       font-weight: 700;
    //     }

    //     p {
    //       font-size: 14px;
    //       color: #666;
    //     }
    //   }

    //   aside {
    //     font-size: 14px;
    //     width: px2rem(60);
    //     height: 100%;
    //     line-height: px2rem(78);
    //     text-align: center;
    //     background-color: #19b1f0;
    //     color: #fff;
    //     border-radius: 0 px2rem(10) px2rem(10) 0;
    //   }
    // }
  }
}
</style>
