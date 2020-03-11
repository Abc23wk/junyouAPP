<template>
	<view class="content">
		<view class="lxk-title">{{ detail.title }}</view>
		<parser :html="detail.addon.body" class="lxk-body"></parser>
	</view>
</template>

<script>
	import {
		getArchivesDetail
	} from '@/api/job'
	import parser from "@/components/jyf-Parser/index"
	export default {
		components: {
		   parser
		 },
		data() {
			return {
				detail: null,
			}
		},
		onLoad(e) {
			this.getArchivesDetail(e.id)
		},
		methods: {
			getArchivesDetail(id) {
				getArchivesDetail({
					id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.detail = r.detail
						uni.setNavigationBarTitle({
						    title: r.detail.title
						});
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxk-title{
		font-size: 16px;
		padding: 10px 15px;
		background: #fff;
	}
	.lxk-body{
		font-size: 12px;
		padding: 10px 15px;
	}
</style>
