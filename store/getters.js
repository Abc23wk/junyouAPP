const getters = {
	
	token: state => state.user.token,
	ltabbar: state => state.user.ltabbar,//底部导航
	member: state => state.user.member,//军人认证
	address: state => state.user.address,//地址
	audit: state => state.user.audit,
	register: state => state.user.register //注册状态
}
export default getters
