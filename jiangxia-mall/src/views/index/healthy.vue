<template>
    <div class="page-healthy">
        <Article :articleData="articleData" v-if="articleData"></Article>
    </div>
</template>

<script>
import Article from "@/components/Article";
import { Request } from "@/api/index";
export default {
    data() {
        return {
            articleData: null,
        };
    },
    components: {
        Article,
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            Request("jxyx", "weapp/articles/getarticlecats", "post").then(
                (res) => {
                    if (res.status === 1) {
						this.articleData = res.data[2];
                    }
                }
            );
        },
    },
};
</script>
<style lang="scss">
</style>
