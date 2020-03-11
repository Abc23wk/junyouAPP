<template>
	<view class="content">
		<view v-if="list.length > 0">
			<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in list" :key="index">
				<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
				 @click="detailTo(item.job.id)" v-if="item.state !== 4" />
				<van-cell :title="item.state | applyState" is-link :icon="item.state | applyIcon" :custom-class="item.state | applyClass"
				 @click="inviteTo(item.id)" v-else />
				<van-cell :title="item.job.title" use-label-slot :border="false">
					<view class="lxk-price">
						<span v-if="item.job.salarystart === 0 && item.job.salaryend === 0">面议</span>
						<span v-else-if="parseFloat(item.job.salarystart.toString().length) >= 4 && parseFloat(item.job.salaryend.toString().length) >= 4">
							{{ item.job.salarystart / 10000 | numFilter }}-{{ item.job.salaryend / 10000 | numFilter}}万/月
						</span>
						<span v-else-if="parseFloat(item.job.salarystart.toString().length) < 4 && parseFloat(item.job.salaryend.toString().length) < 4">
							{{ item.job.salarystart }}-{{ item.job.salaryend }}元/月
						</span>
						<view class="area">{{ item.job.city }}-{{ item.job.area }}</view>
						<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
					</view>
					<view slot="label">
						<view class="company">{{ item.job.company.name }}</view>
						<view class="demand">{{ item.job.company.nature | nature }}｜{{ !item.job.working ? 0 :  item.job.working | workings}}｜{{ !item.job.schooling ? 0 :  item.job.schooling | schooling2 }}</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="lxk-add" v-else-if="ready">
			<van-icon name="/static/icon/zhiwei.png" size="50px" />
			<view class="lxk-add-title">暂未申请任何职位</view>
			<view class="lxk-add-desc">你可以去搜索职位并申请</view>
			<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
		</view>
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
				list: null,
				count: null,
				search: {
					page: 1,
					limit: 10
				},
				showlist: false
			}
		},
		onReady() {
			this.ready = true
		},
		onShow() {
			this.showlist = true
			this.getJobApply();
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
				const s = this.search
				const t = this
				let sl = this.showlist
				const search = Object.assign({}, {
					page: sl ? 1 : s.page,
					limit: sl ? 10 * s.page : s.limit,
				}, );
				getJobApply(search).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.count = r.list.count
						if (t.list && t.list.length > 0 && !sl) {
							t.list = t.list.concat(r.list.rows)
						} else {
							sl = false
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
				let t = this
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
