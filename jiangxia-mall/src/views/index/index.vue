<template>
    <div class="page-index">
        <img src="../../assets/images/bg/banner.png" class="banner" />
        <div class="content">
            <img src="../../assets/images/bg/home-zhanwei.png" class="home-zhanwei" />
            <img src="../../assets/images/jx/play.png" class="play" />
        </div>
        <div class="category">
            <van-row type="flex" justify="space-between">
                <van-col span="4" v-for="(item,index) in category" :key="index">
                    <img :src="item.catImg" />
                    <span>{{ item.catName }}</span>
                </van-col>
            </van-row>
        </div>
        <div class="new">
            <div class="top">
                <div class="title">
                    <van-tag color="rgb(122, 187, 86)">NEW</van-tag>
                    <span class="strong">最新上架</span>
                </div>
                <div class="more">
                    <span>查看更多</span>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="_swiper">
                <van-swipe :loop="false" :width="115" :show-indicators="false">
                    <van-swipe-item v-for="(item,index) in newGoodsList" :key="index">
                        <div>
                            <img :src="item.goodsImg" />
                            <van-button
                                color="linear-gradient(to right, #7abb56, #F4F4F4)"
                            >{{`已抢${item.visitNum}`}}</van-button>
                        </div>
                        <p>
                            <span class="price">￥{{item.shopPrice}}</span>
                            <del v-if="item.marketPrice > item.shopPrice">{{item.marketPrice}}</del>
                        </p>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <div class="container">
            <van-tabs v-model="active" line-height="0" @click="onClick">
                <van-tab v-for="(item,index) in switchList" :key="index" :title="item.value">
                    <template #title>
                        <van-icon name="more-o" />
                        {{item.name}}
                    </template>
                    <div class="block">
                        <ul>
                            <li v-for="(subItem,subIndex) in item.list" :key="subIndex">
                                <img :src="subItem.goodsImg" />
                                <h4>{{subItem.goodsName}}</h4>
                                <p>
                                    <span class="price">￥{{subItem.shopPrice}}</span>
                                    <del
                                        v-if="subItem.marketPrice > subItem.shopPrice"
                                    >{{subItem.marketPrice}}</del>
                                </p>
                            </li>
                        </ul>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import {
    Col,
    Row,
    Cell,
    CellGroup,
    Tag,
    Icon,
    Swipe,
    SwipeItem,
    Button,
    Tab,
    Tabs,
} from "vant";

Vue.use(Col)
    .use(Row)
    .use(Cell)
    .use(CellGroup)
    .use(Tag)
    .use(Icon)
    .use(Swipe)
    .use(SwipeItem)
    .use(Button)
    .use(Tab)
    .use(Tabs);

import _ from "lodash";
import { Request } from "@/api/index";

