<template>
  <div class="ebook">
    <div class="title-wrapper">
      <div class="left">
        <span class="icon-arrow-left2 icon"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-cart icon"></span>
          <span class="icon-user icon"></span>
          <span class="icon-menu icon"></span>
        </div>
      </div>
    </div>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Epub from "epubjs";
const DOWNLOAD_URL = "/static/中国绘画史.epub";
export default {
  data() {
    return {};
  },
  mounted() {
    this.showEpub();
  },
  methods: {
    showEpub() {
      /* 生成book */
      this.book = new Epub(DOWNLOAD_URL);
      // console.log(this.book);
      /*  生成Renition ，通过Book.renderTo */
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
      });

      /* 通过Rendition.display渲染电子书 */
      this.rendition.display();
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import "assets/styles/global";
.ebook {
  position: relative;
  .read-wrapper {
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      display: flex;
      .left {
        flex: 0 0 px2rem(100);
        // background-color: salmon;
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 px2rem(100);
      }
    }
  }
  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(48);
    background-color: #fff;
    display: flex;
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
    .left {
      flex: 0 0 px2rem(60);
      @include center;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        // flex: 0 0 px2rem(80);
        @include center;
        .icon{
          margin: 0 px2rem(3);
        }
        .icon-cart{
          font-size: px2rem(18);
        }
      }
    }
  }
}
</style>
