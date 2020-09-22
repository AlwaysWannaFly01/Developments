<template>
    <div class="page-article">
        <img :src="articleData.backdropImg" class="banner" />
        <div class="content">
            <img
                src="../assets/images/bg/science-zhanwei.png"
                class="zhanwei"
                v-if="articleData.catName === '江夏科创'"
            />
            <img
                src="../assets/images/jx/play.png"
                class="play"
                v-if="articleData.catName === '江夏科创'"
            />
            <img
                src="../assets/images/bg/live_culture.png"
                v-else-if="articleData.catName === '江夏文旅'"
                class="zhanwei"
            />
            <img
                src="../assets/images/bg/home-zhanwei.png"
                v-else-if="articleData.catName === '江夏健康'"
                class="zhanwei"
            />
            <img
                src="../assets/images/jx/play.png"
                class="play"
                v-if="articleData.catName === '江夏健康'"
            />
        </div>
        <section>{{articleData.description}}</section>
        <van-divider />

        <div class="main-container">
            <div class="main">
                <div class="top">
                    <img src="../assets/images/jx/label_icon.png" />
                    <span>优质企业名录</span>
                    <img src="../assets/images/jx/label_icon.png" />
                </div>
                <ul>
                    <li v-for="(item,index) in articleData.articles" :key="index">
                        <a @click="clickItem(item)">{{item.articleTitle}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import { Divider } from "vant";

Vue.use(Divider);
import { Request } from "@/api/index";
export default {
    props: ["articleData"],
    data() {
        return {};
    },
    mounted() {
        // console.log(this.articleData);
    },
    methods: {
        clickItem(param) {
            // console.log(param);
            const { articleId } = param;
            this.$router.push({
                name: "CompanyDetail",
                query: {
                    articleId,
                },
            });
        },
    },
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
#app {
    padding-bottom: 0;
}
.page-article {
    .banner {
        width: 100%;
    }
    .content {
        position: absolute;
        top: px2rem(108);
        left: 50%;
        transform: translateX(-50%);
        width: px2rem(345);
        height: px2rem(194);
        z-index: 1;

        .zhanwei {
            width: px2rem(345);
            height: px2rem(194);
        }

        .play {
            position: absolute;
            z-index: 2;
            width: px2rem(47);
            height: px2rem(47);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    section {
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        margin-top: px2rem(165);
        font-size: 14px;
    }
    .van-divider {
        margin: px2rem(10) 0;
        &::before {
            border-width: px2rem(15) 0 0;
        }
    }
    .main-container {
        width: 100%;
        box-sizing: border-box;
        padding: 0 px2rem(15);
        margin-top: 15px;
        .main {
            text-align: center;
            .top {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: px2rem(10);
                img {
                    width: 20px;
                }
                span {
                    font-size: 14px;
                    margin: 0 8px;
                }
            }
            ul {
                padding-bottom: px2rem(15);
                li {
                    a {
                        font-size: 14px;
                        color: #999;
                        text-decoration: underline;
                    }

                    text-align: left;
                }
            }
        }
    }
}
</style>
