<template>
	<view class="content">
		<b class="lxk-login-title">{{ code ? '欢迎登陆军优创就业' : '军优创就业密码登陆' }}</b>
		<view class="lxk-login-desc">{{ code ? '手机号未注册将自动注册，注册即代表同意服务条款' : '注册请使用短信登陆，手机号未注册将自动注册' }}</view>
		<van-field :value="form.phone" id="phone" type="number" label="手机号" @change="onChange" />
		<van-field :value="form.pwd" id="pwd" type="password" label="密码" :border="false" @change="onChange" v-if="!code" />
		<van-field :value="form.code" id="code" type="number" label="验证码" :border="false" use-button-slot @change="onChange"
		 v-else>
			<van-button slot="button" size="mini" type="danger" plain @click="addCode" custom-class="lxk-button-code">{{ codes.state ? codes.text : codes.time }}</van-button>
		</van-field>
		<wux-button block type="positive" @click="onSubmit">登陆</wux-button>
		<view class="lxk-login-footer">
			<span @click="codeState(1)" v-if="!code">短信登陆</span>
			<span @click="codeState(2)" v-else>密码登陆</span>
			<i @click="forgetTo">忘记密码</i>
		</view>
		<view class="list-warning">已开启安全防护，请放心使用</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		applogin,
		getLoginCode,
	} from '@/api/login'
	import {
		$wuxToast,
		$wuxCountDown
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				code: true,
				codes: {
					state: true,
					add: true,
					text: '发送验证码',
					time: '60秒'
				},
				form: {
					phone: null,
					pwd: null,
					code: null
				},
			}
		},
		onShow() {
			uni.hideKeyboard()
		},
		methods: {
			onChange(e) {
				const f = this.form
				const i = e.target.id
				const v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "phone") {
					f.phone = v.replace(reg, '')
				} else if (i === "pwd") {
					f.pwd = v.replace(reg, '')
				} else if (i === "code") {
					f.code = parseFloat(v.replace(reg, ''))
				}
			},
			codeState(e) {
				if (e === 1) {
					this.code = true
					this.form.pwd = null
				} else {
					this.code = false
					this.form.code = null
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.phone) {
						this.forbiddenToast("手机未填写")
						return false
					} else if (f.phone.length !== 11) {
						this.forbiddenToast("手机号错误")
						return false
					} else if (!f.pwd && !this.code) {
						this.forbiddenToast("密码未填写")
						return false
					} else if (!f.code && this.code) {
						this.forbiddenToast("验证码未填")
						return false
					}
					const form = Object.assign({},
						f.phone ? { phone: f.phone } : {},
						f.pwd ? { pwd: f.pwd } : {},
						f.code ? { code: f.code } : {},
					);
					applogin(form).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.register) {
								this.$store.dispatch('appLogin', {
									token: r.token,
									register: r.register,
									member: r.member
								})
								$wuxToast().show({
									type: 'success',
									text: '登陆成功'
								})
								setTimeout(() => {
									uni.switchTab({
										url: '/pages/index/index'
									});
								}, 1000)
							} else if (this.code) {
								$wuxToast().show({
									type: 'forbidden',
									text: '验证码错误'
								})
							} else if (!this.code) {
								$wuxToast().show({
									type: 'forbidden',
									text: '手机号或密码错误'
								})
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
			getLoginCode() {
				const f = this.form
				getLoginCode({
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
					this.getLoginCode()
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
			forgetTo() {
				uni.navigateTo({
					url: '/pages/login/forget'
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
		padding: 25% 30px 0;

		.lxk-login-title {
			font-size: 21px;
			margin-bottom: 10px;
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

		.lxk-login-desc {
			color: #999;
			font-size: 12px;
			margin-bottom: 20px;
		}

		.lxk-login-footer {
			margin-top: 20px;
			color: #387ef5;
			font-size: 12px;

			i {
				float: right;
			}
		}
	}

	/deep/ {
		.lxk-button-code {
			width: 6em;
		}
	}
</style>
