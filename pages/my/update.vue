<template>
	<view class="content">
		<view v-if="type === 1">
			<van-field required label="手机号码" :value="phone" input-align="right" disabled />
			<van-field required :value="form.code" id="code" type="number" label="验证码" use-button-slot @change="onChange">
				<van-button slot="button" size="mini" type="danger" plain @click="addCode" custom-class="lxk-button-code">{{ codes.state ? codes.text : codes.time }}</van-button>
			</van-field>
			<van-field id="phone" required label="新手机号码" input-align="right" @change="onChange" :border="false" />
			<view class="lxk-warning">*下次请使用新手机号登陆</view>
		</view>
		<view v-else-if="type === 2">
			<van-field required :value="form.pwd" id="pwd" type="password" label="设置密码" @change="onChange" />
			<van-field required :value="form.pwds" id="pwds" type="password" label="重复密码" :border="false" @change="onChange" />
		</view>
		<view v-else-if="type === 3">
			<van-field required :value="form.pwdu" id="pwdu" type="password" label="旧密码" @change="onChange" />
			<van-field required :value="form.pwd" id="pwd" type="password" label="新密码" @change="onChange" />
			<van-field required :value="form.pwds" id="pwds" type="password" label="重复密码" :border="false" @change="onChange" />
		</view>
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="Back">返回</wux-button>
		</view>
		<view class="list-warning">已开启安全防护，请放心使用</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getSecurityCode,
		upMember,
	} from '@/api/job'
	import {
		$wuxToast,
		$wuxCountDown
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				type: 0,
				phone: null,
				codes: {
					state: true,
					add: true,
					text: '发送验证码',
					time: '60秒'
				},
				form: {
					phone: null,
					code: null,
					pwd: null,
					pwdu: null,
					pwds: null
				},
			}
		},
		onLoad(e) {
			if (e.type) {
				if (e.phone) {
					this.phone = e.phone
				}
				const t = parseFloat(e.type)
				this.type = t
				this.upType(t)
			}
		},
		methods: {
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "phone") {
					f.phone = v.replace(reg, '')
				} else if (i === "pwd") {
					f.pwd = v.replace(reg, '')
				} else if (i === "pwds") {
					f.pwds = v.replace(reg, '')
				} else if (i === "pwdu") {
					f.pwdu = v.replace(reg, '')
				} else if (i === "code") {
					f.code = parseFloat(v.replace(reg, ''))
				}
			},
			upType(t) {
				if (t === 1) {
					uni.setNavigationBarTitle({
						title: '请填写新手机号码'
					});
				} else if (t === 2) {
					uni.setNavigationBarTitle({
						title: '设置登陆密码'
					});
				} else if (t === 3) {
					uni.setNavigationBarTitle({
						title: '更改登陆密码'
					});
				}
			},
			onSubmit() {
				setTimeout(() => {
					let s
					const f = this.form
					const t = this.type
					if (t === 1) {
						if (!f.phone) {
							this.forbiddenToast("手机未填写")
							return false
						} else if (f.phone.length !== 11) {
							this.forbiddenToast("手机号错误")
							return false
						}
						s = {
							phone: f.phone,
							code: f.code
						}
					} else if (t === 2) {
						if (!f.pwd) {
							this.forbiddenToast("密码未填写")
							return false
						} else if (!f.pwds) {
							this.forbiddenToast("在一次输入密码")
							return false
						} else if (f.pwd !== f.pwds) {
							this.forbiddenToast("输入密码不一致")
							return false
						}
						s = {
							pwd: f.pwd
						}
					} else if (t === 3) {
						if (!f.pwdu) {
							this.forbiddenToast("旧密码未填写")
							return false
						} else if (!f.pwd) {
							this.forbiddenToast("新密码未填写")
							return false
						} else if (!f.pwds) {
							this.forbiddenToast("在一次输入密码")
							return false
						} else if (f.pwd !== f.pwds) {
							this.forbiddenToast("输入密码不一致")
							return false
						}
						s = {
							pwdu: f.pwdu,
							pwd: f.pwd
						}
					}
					upMember(s).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.update) {
								$wuxToast().show({
									type: 'success',
									text: '保存成功'
								})
								setTimeout(() => {
									uni.navigateBack();
								}, 1000)
							} else {
								if (t === 1) {
									$wuxToast().show({
										type: 'forbidden',
										text: '手机或验证码错误'
									})
								} else if (t === 2) {
									$wuxToast().show({
										type: 'forbidden',
										text: '请稍后重试'
									})
								} else if (t === 3) {
									$wuxToast().show({
										type: 'forbidden',
										text: '旧密码错误'
									})
								}
							}
						} else {
							$wuxToast().show({
								type: 'forbidden',
								text: '请求异常'
							})
						}
					})
				}, 500)
			},
			forbiddenToast(text) {
				$wuxToast().show({
					type: 'forbidden',
					text: text
				})
			},
			addCode() {
				if (this.codes.add) {
					this.codes.add = false
					this.vcode()
				} else {
					$wuxToast().show({
						type: 'forbidden',
						text: '验证码已发送'
					})
				}
			},
			getSecurityCode() {
				const f = this.form
				getSecurityCode({
					phone: f.phone
				}).then(response => {
					const data = response.data
					if (data.code === 20000 && data.state) {
						$wuxToast().show({
							type: 'success',
							text: '验证码已发送'
						})
					}
				})
			},
			vcode() {
				const f = this.form
				if (!f.phone) {
					this.forbiddenToast("手机未填写")
					return false
				}
				if (this.codes.state) {
					this.getSecurityCode()
					const thes = this
					this.codes.state = false
					new $wuxCountDown({
						date: +(new Date()) + 60000,
						onEnd() {
							thes.codes.state = true
							thes.codes.add = true
							thes.codes.text = '重新获取'
							thes.codes.time = '60秒'
						},
						render(date) {
							const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
							if (date.sec !== 0) {
								thes.codes.time = sec
							}
						}
					})
				}
			},
			Back() {
				uni.navigateBack();
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

	.lxk-warning {
		font-size: 12px;
		color: #999;
		padding: 10px 15px;
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

	/deep/ {
		.lxk-button-code {
			width: 6em;
		}
	}
</style>
