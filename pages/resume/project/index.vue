<template>
	<view class="content">
		<van-cell :title="item.name" use-label-slot @click="detailTo(item.id)" :border="list.length - 1 === index ? false : true"
		 v-for="(item, index) in list" :key="index" is-link v-if="list">
			<view slot="label">
				{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}
			</view>
		</van-cell>
		<view class="lxk-work-foot">
			<wux-button block type="positive" @click="addTo">新增工作经验</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getRasumeProject,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				list: null
			}
		},
		onShow(e) {
			uni.hideKeyboard()
			this.getRasumeProject()
		},
		methods: {
			getRasumeProject() {
				getRasumeProject().then(response => {
					let r = response.data
					if (response.code === 20000) {
						if (r.list.length > 0) {
							this.list = r.list
						} else {
							uni.navigateTo({
								url: '/pages/resume/project/add?list=2'
							});
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					}
				})
			},
			addTo() {
				uni.navigateTo({
					url: '/pages/resume/project/add'
				});
			},
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/resume/project/detail?id=' + id
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0;

		.lxk-work-foot {
			padding: 5px 15px;
		}
	}
</style>