export default {
    data() {
        return {
            category: [],
            newGoodsList: [],
            active: 0,
            switchList: [
                {
                    name: "推荐好品",
                    value: "recom",
                },
                {
                    name: "热销排行",
                    value: "hot",
                },
            ],
            recomGoodsList: [],
        };
    },
    components: {},
    mounted() {
        this.init();
    },
    methods: {
        init() {
            Request("main", "weapp/articles/homePageCat").then((res) => {
                // console.log(res);
                if (res.status === 1) {
                    res.data.map((item) => {
                        if (_.startsWith(item.catImg, "http")) {
                            return;
                        } else {
                            item.catImg =
                                "http://youyoujiang.com/" + item.catImg;
                        }
                    });
                    // console.log(res.data)
                    this.category = res.data;
                }
            });

            // Request("jxyx", "weapp/articles/getarticlecats").then((res) => {
            //     console.log(res);
            // });

            this.getGoods("new")
                .then((res) => {
                    if (res.status === 1) {
                        res.data.map((item) => {
                            if (_.startsWith(item.catImg, "http")) {
                                return;
                            } else {
                                item.catImg =
                                    "http://youyoujiang.com/" + item.catImg;
                            }
                        });

                        this.newGoodsList = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            this.getGoods("recom")
                .then((res) => {
                    console.log(res);
                    if (res.status === 1) {
                        res.data.map((item) => {
                            if (_.startsWith(item.goodsImg, "http")) {
                                return;
                            } else {
                                item.goodsImg =
                                    "http://youyoujiang.com/" + item.goodsImg;
                            }
                        });
                        console.log(res.data);
                        this.switchList[0]["list"] = res.data;
                        this.$forceUpdate();

                        // console.log(this.switchList);
                        // this.recomGoodsList = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getGoods(param) {
            return Request("jxyx", "weapp/goods/getgoodslist", "post", {
                type: param,
                num: 5,
            });
        },

        onClick(name, title) {
            console.log(name, title);
            this.getGoods(title)
                .then((res) => {
                    if (res.status === 1) {
                        res.data.map((item) => {
                            if (_.startsWith(item.catImg, "http")) {
                                return;
                            } else {
                                item.catImg =
                                    "http://youyoujiang.com/" + item.catImg;
                            }
                        });
                        this.switchList[name]["list"] = res.data;
                        this.$forceUpdate();
                        // console.log(this.switchList);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

.page-index {
    position: relative;

    img {
        &.banner {
            width: 100%;
        }
    }

    .content {
        position: absolute;
        top: px2rem(153);
        left: 50%;
        transform: translateX(-50%);
        width: px2rem(345);
        height: px2rem(194);
        z-index: 1;

        .home-zhanwei {
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

    .category {
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        height: px2rem(105);
        margin-top: px2rem(148);

        .van-row {
            height: px2rem(105);
            padding: px2rem(26) 0 px2rem(16);
            box-sizing: border-box;

            .van-col {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
                align-items: center;

                img {
                    width: px2rem(46);
                    height: px2rem(46);
                    margin-bottom: px2rem(4);
                }

                span {
                    font-size: 12px;
                    text-align: center;
                    font-family: PingFangSC-Medium;
                }
            }
        }
    }

    .new {
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        //align-items: center;

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                display: flex;
                align-items: center;
                .van-tag {
                    font-size: 10px;
                }
                span {
                    &.strong {
                        font-weight: 800;
                        font-size: 16px;
                        margin-left: px2rem(4);
                    }
                }
            }

            .more {
                color: #a1a1a1;
                display: flex;
                align-items: center;
            }
        }

        ._swiper {
            margin-top: px2rem(10);
            .van-swipe {
                .van-swipe-item {
                    box-sizing: border-box;
                    padding-right: 15px;
                    div {
                        position: relative;
                        margin-bottom: px2rem(6);
                        .van-button {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100px;
                            height: 14px;
                            .van-button__content {
                                justify-content: flex-start;
                                padding-left: 3px;
                            }
                            .van-button__text {
                                font-size: 12px;
                            }
                        }
                    }

                    img {
                        width: 100px;
                        height: 100px;
                        border-radius: 5px;
                    }
                    p {
                        .price {
                            color: #7abb56;
                            font-weight: 600;
                        }
                        del {
                            color: #a1a1a1;
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        .custom-title {
            margin-right: 4px;
            vertical-align: middle;
        }

        .search-icon {
            font-size: 16px;
            line-height: inherit;
        }
    }
    .container {
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
		margin-top: px2rem(15);
        .van-tabs {
            .van-tabs__wrap {
                .van-tabs__nav {
                    .van-tab {
                        .van-icon {
                            &::before {
                                content: "";
                                width: 20px;
                                height: 20px;
                                background-image: url("../../assets/images/jx/head-select-no.png");
                                background-size: 20px;
                            }
                        }
                        &.van-tab--active {
                            color: #7abb56;
                            .van-icon {
                                &::before {
                                    background-image: url("../../assets/images/jx/head-select.png");
                                }
                            }
                        }
                        .van-tab__text {
                            display: flex;
                        }
                    }
                }
            }
            .van-tabs__content {
                .van-tab__pane {
                    .block {
                        ul {
                            display: flex;
                            flex-wrap: wrap;
                            li {
                                margin-right: 4%;
                                width: 48%;
                                &:nth-child(2n) {
                                    margin-right: px2rem(0);
                                }
                                img {
                                    width: px2rem(165);
                                    height: px2rem(165);
                                }
                                h4 {
                                    font-size: 16px;
                                    font-weight: 400;
									margin-bottom: px2rem(6);
                                }
                                p {
                                    font-size: 14px;
                                    .price {
                                        color: #7abb56;
                                        font-weight: 600;
                                    }
                                    del {
                                        color: #a1a1a1;
                                        font-size: 12px;
                                    }
									margin-bottom: px2rem(6);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

