<template>
    <div class="page-index">
        <h1>index</h1>

    </div>
</template>
<script>
import { Request } from "@/api/index";

export default {
    data() {
        return {};
    },
    components: {},
    mounted() {
        this.init();
    },
    methods: {
        init() {
            Request("main", "weapp/articles/homePageCat").then((res) => {
                console.log(res);
            });

            Request("jxyx", "weapp/articles/getarticlecats").then((res) => {
                console.log(res);
            });
        },
    },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
</style>

