<template>
	<view class="content">
		<view v-if="list.length > 0">
			<van-cell-group custom-class="margin-top-10 lxk-mq" :border="false" v-for="(item, index) in list" :key="index">
				<van-cell :title="item.company.name" use-label-slot :border="false" :icon="item.company.logo" @click="detailTo(item.company.id)">
					<view slot="label">
						{{ item.company.nature | nature }}｜{{ item.company.size | size }}｜在招职位 <span class="job-num">{{ item.company.job_num }}</span>个
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="lxk-add" v-else-if="ready">
			<van-icon name="/static/icon/mingqi.png" size="50px" />
			<view class="lxk-add-title">暂未关注任何企业</view>
			<view class="lxk-add-desc">去搜索并关注企业，以获取最新信息</view>
			<wux-button type="positive" @click="jobTo" size="small">去搜索</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getJobFocus,
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
			this.getJobFocus();
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getJobFocus() {
				const s = this.search
				const t = this
				let sl = this.showlist
				const search = Object.assign({}, {
					page: sl ? 1 : s.page,
					limit: sl ? 10 * s.page : s.limit,
				}, );
				getJobFocus(search).then(response => {
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
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/company/detail?id=' + id
				});
			},
			jobTo() {
				uni.switchTab({
					url: '/pages/company/index'
				});
			},
			refresher() {
				let t = this
				if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getJobFocus()
				} else {
					$wuxToast().hide()
					$wuxToast().show({
						type: 'forbidden',
						text: '已加载全部'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.job-num {
		font-size: 12px;
		color: #1a8afa;
		padding: 0 5px;
		font-weight: 700;
	}



	/deep/ {
		.lxk-mq {
			margin: 10px 10px 0;
			overflow: hidden;
			border-radius: 5px;

			.van-icon {
				font-size: 32px;
				padding-top: 21px;
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
