<template>
    <div class="page-category">
        <van-tabs v-model="active" line-height="2" @click="onClick" color="#7abb56">
            <van-tab v-for="(item,index) in switchList" :key="index" :title="item.value">
                <template #title>{{ item.name }}</template>
            </van-tab>
        </van-tabs>
        <van-search v-model="value" placeholder="点击搜索商品名称" />
        <div class="img-block">
            <img src="../../assets/images/bg/live_farm.png" v-if="active===0" />
            <img src="../../assets/images/bg/live_oper.png" v-if="active===1" />
            <!--			<img src="../../assets/images/jx/play.png" class="play"/>-->
        </div>

        <div class="main-container" :style="mainHeight">
            <div v-if="active===1" class="main">
                <div class="top">
                    <img src="../../assets/images/jx/label_icon.png" />
                    <span>全部商品</span>
                    <img src="../../assets/images/jx/label_icon.png" />
                </div>
                <img src="../../assets/images/jx/zanwushuju.png" class="empty" />
                <p>暂无数据</p>
            </div>
            <div v-else class="main goods">
                <!-- 分类列表 -->
                <div class="menu-wrapper" ref="menuScroll">
                    <ul>
                        <!-- 专场 -->
                        <!-- <li
                            class="menu-item"
                            :class="{'current':currentIndex === 0}"
                            @click="selectMenu(0)"
                        >
                            <p class="text">
                                <img
                                    class="icon"
                                    :src="container.tag_icon"
                                    v-if="container.tag_icon"
                                />
                                {{container.tag_name}}
                            </p>
                        </li> -->

                        <li
                            class="menu-item"
                            :class="{'current':currentIndex === index + 1}"
                            v-for="(item,index) in goods"
                            :key="index"
                            @click="selectMenu(index+1)"
                        >
                            <p class="text">
                                <img class="icon" :src="item.icon" v-if="item.icon" />
                                {{item.name}}
                            </p>
                            <i
                                class="num"
                                v-show="calculateCount(item.spus)"
                            >{{calculateCount(item.spus)}}</i>
                        </li>
                    </ul>
                </div>
                <!-- 商品列表 -->
                <div class="foods-wrapper" ref="foodScroll">
                    <ul>
                        <!-- 专场 -->
                        <!-- <li class="container-list food-list-hook">
                            <div
                                v-for="(item,index) in container.operation_source_list"
                                :key="index"
                            >
                                <img :src="item.pic_url" />
                            </div>
                        </li> -->
                        <!-- 具体分类 -->
                        <li
                            v-for="(item,index) in goods"
                            :key="index"
                            class="food-list food-list-hook"
                        >
                            <h3 class="title">{{item.name}}</h3>

                            <!-- 具体的商品列表 -->
                            <ul>
                                <li
                                    v-for="(food,index) in item.spus"
                                    :key="index"
                                    @click="showDetail(food)"
                                    class="food-item"
                                >
                                    <div class="icon" :style="head_bg(food.picture)"></div>
                                    <div class="content">
                                        <h3 class="name">{{food.name}}</h3>
                                        <p class="desc" v-if="food.description">{{food.description}}</p>
                                        <div class="extra">
                                            <span class="saled">{{food.month_saled_content}}</span>
                                            <span class="praise">{{food.praise_content}}</span>
                                        </div>
                                        <img class="product" :src="food.product_label_picture" alt />
                                        <p class="price">
                                            <span class="text">${{food.min_price}}</span>
                                            <span class="unit">/{{food.unit}}</span>
                                        </p>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <!-- <app-cart-control :food="food"></app-cart-control> -->
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <TabBar></TabBar>
    </div>
</template>
<script>
import Vue from "vue";
import { Icon, Swipe, SwipeItem, Search } from "vant";

