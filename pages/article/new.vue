<template>
	<view class="content">
		<van-tabs animated :border="false" @click="onClick">
			<van-tab title="公告">
				<van-cell :title="item.title" is-link v-for="(item, index) in gg.list" :key="index" :border="gg.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="gg.list"/>
			</van-tab>
			<van-tab title="企业">
				<van-cell :title="item.title" is-link v-for="(item, index) in qy.list" :key="index" :border="qy.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="qy.list"/>
			</van-tab>
			<van-tab title="行业">
				<van-cell :title="item.title" is-link v-for="(item, index) in hy.list" :key="index" :border="hy.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="hy.list"/>
			</van-tab>
		</van-tabs>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getArchives
	} from '@/api/job'
	import {
		$wuxToast
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				active: 0,
				gg: {
					list: null,
					count: null,
					search: {
						arctype: 5,
						count: true,
						page: 1,
						limit: 10
					}
				},
				qy: {
					list: null,
					count: null,
					search: {
						arctype: 6,
						count: true,
						page: 1,
						limit: 10
					}
				},
				hy: {
					list: null,
					count: null,
					search: {
						arctype: 7,
						count: true,
						page: 1,
						limit: 10
					}
				}
			}
		},
		onLoad() {
			this.getArchives()
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getArchives() {
				let t
				const s = this.active
				if (s === 0) {
					t = this.gg
				} else if (s === 1) {
					t = this.qy
				} else if (s === 2) {
					t = this.hy
				}
				getArchives(t.search).then(response => {
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
			detailTo(i) {
				uni.navigateTo({
					url: '/pages/article/detail?id=' + i
				});
			},
			refresher() {
				let t
				const s = this.active
				if (s === 0) {
					t = this.gg
				} else if (s === 1) {
					t = this.qy
				} else if (s === 2) {
					t = this.hy
				}
				if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getArchives()
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
					t = this.gg
				} else if (e === 1) {
					t = this.qy
				} else if (e === 2) {
					t = this.hy
				}
				if (!t.count && !t.list) {
					this.getArchives()
				} else if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getArchives()
				}
			}
		}
	}
</script>
