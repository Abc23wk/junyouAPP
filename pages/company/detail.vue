<template>
	<view class="content">
		<view class="lxk-head" v-if="detail">
			<view class="lxk-mq">
				<van-cell :title="detail.name" use-label-slot :icon="detail.logo" @click="companyDetailTo">
					<view slot="label">
						{{ detail.nature | nature }}｜{{ detail.size | size }}｜{{ detail.industry | industry }}
					</view>
				</van-cell>
			</view>
			<view class="address" @click="openMap">
				<van-icon name="location-o" color="#387ef5" />{{ detail.province }}{{ detail.city }}{{ detail.area }}{{ detail.info.address }}
				<van-icon name="arrow" custom-class="lxk-address-right" />
			</view>
		</view>
		<van-tabs :active="active" custom-class="lxk-tab" @click="onClick" v-if="detail">
			<van-tab title="公司简介">
				<view class="lxk-tab-desc">
					<text>{{ detail.info.body }}</text>
				</view>
			</van-tab>
			<van-tab title="在招职位">
				<van-cell-group custom-class="lxk-zw" :border="false">
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
							<view class="time">
								<wux-timeago :to="item.pubdate * 1000" lang="zh_CN" />
							</view>
						</view>
						<view slot="label">
							<view class="company">{{ item.city }}-{{ item.area }}</view>
						</view>
					</van-cell>
				</van-cell-group>
			</van-tab>
		</van-tabs>
		<van-cell-group :border="false" v-if="archives.list" title="猜你可能感兴趣">
			<van-cell :title="item.title" is-link v-for="(item, index) in archives.list" :key="index" :border="archives.list.length - 1 === index ? false : true"
			 @click="detailTo(item.id,3)" />
		</van-cell-group>
		<view class="lxk-foot">
			<wux-button block type="assertive" @click="delFocus" v-if="focus">取消关注</wux-button>
			<wux-button block type="positive" @click="addFocus" v-else>关注企业</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getJob,
		getArchives,
		getFocus,
		addFocus,
		delFocus,
		getCompanyDetail,
	} from '@/api/job'
	import {
		$wuxToast
	} from '../../wxcomponents/wux/index'
	import {
		debounce
	} from '@/utils/index'
	import QQMapWX from '../../common/qqmap-wx-jssdk.min.js';
	var qqmapsdk;
	export default {
		data() {
			return {
				det: true,
				focus: false,
				active: 0,
				detail: {
					nature: 1,
					size: 1,
					schooling: 1,
				},
				job: {
					list: null,
					count: null,
					search: {
						count: true,
						page: 1,
						limit: 10
					}
				},
				archives: {
					list: null,
					search: {
						arctype: 1,
						page: 1,
						limit: 5
					}
				},
				open: true,
			}
		},
		onShow() {
			if (this.$store.getters.register && this.detail.id) {
				this.getFocus()
				if (this.$store.getters.member.ac < 2) {
					this.$store.dispatch('MemberAC')
				}
			}
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		onLoad(e) {
			if (e.det === 'stop') {
				this.det = false
			}
			this.getCompanyDetail(e.id)
			this.getArchives()
			qqmapsdk = new QQMapWX({
				key: 'I3ABZ-QPZW3-JIP3T-3AVMR-TRALT-77BFQ'
			});
		},
		methods: {
			getCompanyDetail(id) {
				getCompanyDetail({
					id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.detail = r.detail
						if (this.$store.getters.register && this.detail.id) {
							this.getFocus()
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			onClick(v) {
				const e = v.detail.name
				if (e === 1 && !this.job.list) {
					this.active = 1
					this.getJob()
				} else if (e === 1) {
					this.active = 1
				} else{
					this.active = 0
				}
			},
			getJob() {
				const s = this.job.search
				const t = this.job
				getJob({
					companyid: this.detail.id,
					count: s.count,
					page: s.page,
					limit: s.limit,
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.count = r.list.count
						if (t.list && t.list.length > 0) {
							t.list = t.list.concat(r.list.rows)
						} else {
							t.list = r.list.rows
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			refresher() {
				console.log(this.active)
				if (this.active === 1) {
					let t = this.job
					if (t.count > t.list.length) {
						t.search.page = t.search.page++
						this.getJob()
					} else {
						$wuxToast().hide()
						$wuxToast().show({
							type: 'forbidden',
							text: '已加载全部'
						})
					}
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
						url: '/pages/article/detail?id=' + i
					});
				}
			},
			getFocus() {
				getFocus({
					id: this.detail.id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.focus = r.detail
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			addFocus(e) {
				if (this.$store.getters.register) {
					addFocus({
						id: this.detail.id
					}).then(response => {
						let r = response.data
						if (response.code === 20000 && r.add) {
							this.focus = true
							$wuxToast().show({
								type: 'success',
								text: '关注成功'
							})
						} else if (response.code === 20000 && r.detail) {
							this.focus = true
							$wuxToast().show({
								type: 'success',
								text: '已关注'
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
			delFocus(e) {
				if (this.$store.getters.register) {
					delFocus({
						id: this.detail.id
					}).then(response => {
						let r = response.data
						if (response.code === 20000 && r.del) {
							this.focus = false
							$wuxToast().show({
								type: 'success',
								text: '已取消关注'
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
			getArchives() {
				const t = this.archives
				getArchives(t.search).then(response => {
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

		.lxk-body-desc {
			color: #666;
			font-size: 12px;
			line-height: 24px;
			padding-top: 5px;
		}
	}

	.lxk-price {
		color: #ef473a;
	}

	.lxk-foot {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 10px;
		background: #fff;
	}

	/deep/ {
		.van-cell-group__title {
			padding: 10px 15px;
			font-size: 12px;
		}

		.lxk-head {
			.lxk-mq {
				.cell-index--van-cell__left-icon {
					font-size: 32px;
					padding-top: 21px;
				}
			}

			.van-cell {
				border-top-right-radius: 5px;
				border-top-left-radius: 5px;
			}
		}

		.lxk-tab {
			background: #fff;

			.lxk-tab-desc {
				padding: 10px;
				line-height: 24px;
				font-size: 12px;
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
		color: #666;
		background: #fff;
		border-radius: 5px;
		box-shadow: 0 .02667rem .32rem hsla(0, 0%, 85.9%, .35);

		.lxk-demand {
			font-size: 12px;
			line-height: 24px;
			color: #fff;
			padding-bottom: 10px;
			margin-bottom: 10px;
		}

		.address {
			font-size: 12px;
			// color: #666;
			line-height: 36px;
			position: relative;
			padding-left: 10px;

			/deep/ {
				.lxk-address-right {
					float: right;
					line-height: 36px;
				}

				.van-icon {
					margin-right: 5px;
				}
			}
		}
	}
</style>
