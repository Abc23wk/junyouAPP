<template>
	<view class="content" v-if="detail">
		<view class="lxk-head">
			<view>{{ detail.title }}</view>
			<view class="lxk-demand">
				{{ detail.type | trainingType }}｜{{ detail.course }}节课程｜已报名 <span class="job-num">{{ detail.num }}</span>个
				<view>培训时间：{{ detail.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</view>
			</view>
			<view class="lxk-price">
				{{ detail.cost > 0 ? detail.cost : '免费' }}
				<span class="time">
					<wux-timeago :to="detail.pubdate * 1000" lang="zh_CN" /></span>
			</view>
			<view class="address" @click="openMap">
				<van-icon name="location-o" color="#387ef5" />{{ detail.province }}{{ detail.city }}{{ detail.area }}{{ detail.info.address }}
				<van-icon name="arrow" custom-class="lxk-address-right" />
			</view>
		</view>
		<view class="lxk-body">
			<view class="lxk-body-title">培训亮点</view>
			<view class="lxk-body-tag">
				<van-tag plain type="primary" v-for="(item, index) in detail.info.tag" :key="index">{{ item }}</van-tag>
			</view>
		</view>
		<view class="lxk-body">
			<view class="lxk-body-title">培训描述</view>
			<view class="lxk-body-desc">
				{{ detail.info.body }}
			</view>
		</view>
		<view class="lxk-foot">
			<wux-button block type="positive" @click="addTrainingApply" :disabled="apply">{{ apply ? '已报名，稍后培训专员将于您联系' : '立即报名' }}</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		addTrainingApply,
		getTrainingApply,
		getTrainingDetail,
	} from '@/api/job'
	import {
		$wuxToast
	} from '../../wxcomponents/wux/index'
	import QQMapWX from '../../common/qqmap-wx-jssdk.min.js';
	var qqmapsdk;
	export default {
		data() {
			return {
				apply: false,
				detail: {
					type: 1,
					pubdate: 1571801261,
				},
				open: true,
			}
		},
		onShow() {
			if (this.$store.getters.register && this.detail.id) {
				this.getTrainingApply()
			}
			this.open = true
		},
		onLoad(e) {
			this.getTrainingDetail(e.id)
			qqmapsdk = new QQMapWX({
				key: 'I3ABZ-QPZW3-JIP3T-3AVMR-TRALT-77BFQ'
			});
		},
		methods: {
			getTrainingDetail(id) {
				getTrainingDetail({
					id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.detail = r.detail
						this.detail.info.tag = r.detail.info.tag.split(',')
						if (this.$store.getters.register && this.detail.id) {
							this.getTrainingApply()
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			getTrainingApply() {
				getTrainingApply({
					id: this.detail.id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.apply = r.detail
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			addTrainingApply(e) {
				if (this.$store.getters.register) {
					if (this.$store.getters.member.ac > 1) {
						addTrainingApply({
							id: this.detail.id
						}).then(response => {
							let r = response.data
							if (response.code === 20000 && r.add) {
								this.apply = true
								$wuxToast().show({
									type: 'success',
									text: '报名成功'
								})
							} else if (response.code === 20000 && r.detail) {
								this.apply = true
								$wuxToast().show({
									type: 'success',
									text: '已报名'
								})
							} else {
								$wuxToast().show({
									type: 'forbidden',
									text: '请求异常'
								})
							}
						})
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '账号未认证'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/my/ac'
							});
						}, 1000)
					}
				} else {
					// #ifdef APP-PLUS
					uni.navigateTo({
						url: '/pages/login/app'
					});
					// #endif
					// #ifdef MP-WEIXIN
					uni.navigateTo({
						url: '/pages/login/wx'
					});
					// #endif
				}
			},
			openMap() {
				let o = this.open
				if (o) {
					o = false
					const d = this.detail
					qqmapsdk.geocoder({
						address: d.province + d.city + d.area + d.info.address,
						success: res => {
							const location = res.result.location
							uni.openLocation({
								latitude: location.lat,
								longitude: location.lng,
								success: function() {
									setTimeout(() => {
										o = true
									}, 2000)
								},
								fail: function() {
									o = true
								},
							});
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 0 70px;
	}

	.lxk-body {
		margin: 10px;
		padding: 10px;
		background: #fff;
		border-radius: 5px;

		.lxk-price {
			color: #ef473a;
		}

		.lxk-body-title {
			font-size: 14px;
			position: relative;
			padding-bottom: 5px;
			margin-bottom: 5px;

			&:after {
				position: absolute;
				box-sizing: border-box;
				content: ' ';
				pointer-events: none;
				right: 0;
				bottom: 0;
				left: 0;
				border-bottom: 1px solid #ebedf0;
				transform: scaleY(0.5);
			}
		}

		.lxk-body-tag {
			font-size: 12px;
			line-height: 24px;
			color: #666;

			/deep/ {
				.van-tag {
					margin-right: 8px;
				}
			}
		}

		.lxk-body-desc {
			color: #666;
			font-size: 12px;
		}
	}

	.job-num {
		font-size: 12px;
		color: #1a8afa;
		padding: 0 5px;
		font-weight: 700;
	}

	/deep/ {
		.lxk-mq {
			.cell-index--van-cell__left-icon {
				font-size: 32px;
				padding-top: 21px;
			}
		}

		.lxk-zw {

			.time,
			.demand {
				font-size: 12px;
				color: #999;
				line-height: 24px;
			}

			.company,
			.area {
				font-size: 12px;
				color: #666;
				line-height: 24px;
			}
		}
	}

	.lxk-head {
		margin: 10px;
		padding: 10px;
		background: #fff;
		border-radius: 5px;
		box-shadow: 0 .02667rem .32rem hsla(0, 0%, 85.9%, .35);

		.lxk-demand {
			font-size: 12px;
			line-height: 24px;
			color: #666;
		}

		.address {
			font-size: 12px;
			// color: #666;
			line-height: 24px;
			position: relative;

			/deep/ {
				.lxk-address-right {
					float: right;
					line-height: 24px;
				}

				.van-icon {
					margin-right: 5px;
				}
			}
		}

		.lxk-price {
			color: #ef473a;
			font-size: 16px;
			line-height: 48px;
			margin-bottom: 10px;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				border-bottom: 1px solid #ebedf0;
				transform: scaleY(0.5);
			}

			.time {
				font-size: 12px;
				float: right;
				color: #666;
			}
		}
	}

	.lxk-foot {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 10px;
		background: #fff;
	}
</style>
