<template>
	<div class="page-companyDetail" v-if="detail.articleTitle">
		<section>
			<h2>{{ detail.articleTitle ? detail.articleTitle : '' }}</h2>
			<p>{{ `公司地址: ${detail.address}` }}</p>
		</section>
		<div class="container">
			<div class="top">
				<img src="../../assets/images/jx/label_icon.png"/>
				<span>公司简介</span>
				<img src="../../assets/images/jx/label_icon.png"/>
			</div>
			<div class="desc">{{ detail.articleDesc }}</div>
			<div class="top">
				<img src="../../assets/images/jx/label_icon.png"/>
				<span>产品介绍</span>
				<img src="../../assets/images/jx/label_icon.png"/>
			</div>
			<div v-html="detail.articleContent" class=detail>
			</div>
		</div>
		<nav @click="callPhone">
			<van-icon name="phone-o" size="20" color="#fff"></van-icon>
			<span>联系客服</span>
		</nav>
	</div>
</template>

<script>
import Vue from "vue";
import {Icon} from 'vant';

Vue.use(Icon);
import {Request} from "@/api/index";

export default {
	data() {
		return {
			detail: {},
		};
	},
	beforeMount() {
		// console.log(this.$route);
		this.id = this.$route.query.articleId;
	},
	mounted() {
		if (this.id) {
			this.init(this.id);
		}
	},
	methods: {
		init(param) {
			Request("jxyx", "weapp/articles/getarticlebyid", "post", {
				id: param,
			}).then((res) => {
				// console.log(res);
				if (res.status === 1) {
					this.detail = res.data;
				}
			});
		},
		callPhone() {
			if (this.detail.tel) {
				window.location.href = 'tel:' + this.detail.tel
			} else {
				window.location.href = 'tel:'
			}
		}
	},
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

#app {
	padding-bottom: 0;
}

.page-companyDetail {
	width: 100%;
	box-sizing: border-box;
	padding: px2rem(90) px2rem(15) 0;
	background-image: url('../../assets/images/bg/detail.png');
	background-size: 100% px2rem(100);
	background-repeat: no-repeat;

	section {
		h2 {
			font-size: 16px;
			text-align: center;
			margin-bottom: px2rem(15);
		}

		p {
			font-size: 14px;
			margin-top: px2rem(10);
		}
	}

	.container {
		.top {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: px2rem(20);
			margin-top: px2rem(30);

			img {
				width: 20px;
			}

			span {
				font-size: 14px;
				margin: 0 8px;
			}
		}

		.desc {
			font-size: 14px;
		}

		.detail {
			font-size: 14px;
		}
	}

	nav {
		width: px2rem(124);
		height: px2rem(40);
		border-radius: px2rem(20);
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: px2rem(32);
		right: px2rem(25);
		background-color: rgba(145, 206, 111, 1);

		span {
			font-size: 16px;
			color: #fff;
		}
	}
}
</style>
