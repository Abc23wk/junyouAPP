<template>
	<view class="content">
		<van-tabs animated :border="false" @click="onClick" v-if="tabs === 0">
			<van-tab title="全部">
				<view v-if="all.list.length > 0">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in all.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="detailTo(item.job.id)" v-if="item.state !== 5" />
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="inviteTo(item.id)" v-else />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0:  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无接收到反馈</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
			<van-tab title="已查阅">
				<view v-if="cy.list.length > 0 && ready">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in cy.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="detailTo(item.job.id)" />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无任何企业查看简历</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
			<van-tab title="感兴趣">
				<view v-if="xq.list.length > 0 && ready">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in xq.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="detailTo(item.job.id)" />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无企业对简历感兴趣</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
			<van-tab title="邀面试">
				<view v-if="ms.list.length > 0 && ready">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in ms.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="inviteTo(item.id)" />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无接收到面试邀请</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
		</van-tabs>
		<van-tabs :active="3" :border="false" @click="onClick" v-else-if="tabs == 3">
			<van-tab title="全部">
				<view v-if="all.list.length > 0 && ready">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in all.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="detailTo(item.job.id)" v-if="item.state !== 5" />
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="inviteTo(item.id)" v-else />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无接收到反馈</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
			<van-tab title="已查阅">
				<view v-if="cy.list.length > 0 && ready">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in cy.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="detailTo(item.job.id)" />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无任何企业查看简历</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
			<van-tab title="感兴趣">
				<view v-if="xq.list.length > 0 && ready">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in xq.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="detailTo(item.job.id)" />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | working}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无企业对简历感兴趣</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
			<van-tab title="邀面试">
				<view v-if="ms.list.length > 0">
					<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in ms.list" :key="index">
						<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
						 @click="inviteTo(item.id)" />
						<van-cell :title="item.job.title" use-label-slot :border="false">
							<view class="lxk-price">
								<span v-if="item.job.salarystart && item.job.salaryend"> {{ item.job.salarystart / 10000 }}-{{ item.job.salaryend / 10000 }}万/月</span>
								<span v-else-if="item.job.salarystart">{{ item.job.salarystart.length > 4 ? item.job.salarystart / 10000 : item.job.salarystart }}
									{{ item.job.salarystart.length > 4 ? '万' : '千' }}/月</span>
								<span v-else-if="item.job.salaryend">{{ item.job.salaryend.length > 4 ? item.job.salaryend / 10000 : item.job.salaryend }}
									{{ item.job.salaryend.length > 4 ? '万' : '千' }}/月</span>
								<span v-else>面议</span>
								<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
								<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
							</view>
							<view slot="label">
								<view class="company">{{ item.job.company.name }}</view>
								<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2}}</view>
							</view>
						</van-cell>
					</van-cell-group>
				</view>
				<view class="lxk-add" v-else-if="ready">
					<view class="lxk-add-title">暂无接收到面试邀请</view>
					<view class="lxk-add-desc">你还可以去搜索职位并申请</view>
					<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
				</view>
			</van-tab>
		</van-tabs>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getJobApply,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				ready: false,
				active: 0,
				tabs: 0,
				all: {
					list: null,
					count: null,
					search: {
						page: 1,
						limit: 5
					}
				},
				cy: {
					list: null,
					count: null,
					search: {
						state: 2,
						page: 1,
						limit: 5
					}
				},
				xq: {
					list: null,
					count: null,
					search: {
						state: 3,
						page: 1,
						limit: 5
					}
				},
				ms: {
					list: null,
					count: null,
					search: {
						state: 4,
						page: 1,
						limit: 5
					}
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (e.active) {
				this.active = e.active
				this.tabs = e.active
			}
			this.getJobApply()
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getJobApply() {
				let t
				const s = parseFloat(this.active)
				if (s === 0) {
					t = this.all
				} else if (s === 1) {
					t = this.cy
				} else if (s === 2) {
					t = this.xq
				} else if (s === 3) {
					t = this.ms
				}
				getJobApply(t.search).then(response => {
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
						setTimeout(() => {
							uni.navigateBack();
						}, 1500)
					}
				})
			},
			refresher() {
				let t
				const s = parseFloat(this.active)
				if (s === 0) {
					t = this.all
				} else if (s === 1) {
					t = this.cy
				} else if (s === 2) {
					t = this.xq
				} else if (s === 3) {
					t = this.ms
				}
				if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getJobApply()
				} else {
					$wuxToast().hide()
					$wuxToast().show({
						type: 'forbidden',
						text: '已加载全部'
					})
				}
			},
			onClick(v) {
				let t
				const e = v.detail.name
				this.active = e
				if (e === 0) {
					t = this.all
				} else if (e === 1) {
					t = this.cy
				} else if (e === 2) {
					t = this.xq
				} else if (e === 3) {
					t = this.ms
				}
				if (!t.count && !t.list) {
					this.getJobApply()
				} else if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getJobApply()
				}
			},
			jobTo() {
				uni.switchTab({
					url: '/pages/job/index'
				});
			},
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/job/detail?id=' + id
				});
			},
			inviteTo(id) {
				uni.navigateTo({
					url: '/pages/job/invite?id=' + id
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxk-price {
		color: #ef473a;
	}

	/deep/ {
		.title-color-warning {
			color: $uni-color-warning;
		}

		.title-color-positive {
			color: $uni-color-positive;
		}

		.title-color-assertive {
			color: $uni-color-assertive;
		}

		.lxk-zw {
			margin: 10px 10px 0;
			overflow: hidden;
			border-radius: 5px;

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

	.lxk-add {
		padding-top: 40%;
		text-align: center;

		.lxk-add-title {
			font-size: 16px;
			margin: 20px auto 10px;
		}

		.lxk-add-desc {
			font-size: 12px;
			color: #C0C4CC;
			margin-bottom: 20px;
		}

		/deep/ {
			.wux-button--small {
				padding-left: 30px;
				padding-right: 30px;
			}
		}
	}
</style>
