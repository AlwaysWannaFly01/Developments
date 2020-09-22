<template>
    <div class="page-detail">
        <van-swipe class="my-swipe" :autoplay="2000" indicator-color="#7abb56">
            <van-swipe-item v-for="(image, index) in data.newGallery" :key="index">
                <img v-lazy="image" />
            </van-swipe-item>
        </van-swipe>
        <div class="line"></div>
		<div class="price">
			<div>
				<h4>
					{{data.shopPrice}}
				</h4>
				<del>
					{{data.marketPrice}}
				</del>
			</div>
			<span>
				{{`已售${data.saleNum}件`}}
			</span>
		</div>
    </div>
</template>
<script>
import Vue from "vue";
import { Swipe, SwipeItem, Lazyload, Divider } from "vant";

Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(Divider);
import _ from "lodash";
import { Request } from "@/api/index";

export default {
    data() {
        return {
            data: {},
        };
    },
    beforeMount() {
        this.id = this.$route.query.id;
    },
    mounted() {
        if (this.id) {
            this.init(this.id);
        }
    },
    methods: {
        init(param) {
            console.log(param);
            Request("jxyx", "weapp/goods/goodsdetail", "post", {
                goodsId: param,
            })
                .then((res) => {
                    console.log(res);
                    if (res.status === 1) {
                        const { gallery, goodsImg } = res.data;
                        let newGallery = [];
                        gallery.map((item) => {
                            if (_.startsWith(item, "http")) {
                                return;
                            } else {
                                item = "http://youyoujiang.com/" + item;
                            }
                            newGallery.push(item);
                        });
                        // console.log(newGallery);

                        let newGoodsImg = "";
                        if (_.startsWith(goodsImg, "http")) {
                            return;
                        } else {
                            newGoodsImg = "http://youyoujiang.com/" + goodsImg;
                        }
                        // console.log(newGoodsImg);
                        res.data["newGallery"] = newGallery;
                        res.data["newGoodsImg"] = newGoodsImg;

                        console.log(res.data);
                        this.data = res.data;
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
#app {
    padding-bottom: 0;
}
.page-detail {
    .my-swipe {
        .van-swipe-item {
            height: px2rem(200);
            img {
                width: 100%;
                height: px2rem(200);
            }
        }
    }
    .van-divider {
        margin: 0;
        &::before {
            border-width: px2rem(15) 0 0 0;
        }
    }
    .line {
        width: 100%;
        height: px2rem(10);
        background-color: rgba(235, 237, 240, .5);
    }
	.price{
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		align-items: center;
		width: 100%;
		padding: px2rem(15);
		box-sizing: border-box;
		div{
			display: flex;
			align-items: center;
			h4{
				font-size: 16px;
				font-weight: 600;
				color:#7abb56;
			}
		}
	}
}
</style>
