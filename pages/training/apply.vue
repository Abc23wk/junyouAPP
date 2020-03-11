<template>
	<view class="content">
		<view v-if="list.length > 0">
			<van-cell-group custom-class="lxk-zw" :border="false" v-for="(item, index) in list" :key="index">
				<van-cell title="已报名" is-link icon="certificate" custom-class="title-color-positive" @click="detailTo(item.training.id)" />
				<van-cell :title="item.training.title" use-label-slot :border="false">
					<view class="lxk-price">
						<span> {{ item.training.cost > 0 ? item.training.cost : '免费' }}</span>
						<view class="area">已报名 <span class="job-num">{{ item.training.num }}</span>个</view>
						<view class="time">申请日期：{{ item.time | parseTime('{y}-{m}-{d}') }}</view>
					</view>
					<view slot="label" class="lxk-label">
						{{ item.training.type | trainingType }}｜{{ item.training.course }}节课程
						<view>培训时间：{{ item.training.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="lxk-add" v-else>
			<van-icon name="/static/icon/peixun.png" size="50px" />
			<view class="lxk-add-title">暂未报名任何培训</view>
			<view class="lxk-add-desc">去搜索并报名培训，来参加培训</view>
			<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getTrainingApplys,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				list: null,
				count: null,
				search: {
					page: 1,
					limit: 10
				},
			}
		},
		onShow() {
			uni.hideKeyboard()
			this.showlist = true
			this.getTrainingApplys();
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getTrainingApplys() {
				const s = this.search
				const t = this
				let sl = this.showlist
				const search = Object.assign({}, {
					page: sl ? 1 : s.page,
					limit: sl ? 10 * s.page : s.limit,
				}, );
				getTrainingApplys(search).then(response => {
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
					this.getTrainingApplys()
				} else {
					$wuxToast().hide()
					$wuxToast().show({
						type: 'forbidden',
						text: '已加载全部'
					})
				}
			},
			jobTo() {
				uni.navigateTo({
					url: '/pages/training/index'
				});
			},
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/training/detail?id=' + id
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxk-price {
		color: #ef473a;
	}

	.job-num {
		color: #1a8afa;
		padding: 0 5px;
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

		.lxk-label {
			line-height: 24px;
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

			.area {
				padding-top: 2px;
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
