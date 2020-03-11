<template>
	<view class="content">
		<van-cell :title="item.title" is-link v-for="(item, index) in list" :key="index" :border="list.length - 1 === index ? false : true"
		 @click="detailTo(item.id)" v-if="list"/>
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
				list: null,
				count: null,
				search: {
					arctype: 14,
					count: true,
					page: 1,
					limit: 10
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
				let t = this
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
				let t = this
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
			}
		}
	}
</script>
