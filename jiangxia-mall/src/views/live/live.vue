<template>
	<div class="page-live">
<!--		<img src="../../assets/images/bg/live-banner.png" class="banner">-->
		<div class="main">
			<ul>
				<li>
					<img src="../../assets/images/bg/live_oper.png">
					<div>
						<h4>江夏制造频道</h4>
						<p>
							<img src="../../assets/images/jx/people.png" >
							<span>1.4w</span>
						</p>
					</div>
				</li>
				<li>
					<img src="../../assets/images/bg/live_science.png">
					<div>
						<h4>江夏科创频道</h4>
						<p>
							<img src="../../assets/images/jx/people.png" >
							<span>1.4w</span>
						</p>
					</div>
				</li>
				<li>
					<img src="../../assets/images/bg/live_farm.png">
					<div>
						<h4>江夏惠农频道</h4>
						<p>
							<img src="../../assets/images/jx/people.png" >
							<span>1.4w</span>
						</p>
					</div>
				</li>
				<li>
					<img src="../../assets/images/bg/live_culture.png">
					<div>
						<h4>江夏文旅频道</h4>
						<p>
							<img src="../../assets/images/jx/people.png" >
							<span>1.4w</span>
						</p>
					</div>
				</li>
				<li>
					<img src="../../assets/images/bg/live_healthy.png">
					<div>
						<h4>江夏健康频道</h4>
						<p>
							<img src="../../assets/images/jx/people.png" >
							<span>1.4w</span>
						</p>
					</div>
				</li>
			</ul>
		</div>
		<TabBar></TabBar>
	</div>
</template>
<script>
import TabBar from "../../components/TabBar";
export default {
	data() {
		return {
		}
	},
	components: {
		TabBar
	},
	methods: {}
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
.page-live{
	padding-top: 100px;
	background-image: url("../../assets/images/bg/live-banner.png");
	background-size: 100%;
	background-repeat: no-repeat;
	img{
		&.banner{
			width: 100%;
		}
	}
	.main{
		padding: 0 px2rem(10);
		box-sizing: border-box;
		ul{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			li{
				width: px2rem(170);
				margin-right: px2rem(15);
				margin-bottom: px2rem(12);
				&:nth-child(2n){
					margin-right: 0;
				}
				img{
					width: px2rem(170);
					height: px2rem(96);
					border-radius: px2rem(5);
				}
				div{
					display: flex;
					justify-content: space-between;
					align-items: center;
					h4{
						font-size: 14px;
					}
					p{
						display: flex;
						align-items: center;
						img{
							width: 20px;
							height: 20px;
						}
						span{
							font-size: 12px;
							color: #A9A9A9;
						}
					}

				}
			}
		}
	}
}
</style>

