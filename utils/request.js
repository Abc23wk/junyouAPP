import store from '@/store'
// import { getToken } from '@/utils/auth'
const Fly = require('flyio/dist/npm/wx')
let fly = new Fly()
fly.config.baseURL = 'https://jy.baifanapi.com'
// fly.config.baseURL = 'http://127.0.0.1:7001'
fly.interceptors.request.use((request) => {
	if (!store.getters.token) {
		// #ifdef APP-PLUS
		uni.navigateTo({
			url: '/pages/login/app'
		});
		// #endif
		// #ifdef MP-WEIXIN
		if (store.getters.register) {
			fly.lock()
			let wxsys
			uni.getSystemInfo({
				success: res => {
					wxsys = res
				}
			});
			const code = new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: res => {
						resolve(res.code.trim())
					}
				});
			})
			return code.then(async (codes) => {
				await store.dispatch('Login', {
					code: codes,
					systemInfo: wxsys
				}).then(res => {
					request.headers['X-Token'] = res.token
				})
				return request;
			}).finally(() => {
				fly.unlock()
			})
		} else {
			// 跳转授权注册页面
			uni.navigateTo({
				url: '/pages/login/wx'
			});
		}
		// #endif
	} else {
		// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
		request.headers['X-Token'] = store.getters.token
		// #ifdef  MP-WEIXIN
		// uni.checkSession({
		// 	fail: () => {
		// 		uni.login({
		// 			provider: 'weixin',
		// 			success: res => {
		// 				store.dispatch('upKey', {
		// 					code: res.code.trim(),
		// 				})
		// 			}
		// 		});
		// 	}
		// });
		// #endif
	}
})
// response 拦截器
fly.interceptors.response.use(
	response => {
		/**
		 * code为非20000是抛错 可结合自己业务进行修改
		 */
		const res = response.data
		if (res.code !== 20000 && res.code === 40000) {
			// #ifdef APP-PLUS
			store.dispatch('FedLogOut')
			uni.navigateTo({
				url: '/pages/login/app'
			});
			// #endif
			// 销毁本地Token
			// #ifdef  MP-WEIXIN
			console.log(store.getters)
			if (store.getters.register) {
				fly.lock();
				let wxsys
				uni.getSystemInfo({
					success: res => {
						wxsys = res
					}
				});
				const code = new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: res => {
							resolve(res.code.trim())
						}
					});
				})
				return code.then(async (codes) => {
					await store.dispatch('FedLogOut')
					await store.dispatch('Login', {
						code: codes,
						systemInfo: wxsys
					}).then(res => {
						response.request.headers['X-Token'] = res.token
					})
				}).finally(() => {
					fly.unlock()
				}).then(() => {
					console.log(response)
					return fly.request(response.request)
				})
			} else {
				store.dispatch('FedLogOut')
			}
			// #endif
		} else if (res.code === 20000) {
			return response.data
		} else {
			return Promise.reject('error')
		}
	},
	error => {
		return Promise.reject(error)
	}
)
export default fly
