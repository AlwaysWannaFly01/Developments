<template>
  <div class="ebook">
    <div class="read-wrapper">
      <div id="read"></div>
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
    }
  }
};
</script>
<style lang='scss' scoped>
@import "assets/styles/global";
</style>
