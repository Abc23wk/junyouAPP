<template>
	<view class="content" v-if="detail">
		<view class="lxk-head">
			<view class="lxk-head-desc">
				<view class="title">
					{{ detail.title }}
					<van-tag plain type="success">{{ detail.state | resumestate }}</van-tag>
				</view>
				<view class="info">
					<van-icon name="medel-o" color="#387ef5" />{{ member.ac | ac }}
				</view>
				<van-grid :border="false" column-num="3">
					<van-grid-item text="设置" @click="settingTo">
						<view slot="icon">
							<van-icon name="setting-o" color="#444" />
						</view>
					</van-grid-item>
					<van-grid-item text="刷新" @click="upRasumePubdate">
						<view slot="icon">
							<van-icon name="replay" color="#387ef5" />
						</view>
					</van-grid-item>
					<van-grid-item text="预览" @click="previewTo">
						<view slot="icon">
							<van-icon name="orders-o" color="#33cd5f" />
						</view>
					</van-grid-item>
				</van-grid>
			</view>
		</view>
		<van-cell-group custom-class="lxk-zw" :border="false">
			<van-cell title="基本信息" is-link icon="description" custom-class="title-color-positive" @click="basicTo" />
			<van-cell use-label-slot :border="false">
				<view slot="title">
					{{ detail.name }}<span>｜{{ detail.gender | gender }}｜{{ detail.birthdate | timesAgo }}岁</span>
				</view>
				<view slot="label">
					<view class="info">{{ detail.startjob | timesAgo }}年工作经验</view>
					<view class="info">
						<van-icon name="aim" color="#387ef5" />{{ detail.jobstate | jobstate }}</view>
					<view class="info">
						<van-icon name="phone-o" color="#387ef5" />{{ detail.phone }}</view>
					<view class="info" v-if="detail.emall">
						<van-icon name="envelop-o" color="#387ef5" />{{ detail.emall }}</view>
					<view class="info">
						<van-icon name="hotel-o" color="#387ef5" />{{ detail.habitation }}</view>
				</view>
			</van-cell>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="求职意向" is-link icon="aim" custom-class="title-color-positive" @click="prefTo" />
			<van-cell-group :border="false" custom-class="lxk-yx">
				<van-cell :border="false">
					<view slot="title">
						求职职位<span>{{ detail.position ? detail.position : '未填写' }}</span>
					</view>
				</van-cell>
				<van-cell :border="false">
					<view slot="title">
						工作类型<span>{{ detail.info.type ? detail.info.type : '0' | prefType }}</span>
					</view>
				</van-cell>
				<van-cell :border="false">
					<view slot="title">
						期望薪资<span>{{ detail.salary ? detail.salary : '0' | salary }}</span>
					</view>
				</van-cell>
				<van-cell :border="false">
					<view slot="title">
						工作地点<span>{{ detail.location ? detail.location : '未填写' }}</span>
					</view>
				</van-cell>
			</van-cell-group>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="工作经验" is-link icon="orders-o" custom-class="title-color-positive" @click="workTo" />
			<wux-timeline wux-class="lxk-timeline" v-if="detail.work.length > 0">
				<wux-timeline-item v-for="(item, index) in detail.work" :key="index" is-link>
					<view class="time">{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}</view>
					<view class="company">{{ item.company }}</view>
					<view class="position">{{ item.position }}</view>
				</wux-timeline-item>
			</wux-timeline>
			<view v-else class="lxk-add">
				<view class="lxk-add-title">尚未填写</view>
				<wux-button type="positive" @click="workTo" size="small">立即完善</wux-button>
			</view>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="项目经验" is-link icon="orders-o" custom-class="title-color-positive" @click="projectTo" />
			<wux-timeline wux-class="lxk-timeline" v-if="detail.project.length > 0">
				<wux-timeline-item v-for="(item, index) in detail.project" :key="index">
					<view class="time">{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}</view>
					<view class="company">{{ item.name }}</view>
				</wux-timeline-item>
			</wux-timeline>
			<view v-else class="lxk-add">
				<view class="lxk-add-title">尚未填写</view>
				<wux-button type="positive" @click="projectTo" size="small">立即完善</wux-button>
			</view>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="教育经历" is-link icon="hotel-o" custom-class="title-color-positive" @click="eduTo" />
			<wux-timeline wux-class="lxk-timeline" v-if="detail.edu.length > 0">
				<wux-timeline-item v-for="(item, index) in detail.edu" :key="index">
					<view class="time">{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}</view>
					<view class="company">{{ item.school }}</view>
					<view class="position">{{ item.degree | degree }}｜{{ item.major }}</view>
				</wux-timeline-item>
			</wux-timeline>
			<view v-else class="lxk-add">
				<view class="lxk-add-title">尚未填写</view>
				<wux-button type="positive" @click="eduTo" size="small">立即完善</wux-button>
			</view>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="军旅荣誉" is-link icon="medel-o" custom-class="title-color-positive" @click="honorTo" />
			<wux-timeline wux-class="lxk-timeline" v-if="detail.honor.length > 0">
				<wux-timeline-item v-for="(item, index) in detail.honor" :key="index">
					<view class="time">{{ item.time | parseTime('{y}/{m}') }}</view>
					<view class="company">{{ item.description }}</view>
				</wux-timeline-item>
			</wux-timeline>
			<view v-else class="lxk-add">
				<view class="lxk-add-title">尚未填写</view>
				<wux-button type="positive" @click="honorTo" size="small">立即完善</wux-button>
			</view>
		</van-cell-group>
		<ltabbar></ltabbar>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getRasume,
		upRasumePubdate,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'member',
			])
		},
		data() {
			return {
				detail: {
					info: {
						type: 0
					}
				},
			}
		},
		onShow() {
			uni.hideKeyboard()
			this.$store.commit('SET_LTABBAR', 'resume');
			this.getRasume()
			if (this.$store.getters.member.ac < 2) {
				this.$store.dispatch('MemberAC')
			}
		},
		onLoad() {
			uni.hideTabBar()
		},
		methods: {
			getRasume() {
				getRasume().then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.detail = r.detail
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			upRasumePubdate() {
				upRasumePubdate().then(response => {
					let r = response.data
					if (response.code === 20000) {
						if (r.up) {
							$wuxToast().show({
								type: 'success',
								text: '刷新成功'
							})
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '刷新失败'
						})
					}
				})
			},
			basicTo() {
				uni.navigateTo({
					url: '/pages/resume/basic'
				});
			},
			prefTo() {
				uni.navigateTo({
					url: '/pages/resume/pref'
				});
			},
			settingTo() {
				uni.navigateTo({
					url: '/pages/resume/setting'
				});
			},
			previewTo() {
				uni.navigateTo({
					url: '/pages/resume/preview'
				});
			},
			projectTo() {
				if (this.detail.project.length > 0) {
					uni.navigateTo({
						url: '/pages/resume/project/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/resume/project/add'
					});
				}
			},
			eduTo() {
				if (this.detail.edu.length > 0) {
					uni.navigateTo({
						url: '/pages/resume/edu/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/resume/edu/add'
					});
				}
			},
			honorTo() {
				if (this.detail.honor.length > 0) {
					uni.navigateTo({
						url: '/pages/resume/honor/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/resume/honor/add'
					});
				}
			},
			workTo() {
				if (this.detail.work.length > 0) {
					uni.navigateTo({
						url: '/pages/resume/work/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/resume/work/add'
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 60px;
	}

	.lxk-add {
		padding: 30px 0;
		font-size: 12px;
		text-align: center;

		.lxk-add-title {
			margin-bottom: 20px;
		}

		/deep/ {
			.wux-button--small {
				padding: 0 24px;
			}
		}
	}

	.lxk-head {
		height: 100px;
		margin-bottom: 80px;
		background: #387ef5;
		position: relative;

		.lxk-head-desc {
			position: absolute;
			background: #fff;
			padding: 15px 15px 0;
			border-radius: 5px;
			// bottom: -10px;
			top: 20px;
			left: 10px;
			right: 10px;

			.title {
				font-weight: bold;
				font-size: 18px;

				/deep/ {
					.van-tag {
						margin-left: 5px;
						vertical-align: middle;
						font-weight: normal;
					}
				}
			}

			.info {
				font-size: 12px;
				color: #666;
				line-height: 24px;

				/deep/ {
					.van-icon {
						margin-right: 3px;
					}
				}
			}
		}
	}

	/deep/ {
		.lxk-timeline {
			padding: 30px 10px 0;
			font-size: 12px;
			line-height: 28px;

			.wux-timeline-item__tail {
				left: 17rpx;
				top: 10px;
				border-left: 2rpx solid #e8e8e8;
			}

			.wux-timeline-item__dot {
				border: 2rpx solid #387ef5;
				width: 15rpx;
				height: 15rpx;
				margin-left: 5px;
				margin-top: 4px;
			}

			.time {
				font-size: 14px;
				color: #666;
			}

			.company {
				font-size: 14px;
				color: #333;
			}

			.position {
				font-size: 12px;
				color: #666;
			}
		}

		.title-color-positive {
			color: $uni-color-positive;
		}

		.lxk-yx {
			padding: 10px 0 10px 10px;

			.van-cell__title {
				font-size: 12px;
				color: #999;
			}

			span {
				font-size: 12px;
				color: #333;
				margin-left: 15px;
			}
		}

		.lxk-cell-def {
			margin: 10px 10px 0;
			overflow: hidden;
			border-radius: 5px;
			background: #fff;
		}

		.lxk-zw {
			margin: 10px 10px 0;
			overflow: hidden;
			border-radius: 5px;
			background: #fff;

			span {
				margin-left: 5px;
				font-size: 12px;
				color: #999;
				line-height: 24px;
			}

			.info {
				font-size: 12px;
				color: #666;
				line-height: 24px;

				.van-icon {
					margin-right: 3px;
					vertical-align: middle;
				}
			}
		}
	}
</style>
