<template>
	<view class="content">
		<van-cell title="手机号码" :value="detail.phone" is-link @click="updateTo(1)" />
		<van-cell title="更改密码" is-link v-if="detail.pwd" :border="false" @click="updateTo(3)" />
		<van-cell title="设置密码" is-link v-else :border="false" @click="updateTo(2)" />
		<view class="list-warning">已开启安全防护，请放心使用</view>
		<view class="lxk-button">
			<wux-button block type="light" @click="FedLogOut">退出登陆</wux-button>
		</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getSecurity,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				detail: null,
			}
		},
		onShow() {
			uni.hideKeyboard()
			this.getSecurity()
		},
		methods: {
			updateTo(i) {
				if (i === 1) {
					uni.navigateTo({
						url: '/pages/my/update?type=' + i +'&phone=' + this.detail.phone
					});
				} else {
					uni.navigateTo({
						url: '/pages/my/update?type=' + i
					});
				}
			},
			FedLogOut() {
				this.$store.dispatch('FedLogOut').then(res => {
					$wuxToast().show({
						type: 'success',
						text: '已退出登陆'
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 1000)
				})
			},
			getSecurity() {
				getSecurity().then(response => {
					let r = response.data
					if (response.code === 20000) {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxk-button {
		padding: 0 10px;
	}

	.content {
		padding-bottom: 20px;
	}

	.list-warning {
		position: fixed;
		bottom: 15px;
		left: 0;
		right: 0;
		font-size: 12px;
		color: #C0C4CC;
		text-align: center;
	}
</style>
