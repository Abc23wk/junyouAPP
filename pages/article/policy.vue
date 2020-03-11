<template>
	<view class="content">
		<van-tabs animated :border="false" @click="onClick">
			<van-tab title="退伍">
				<van-cell :title="item.title" is-link v-for="(item, index) in tw.list" :key="index" :border="tw.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="tw.list"/>
			</van-tab>
			<van-tab title="银行">
				<van-cell :title="item.title" is-link v-for="(item, index) in yh.list" :key="index" :border="yh.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="yh.list"/>
			</van-tab>
			<van-tab title="通讯">
				<van-cell :title="item.title" is-link v-for="(item, index) in tx.list" :key="index" :border="tx.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="tx.list"/>
			</van-tab>
			<van-tab title="酒店">
				<van-cell :title="item.title" is-link v-for="(item, index) in jd.list" :key="index" :border="jd.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="jd.list"/>
			</van-tab>
			<van-tab title="健康">
				<van-cell :title="item.title" is-link v-for="(item, index) in jk.list" :key="index" :border="jk.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="jk.list"/>
			</van-tab>
			<van-tab title="购物">
				<van-cell :title="item.title" is-link v-for="(item, index) in gw.list" :key="index" :border="gw.list.length - 1 === index ? false : true"
				 @click="detailTo(item.id)" v-if="gw.list"/>
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
				tw: {
					list: null,
					count: null,
					search: {
						arctype: 8,
						count: true,
						page: 1,
						limit: 10
					}
				},
				yh: {
					list: null,
					count: null,
					search: {
						arctype: 9,
						count: true,
						page: 1,
						limit: 10
					}
				},
				tx: {
					list: null,
					count: null,
					search: {
						arctype: 10,
						count: true,
						page: 1,
						limit: 10
					}
				},
				jd: {
					list: null,
					count: null,
					search: {
						arctype: 11,
						count: true,
						page: 1,
						limit: 10
					}
				},
				jk: {
					list: null,
					count: null,
					search: {
						arctype: 12,
						count: true,
						page: 1,
						limit: 10
					}
				},
				gw: {
					list: null,
					count: null,
					search: {
						arctype: 13,
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
					t = this.tw
				} else if (s === 1) {
					t = this.yh
				} else if (s === 2) {
					t = this.tx
				} else if (s === 3) {
					t = this.jd
				} else if (s === 4) {
					t = this.jk
				} else if (s === 5) {
					t = this.gw
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
					t = this.tw
				} else if (s === 1) {
					t = this.yh
				} else if (s === 2) {
					t = this.tx
				} else if (s === 3) {
					t = this.jd
				} else if (s === 4) {
					t = this.jk
				} else if (s === 5) {
					t = this.gw
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
					t = this.tw
				} else if (e === 1) {
					t = this.yh
				} else if (e === 2) {
					t = this.tx
				} else if (e === 3) {
					t = this.jd
				} else if (e === 4) {
					t = this.jk
				} else if (e === 5) {
					t = this.gw
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
