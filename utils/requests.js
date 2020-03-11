// Uni-app fly 接口封装

import store from '@/store'
// import { getToken } from '@/utils/auth'

const Fly = require('flyio/dist/npm/wx')
let tokenFly = new Fly()
tokenFly.config.baseURL = 'https://jy.baifanapi.com'

//添加请求拦截器
tokenFly.interceptors.request.use((config, promise) => {
	config.headers['X-Token'] = 'job'
	return config
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
// response 拦截器
tokenFly.interceptors.response.use(
	response => {
		const res = response.data
		if (res.code !== 20000) {
			return Promise.reject('error')
		} else {
			return response.data
		}
	},
	error => {
		return Promise.reject(error)
	}
)
export default tokenFly
