const TokenKey = 'Token'
const MemberKey = 'member'
const AddressKey = 'address'

// 缓存token
export function setToken(token) {
	return uni.setStorage({
		key: TokenKey,
		data: token,
	});
}
// 获取token
export function getToken() {
	return uni.getStorageSync(TokenKey);
}
// 移除token
export function removeToken() {
	return uni.removeStorageSync(TokenKey);
}

// 缓存退伍军人认证
export function setMember(member) {
	return uni.setStorage({
		key: MemberKey,
		data: member,
	});
}
export function getMember() {
	return uni.getStorageSync(MemberKey);
}
export function removeMember() {
	return uni.removeStorageSync(MemberKey);
}

// 缓存地址
export function setAddress(address) {
	return uni.setStorage({
		key: AddressKey,
		data: address,
	});
}
export function getAddress() {
	return uni.getStorageSync(AddressKey);
}



