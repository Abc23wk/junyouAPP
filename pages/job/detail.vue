<template>
	<view class="content" v-if="detail">
		<view class="lxk-head">
			<view>{{ detail.title }}</view>
			<view class="lxk-demand">
				{{ detail.schooling ? detail.schooling : 0 | schoolings }}｜{{ detail.working ? detail.working : 0 | workings }}｜{{ detail.type | prefType }}
			</view>
			<view class="lxk-price">
				<span v-if="detail.salarystart === 0 && detail.salaryend === 0">面议</span>
				<span v-else-if="parseFloat(detail.salarystart.toString().length) >= 4 && parseFloat(detail.salaryend.toString().length) >= 4">
					{{ detail.salarystart / 10000 | numFilter }}-{{ detail.salaryend / 10000 | numFilter}}万/月
				</span>
				<span v-else-if="parseFloat(detail.salarystart.toString().length) < 4 && parseFloat(detail.salaryend.toString().length) < 4">
					{{ detail.salarystart }}-{{ detail.salaryend }}元/月
				</span>
				<span class="time">
					<wux-timeago :to="detail.pubdate * 1000" lang="zh_CN" /></span>
			</view>
			<view class="address" @click="openMap">
				<van-icon name="location-o" color="#387ef5" />{{ detail.province }}{{ detail.city }}{{ detail.area }}{{ detail.info.address }}
				<van-icon name="arrow" custom-class="lxk-address-right" />
			</view>
		</view>
		<view class="lxk-body" v-if="detail.info.tag">
			<view class="lxk-body-title">职位亮点</view>
			<view class="lxk-body-tag">
				<van-tag plain type="primary" v-for="(item, index) in detail.info.tag" :key="index">{{ item }}</van-tag>
			</view>
		</view>
		<view class="lxk-body">
			<view class="lxk-body-title">职位描述</view>
			<text class="lxk-body-desc">{{detail.info.body}}</text>
		</view>
		<view class="lxk-body" v-if="det">
			<view class="lxk-body-title">企业信息</view>
			<van-cell-group custom-class="lxk-mq" :border="false">
				<van-cell :title="detail.company.name" use-label-slot :icon="detail.company.logo" :border="false" @click="detailTo(detail.companyid,1)">
					<view slot="label">
						{{ detail.company.nature | nature }}｜{{ detail.company.size | size }}｜在招 <span class="job-num">{{ detail.company.job_num }}</span>个
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="lxk-body" v-if="job.list">
			<view class="lxk-body-title">职位推荐</view>
			<van-cell-group custom-class="margin-top-10 lxk-zw" :border="false">
				<van-cell :title="item.title" use-label-slot :border="job.list.length - 1 === index ? false : true" @click="detailTo(item.id,2)"
				 v-for="(item, index) in job.list" :key="index">
					<view class="lxk-price">
						<span v-if="item.salarystart === 0 && item.salaryend === 0">面议</span>
						<span v-else-if="parseFloat(item.salarystart.toString().length) >= 4 && parseFloat(item.salaryend.toString().length) >= 4">
							{{ item.salarystart / 10000 | numFilter }}-{{ item.salaryend / 10000 | numFilter}}万/月
						</span>
						<span v-else-if="parseFloat(item.salarystart.toString().length) < 4 && parseFloat(item.salaryend.toString().length) < 4">
							{{ item.salarystart }}-{{ item.salaryend }}元/月
						</span>
						<view class="area">{{ item.city }}-{{ item.area }}</view>
						<view class="time">
							<wux-timeago :to="item.pubdate * 1000" lang="zh_CN" />
						</view>
					</view>
					<view slot="label">
						<view class="company">{{ item.company.name }}</view>
						<view class="demand">{{ item.company.nature | nature }}</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<van-row custom-class="lxk-foot" gutter="20">
			<van-col span="12">
				<wux-button block outline type="positive" @click="addCollection" v-if="!collection">收藏职位</wux-button>
				<wux-button block outline type="assertive" @click="delCollection" v-else>取消收藏</wux-button>
			</van-col>
			<van-col span="12">
				<wux-button block type="positive" @click="addApply" :disabled="apply">{{ apply ? '已投递' : '立即投递' }}</wux-button>
			</van-col>
		</van-row>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		addCollection,
		getCollection,
		delCollection,
		addApply,
		getApply,
		getJobDetail,
		getJob,
	} from '@/api/job'
	import {
		$wuxToast
	} from '../../wxcomponents/wux/index'
	import QQMapWX from '../../common/qqmap-wx-jssdk.min.js';
	var qqmapsdk;
	export default {
		data() {
			return {
				det: true,
				collection: false,
				apply: false,
				detail: {
					company: {
						nature: 1,
						size: 1,
					},
					salarystart: 1,
					salaryend: 1,
					schooling: 1,
					pubdate: 1571801261,
				},
				job: {
					list: null,
					search: {
						page: 1,
						limit: 5
					}
				},
				open: true,
			}
		},
		onShow() {
			if (this.$store.getters.register && this.detail.id) {
				this.getCollection()
				this.getApply()
			}
			if (this.$store.getters.member.ac < 2) {
				this.$store.dispatch('MemberAC')
			}
		},
		onLoad(e) {
			if (e.det === 'stop') {
				this.det = false
			}
			this.getJobDetail(e.id)
			qqmapsdk = new QQMapWX({
				key: 'I3ABZ-QPZW3-JIP3T-3AVMR-TRALT-77BFQ'
			});
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getJobDetail(id) {
				getJobDetail({
					id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.detail = r.detail
						if (this.detail.info.tag) {
							this.detail.info.tag = r.detail.info.tag.split(',')
						}
						if (this.$store.getters.register && this.detail.id) {
							this.getCollection()
							this.getApply()
						}
						if (this.det) {
							this.getJob()
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			getJob() {
				const s = this.job.search
				const t = this.job
				const a = this.$store.getters.address
				const search = Object.assign({}, {
						page: s.page,
						limit: s.limit,
					},
					a.province ? {
						province: a.province
					} : {},
					a.city ? {
						city: a.city
					} : {},
					a.area ? {
						area: a.area
					} : {},
				);
				getJob(search).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.list = r.list
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			getCollection() {
				getCollection({
					id: this.detail.id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.collection = r.detail
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			delCollection(e) {
				if (this.$store.getters.register) {
					delCollection({
						id: this.detail.id
					}).then(response => {
						let r = response.data
						if (response.code === 20000 && r.del) {
							this.collection = false
							$wuxToast().show({
								type: 'success',
								text: '已取消收藏'
							})
						} else {
							$wuxToast().show({
								type: 'forbidden',
								text: '请求异常'
							})
						}
					})
				} else {
					// 跳转授权注册页面
					uni.navigateTo({
						url: '/pages/login/wx'
					});
				}
			},
			getApply() {
				getApply({
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
			addCollection(e) {
				if (this.$store.getters.register) {
					addCollection({
						id: this.detail.id
					}).then(response => {
						let r = response.data
						if (response.code === 20000 && r.add) {
							this.collection = true
							$wuxToast().show({
								type: 'success',
								text: '收藏成功'
							})
						} else if (response.code === 20000 && r.detail) {
							this.collection = true
							$wuxToast().show({
								type: 'success',
								text: '已收藏'
							})
						} else {
							$wuxToast().show({
								type: 'forbidden',
								text: '请求异常'
							})
						}
					})
				} else {
					// 跳转授权注册页面
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
			addApply(e) {
				if (this.$store.getters.register) {
					if (this.$store.getters.member.ac > 1) {
						addApply({
							id: this.detail.id
						}).then(response => {
							let r = response.data
							if (response.code === 20000 && r.add) {
								this.apply = true
								$wuxToast().show({
									type: 'success',
									text: '投递成功'
								})
							} else if (response.code === 20000 && r.detail) {
								this.apply = true
								$wuxToast().show({
									type: 'success',
									text: '已投递'
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
			detailTo(i, n) {
				if (n === 1) {
					uni.navigateTo({
						url: '/pages/company/detail?det=stop&id=' + i
					});
				} else if (n === 2) {
					uni.navigateTo({
						url: '/pages/job/detail?det=stop&id=' + i
					});
				} else if (n === 3) {
					uni.navigateTo({
						url: '/pages/archives/detail?id=' + i
					});
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
			width: 100%;
		}
	}

	.job-num {
		font-size: 12px;
		color: #1a8afa;
		padding: 0 5px;
		font-weight: 700;
	}

	/deep/ {
		.lxk-foot {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 0 10px;
			background: #fff;
		}

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
</style>
