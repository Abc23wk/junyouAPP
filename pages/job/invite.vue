<template>
	<view class="content">
		<van-cell title="面试时间" :value="detail.invite | parseTime('{y}/{m}/{d} {h}:{i}')" />
		<van-cell title="联系人" :value="detail.name" />
		<van-cell title="手机号" :value="detail.phone" />
		<van-cell title="地址" :value="detail.address" />
		<van-cell title="注意事项" :border="false" :value="detail.demand" />
		<view class="lxk-button">
			<wux-button block type="light" @click="Back">返回</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getInvite,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				detail: {
					invite: 1573524563
				},
			}
		},
		onLoad(e) {
			this.getInvite(e.id)
		},
		methods: {
			getInvite(id) {
				getInvite({
					id
				}).then(response => {
					let r = response.data
					if (response.code === 20000 && r.detail) {
						this.detail = r.detail
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
			Back() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 20px;
	}
	.lxk-button {
		padding: 0 10px;
	}
</style>
