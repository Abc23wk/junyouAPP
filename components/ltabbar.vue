<template>
	<van-tabbar :active="ltabbar" @change="onChange" :border="false">
		<van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
		<van-tabbar-item name="job" icon="user-o">职位</van-tabbar-item>
		<van-tabbar-item name="company" icon="hotel-o">名企</van-tabbar-item>
		<van-tabbar-item name="resume" icon="newspaper-o">简历</van-tabbar-item>
		<van-tabbar-item name="user" icon="user-circle-o">我的</van-tabbar-item>
	</van-tabbar>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: 'ltabbar',
		computed: {
			...mapGetters(['ltabbar'])
		},
		data() {
			return {
				active: 'home'
			};
		},
		methods: {
			onChange(event) {
				const e = event.detail;
				const s = this.$store
				if (e === 'home') {
					uni.switchTab({
						url: '/pages/index/index'
					});
				} else if (e === 'job') {
					uni.switchTab({
						url: '/pages/job/index'
					});
				} else if (e === 'resume') {
					if (s.getters.register) {
						if (s.getters.member.resume) {
							uni.switchTab({
								url: '/pages/resume/index'
							});
						} else {
							uni.navigateTo({
								url: '/pages/resume/basic'
							});
						}
					} else {
						// #ifdef APP-PLUS
						uni.navigateTo({
							url: '/pages/login/app'
						});
						// #endif
						// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: '/pages/login/wx'
						});
						// #endif
					}
				} else if (e === 'company') {
					uni.switchTab({
						url: '/pages/company/index'
					});
				} else if (e === 'user') {
					if (s.getters.register) {
						uni.switchTab({
							url: '/pages/my/index'
						});
					} else {
						// #ifdef APP-PLUS
						uni.navigateTo({
							url: '/pages/login/app'
						});
						// #endif
						// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: '/pages/login/wx'
						});
						// #endif
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ {
		.lxk-tabbar-button {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
	}
</style>