Vue.use(Icon).use(Swipe).use(SwipeItem).use(Search);
import TabBar from "../../components/TabBar";
import BScroll from "better-scroll";
import Data from "../../assets/data/goods.json";
export default {
    data() {
        return {
            active: 0,
            switchList: [
                {
                    name: "江夏惠农",
                    value: "preferential",
                },
                {
                    name: "江夏制造",
                    value: "manufacture",
                },
            ],
            value: "",
            container: {},
            goods: [],
			poiInfo: {},
			listHeight: [],
            menuScroll: {},
            foodScroll: {},
            scrollY: 0,
            selectFood: {},
        };
    },
    components: {
        TabBar,
    },
    beforeMount() {
        // console.log(this.$route.params)
        if (this.$route.params.active) {
            this.active = this.$route.params.active;
        }

        this.deviceHeight = window.innerHeight;
        // console.log(this.deviceHeight);

        this.mainHeight = {
            height: window.innerHeight - 32 - 59 - 170 - 50 + "px",
        };
    },
    mounted() {},
    created() {
        console.log(Data);
        this.container = Data.data.container_operation_source;
        this.goods = Data.data.food_spu_tags;
        this.poiInfo = Data.data.poi_info;

        // DOM已经更新
        this.$nextTick(() => {
            // 执行滚动方法
            this.initScroll();

            // 计算分类的区间高度
            this.calculateHeight();
            // 监听滚动的位置
            // 根据滚动位置确认下标,与左侧对应
            // 通过下标实现点击左侧,滚动右侧
        });
	},
	computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                // 获取商品区间的范围
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];

                // 是否在上述区间中
                if (
                    !height2 ||
                    (this.scrollY >= height1 && this.scrollY < height2)
                ) {
                    // console.log(i)
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            this.goods.forEach((myfoods) => {
                myfoods.spus.forEach((food) => {
                    if (food.count > 0) {
                        foods.push(food);
                    }
                });
            });

            return foods;
        },
    },
    methods: {
        onClick(name, title) {
            // console.log(name, title);
            // console.log(this.active)
        },
        head_bg(imgName) {
            return "background-image: url(" + imgName + ");";
        },
        initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuScroll, {
                click: true,
            });
            this.foodScroll = new BScroll(this.$refs.foodScroll, {
                probeType: 3,
                click: true,
            });

            // foodScroll 监听事件
            this.foodScroll.on("scroll", (pos) => {
                // console.log(pos.y)
                this.scrollY = Math.abs(Math.round(pos.y));
                // console.log(this.scrollY)
            });
        },
        calculateHeight() {
            // 获取元素
            let foodlist = this.$refs.foodScroll.getElementsByClassName(
                "food-list-hook"
            );
            // console.log(foodlist)

            let height = 0;
            this.listHeight.push(height);

            for (let i = 0; i < foodlist.length; i++) {
                let item = foodlist[i];
                // 累加
                height += item.clientHeight;
                this.listHeight.push(height);
            }
            // console.log(this.listHeight)
        },
        selectMenu(index) {
            // console.log(index)
            let foodlist = this.$refs.foodScroll.getElementsByClassName(
                "food-list-hook"
            );
            let element = foodlist[index];
            // console.log(element)
            // 滚动到对应元素的位置
            this.foodScroll.scrollToElement(element, 250);
        },
        calculateCount(spus) {
            let count = 0;
            spus.forEach((food) => {
                if (food.count > 0) {
                    count += food.count;
                }
            });
            return count;
        },
        showDetail(food) {
            this.selectFood = food;

            this.$refs.foodView.showView();
        },
    },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

