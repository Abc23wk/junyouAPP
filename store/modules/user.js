import {
	login,
	logins,
	applogins,
	upkey,
	getMemberAc
} from '@/api/login'
import {
	getToken,
	getMember,
	setToken,
	setMember,
	getAddress,
	setAddress,
	removeToken,
	removeMember
} from '@/utils/auth'

const user = {
	state: {
		ltabbar: 'home',
		token: getToken(),
		member: getMember(),
		address: getAddress() ? getAddress() : {
			province: null,
			city: null,
			area: null,
			citys: '全国',
		},
		register: false,
		audit: false
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},	
		SET_LTABBAR: (state, ltabbar) => {
			state.ltabbar = ltabbar
		},
		SET_MEMBER: (state, member) => {
			state.member = member
			setMember(member)
		},
		SET_ADDRESS: (state, address) => {
			state.address = address
			setAddress(address)
		},
		SET_AUDIT: (state, audit) => {
			state.audit = audit
		},
		SET_REGISTER: (state, register) => {
			state.register = register
		},
	},

	actions: {
		// 微信用户自动登录
		Login({ commit }, wx) {
			return new Promise((resolve, reject) => {
				login(wx).then(response => {
					const data = response.data
					if (data.token) {
						setToken(data.token)
						commit('SET_TOKEN', data.token)
					}
					if (data.member) {
						commit('SET_MEMBER', data.member)
					}
					if (data.register) {
						commit('SET_REGISTER', data.register)
					}
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		Logins({ commit }) {
			return new Promise((resolve, reject) => {
				logins().then(response => {
					const data = response.data
					if (data.token) {
						setToken(data.token)
						commit('SET_TOKEN', data.token)
					}
					if (data.member) {
						commit('SET_MEMBER', data.member)
					}
					if (data.register) {
						commit('SET_REGISTER', data.register)
					}
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// app用户登录
		appLogin({ commit }, app) {
			return new Promise(resolve => {
				setToken(app.token)
				if (app.member) {
					setMember(app.member)
					commit('SET_MEMBER', app.member)
				}
				commit('SET_TOKEN', app.token)
				commit('SET_REGISTER', app.register)
				resolve()
			})
		},
		appLogins({ commit }) {
			return new Promise((resolve, reject) => {
				applogins().then(response => {
					const data = response.data
					setToken(data.token)
					if (data.member) {
						setMember(data.member)
						commit('SET_MEMBER', data.member)
					}
					commit('SET_TOKEN', data.token)
					commit('SET_REGISTER', data.register)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		MemberAC({ commit }) {
			// 修改军人认证
			return new Promise((resolve, reject) => {
				getMemberAc().then(response => {
					const r = response.data
					let m = this.getters.member
					m.ac = r.detail.ac
					commit('SET_MEMBER', m)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},

		upKey({ commit }, wx) {
			return new Promise((resolve, reject) => {
				upkey(wx).then(response => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 销毁本地TOKEN
		FedLogOut({ commit }) {
			return new Promise(resolve => {
				commit('SET_TOKEN', '')
				commit('SET_REGISTER', false)
				removeToken()
				removeMember()
				resolve()
			})
		}
	}
}

export default user
