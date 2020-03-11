<template>
	<view class="content">
		<van-tabs animated :border="false" @click="onClick">
			<van-tab title="面试">
				<van-cell :title="item.title" is-link v-for="(item, index) in ms.list" :key="index" :border="ms.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="ms.list"/>
			</van-tab>
			<van-tab title="跳槽">
				<van-cell :title="item.title" is-link v-for="(item, index) in tc.list" :key="index" :border="tc.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="tc.list"/>
			</van-tab>
			<van-tab title="薪酬">
				<van-cell :title="item.title" is-link v-for="(item, index) in xc.list" :key="index" :border="xc.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="xc.list"/>
			</van-tab>
			<van-tab title="简历">
				<van-cell :title="item.title" is-link v-for="(item, index) in jl.list" :key="index" :border="jl.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="jl.list"/>
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
				ms: {
					list: null,
					count: null,
					search: {
						arctype: 1,
						count: true,
						page: 1,
						limit: 10
					}
				},
				tc: {
					list: null,
					count: null,
					search: {
						arctype: 2,
						count: true,
						page: 1,
						limit: 10
					}
				},
				xc: {
					list: null,
					count: null,
					search: {
						arctype: 3,
						count: true,
						page: 1,
						limit: 10
					}
				},
				jl: {
					list: null,
					count: null,
					search: {
						arctype: 4,
						count: true,
						page: 1,
						limit: 10
					}
				},
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
					t = this.ms
				} else if (s === 1) {
					t = this.tc
				} else if (s === 2) {
					t = this.xc
				} else if (s === 3) {
					t = this.jl
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
					t = this.ms
				} else if (s === 1) {
					t = this.tc
				} else if (s === 2) {
					t = this.xc
				} else if (s === 3) {
					t = this.jl
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
					t = this.ms
				} else if (e === 1) {
					t = this.tc
				} else if (e === 2) {
					t = this.xc
				} else if (e === 3) {
					t = this.jl
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