.page-category {
    .van-tabs {
        height: 32px;

        .van-tabs__wrap {
            height: 32px;

            .van-tabs__nav {
                width: 200px;

                .van-tab {
                    .van-tab__text {
                        font-size: 14px;
                    }
                    &.van-tab--active {
                        color: #7abb56;
                        //font-weight: 600;
                    }
                }
            }
        }
    }
    .van-search {
        padding: 11px px2rem(15) 14px;
        .van-search__content {
            border-radius: px2rem(5);
        }
    }
    .img-block {
        width: 100%;
        box-sizing: border-box;
        padding: 0 px2rem(15);
        height: 170px;
        border-radius: px2rem(5);
        position: relative;
        img {
            width: 100%;
            height: 170px;
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

    .main-container {
        width: 100%;
        box-sizing: border-box;
        padding: 15px px2rem(15) 0px;

        .main {
            text-align: center;
            .top {
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 20px;
                }
                span {
                    font-size: 14px;
                    margin: 0 8px;
                }
            }
            .empty {
                width: px2rem(100);
                margin: px2rem(20) 0 px2rem(10);
            }
            p {
                font-size: 14px;
            }
        }
		.goods{
			display: flex;
			height: 100%;
			overflow-y: auto;
		}
        .goods .menu-wrapper {
            flex: 0 0 85px;
            background: #f4f4f4;
			overflow-y: auto;
        }

        .goods .foods-wrapper {
            flex: 1;
			// overflow-y: auto;
			overflow-y: auto;
        }

        /* Menu item */
        .goods .menu-wrapper .menu-item {
            padding: 16px 23px 15px 10px;
            border-bottom: 1px solid #e4e4e4;
            position: relative;
        }

        .goods .menu-wrapper .menu-item .text {
            font-size: 13px;
            color: #333333;
            line-height: 17px;
            vertical-align: middle;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .goods .menu-wrapper .menu-item .text .icon {
            width: 15px;
            height: 15px;
            vertical-align: middle;
        }

        /* 专场样式 */
        .goods .foods-wrapper .container-list {
            padding: 11px 11px 0 11px;
            border-bottom: 1px solid #e4e4e4;
        }

        .goods .foods-wrapper .container-list img {
            width: 100%;
            margin-bottom: 11px;
            border-radius: 5px;
        }

        /* 具体分类商品布局 */
        .goods .foods-wrapper .food-list {
            padding: 11px;
        }

        .goods .foods-wrapper .food-list .title {
            height: 13px;
            font-size: 13px;
            background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left
                center;
            background-size: 2px 10px;
            padding-left: 7px;
            margin-bottom: 12px;
        }

        .goods .foods-wrapper .food-list .food-item {
            display: flex;
            margin-bottom: 25px;
            position: relative;
        }

        .goods .foods-wrapper .food-list .food-item .icon {
            flex: 0 0 63px;
            background-position: center;
            background-size: 120% 100%;
            background-repeat: no-repeat;
            margin-right: 11px;
            height: 75px;
        }
        .goods .foods-wrapper .food-list .food-item .content {
            flex: 1;
        }

        /* 具体内容样式 */
        .goods .foods-wrapper .food-list .food-item .content .name {
            font-size: 16px;
            line-height: 21px;
            color: #333333;
            margin-bottom: 10px;
            padding-right: 27px;
        }

        .goods .foods-wrapper .food-list .food-item .content .desc {
            font-size: 10px;
            line-height: 19px;
            color: #bfbfbf;
            margin-bottom: 8px;

            /* 超出部分显示省略号*/
            -webkit-line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .goods .foods-wrapper .food-list .food-item .content .extra {
            font-size: 10px;
            color: #bfbfbf;
            margin-bottom: 7px;
        }
        .goods .foods-wrapper .food-list .food-item .content .extra .saled {
            margin-right: 14px;
        }
        .goods .foods-wrapper .food-list .food-item .content .product {
            height: 15px;
            margin-bottom: 6px;
        }
        .goods .foods-wrapper .food-list .food-item .content .price {
            font-size: 0;
        }
        .goods .foods-wrapper .food-list .food-item .content .price .text {
            font-size: 14px;
            color: #fb4e44;
        }
        .goods .foods-wrapper .food-list .food-item .content .price .unit {
            font-size: 12px;
            color: #bfbfbf;
        }

        /* 当前选中 */
        .goods .menu-wrapper .menu-item.current {
            background: white;
            font-weight: bold;
            margin-top: -1px;
        }
        .goods .menu-wrapper .menu-item:first-child.current {
            margin-top: 1px;
        }

        .goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
        }

        .goods .menu-wrapper .menu-item .num {
            position: absolute;
            right: 5px;
            top: 5px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            color: white;
            background: red;
            text-align: center;
            font-size: 7px;
            line-height: 13px;
        }
    }
}
</style>

