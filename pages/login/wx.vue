<template>
	<view class="content">
		<wux-button block type="balanced" openType="getPhoneNumber" lang="zh_CN" @getphonenumber="addLogin">微信授权登陆</wux-button>
		<wux-button block type="energized" @click="appTo">军优账户登陆</wux-button>
		<wux-button block type="light" @click="navigateBack">返回</wux-button>
		<view class="list-warning">已开启安全防护，请放心使用</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: null,
			}
		},
		onShow() {
			uni.hideKeyboard()
		},
		onLoad(e) {
			if (this.$store.getters.register) {
				uni.navigateBack();
			} else {
				const t = this
				uni.login({
					provider: 'weixin',
					success: res => {
						if (res.code) {
							t.code = res.code
						} else {
							uni.showToast({
								title: '微信授权失败,请重新授权',
								icon: 'none',
								duration: 2000
							})
						}
					}
				});
			}
		},
		methods: {
			addLogin(e) {
				const d = e.detail
				const s = this.$store
				const c = this.code
				let wxsys
				uni.getSystemInfo({
					success: res => {
						wxsys = res
					}
				});
				if (d.encryptedData && d.iv) {
					s.dispatch('Login', {
						code: c.trim(),
						systemInfo: wxsys,
						encryptedData: d.encryptedData,
						iv: d.iv
					}).then(res => {
						uni.navigateBack();
					})
				} else {
					uni.showToast({
						title: '微信授权失败,请重新授权',
						icon: 'none',
						duration: 2000
					})
				}
			},
			appTo() {
				// 跳转密码登陆页面
				uni.navigateTo({
					url: '/pages/login/app'
				});
			},
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 50% 30px 0;

		.list-warning {
			position: fixed;
			bottom: 15px;
			left: 0;
			right: 0;
			font-size: 12px;
			color: #C0C4CC;
			text-align: center;
		}
	}
</style>
