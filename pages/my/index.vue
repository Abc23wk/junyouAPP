<template>
	<view class="content">
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="职位申请" is-link icon="orders-o" custom-class="title-color-positive" @click="applyTo" />
			<van-cell title="培训报名" is-link icon="records" custom-class="title-color-positive" @click="trainingTo" />
			<van-cell title="职位收藏" is-link icon="user-o" custom-class="title-color-positive" @click="collectionTo" />
			<van-cell title="关注企业" is-link icon="star-o" :border="false" custom-class="title-color-balanced" @click="focusTo" />
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="账号与安全" is-link icon="bulb-o" custom-class="title-color-assertive" @click="securityTo" />
			<van-cell title="军人认证" is-link icon="medel-o" custom-class="title-color-positive" @click="acTo" />
			<van-cell title="帮助中心" is-link icon="question-o" custom-class="title-color-balanced" @click="helpTo" />
			<van-cell title="关于我们" is-link icon="hotel-o" :border="false" custom-class="title-color-positive" @click="articleTo(2)" />
		</van-cell-group>
		<ltabbar></ltabbar>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {}
		},
		onShow() {
			uni.hideKeyboard()
			this.$store.commit('SET_LTABBAR', 'user');
		},
		onLoad() {
			uni.hideTabBar()
		},
		methods: {
			applyTo() {
				uni.navigateTo({
					url: '/pages/job/apply'
				});
			},
			focusTo() {
				uni.navigateTo({
					url: '/pages/company/focus'
				});
			},
			articleTo(i) {
				uni.navigateTo({
					url: '/pages/article/detail?id=' + i
				});
			},
			securityTo() {
				uni.navigateTo({
					url: '/pages/my/security'
				});
			},
			trainingTo(){
				uni.navigateTo({
					url: '/pages/training/apply'
				});
			},
			acTo() {
				uni.navigateTo({
					url: '/pages/my/ac'
				});
			},
			helpTo() {
				uni.navigateTo({
					url: '/pages/article/help'
				});
			},
			collectionTo() {
				uni.navigateTo({
					url: '/pages/job/collection'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 60px;
	}

	/deep/ {
		.title-color-warning {
			.van-cell__left-icon-wrap {
				color: $uni-color-warning;
			}
		}

		.title-color-positive {
			.van-cell__left-icon-wrap {
				color: $uni-color-positive;
			}
		}

		.title-color-assertive {
			.van-cell__left-icon-wrap {
				color: $uni-color-assertive;
			}
		}

		.title-color-balanced {
			.van-cell__left-icon-wrap {
				color: $uni-color-balanced;
			}
		}

		.lxk-cell-def {
			margin: 10px 10px 0;
			overflow: hidden;
			border-radius: 5px;
			background: #fff;
		}
	}
</style>
