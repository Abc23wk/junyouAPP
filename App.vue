<script>
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			// 热更新
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			    uni.request({  
			        url: 'https://jy.baifanapi.com/job/app/update',  
			        data: {  
			            version: widgetInfo.version,  
			            name: widgetInfo.name  
			        },  
			        success: (result) => {  
			            var data = result.data.data;  
			            if (data.update && data.wgtUrl) {  
			                uni.downloadFile({  
			                    url: data.wgtUrl,  
			                    success: (downloadResult) => { 
			                        if (downloadResult.statusCode === 200) {  
			                            plus.runtime.install(downloadResult.tempFilePath, {  
			                                force: false  
			                            }, function() {  
			                                plus.runtime.restart();  
			                            }, function(e) {  
			                                uni.showModal({
			                                    title: '版本更新',
			                                    content: '检测到新版本',
												confirmText:'立即升级',
			                                	showCancel: false,
			                                    success: function (res) {
			                                        if (res.confirm) {
			                                            plus.runtime.openURL(data.pkgUrl);
			                                        }
			                                    }
			                                });  
			                            });  
			                        }  
			                    }  
			                });  
			            } else if  (data.update && data.pkgUrl) { 
							uni.showModal({
							    title: '版本更新',
							    content: '检测到新版本',
								confirmText:'立即升级',
								showCancel: false,
							    success: function (res) {
							        if (res.confirm) {
							            plus.runtime.openURL(data.pkgUrl);
							        }
							    }
							});
						}
			        }  
			    });  
			});
			if (this.$store.getters.token) {
				this.$store.dispatch('appLogins')
			}
			// #endif
			// #ifdef  MP-WEIXIN
			const s = this.$store
			if (s.getters.token) {
				// 发起登录请求
				s.dispatch('Logins')
			} else {
				uni.login({
					provider: 'weixin',
					success: res => {
						if (res.code) {
							// 发起登录请求
							s.dispatch('Login', {
								code: res.code.trim(),
							})
						} else {
							uni.showToast({
								title: '微信登录接口调用失败，请联系管理员修复',
								icon: 'none',
								duration: 2000
							})
						}
					}
				});
			}
			// #endif
		}
	}
</script>
<style>
	/*每个页面公共css */
	page {
		background: #f8f8f8;
	}

	.margin-top-10 {
		margin-top: 10px;
	}

	.van-tabbar-item {
		position: relative;
	}
</style>
