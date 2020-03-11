<template>
	<view class="content">
		<van-field id="idname" required label="真实姓名" :value="form.idname" input-align="right" @change="onChange" :disabled='ac === 1 ? true : false' />
		<van-field id="idnumber" required type="idcard" label="身份证" :value="form.idnumber" input-align="right" @change="onChange"
		 :border="false" :disabled='ac === 1 ? true : false' />
		<view class="lxk-ac" @click="stsToken">
			<wux-upload wux-class="lxk-ac-upload" listType="picture-card" :defaultFileList="fileList" max="1" count='1' url="https://gw-1300511476.cos.ap-guangzhou.myqcloud.com"
			 :formData="cos" @success="uploadSuccess" :disabled='ac === 1 ? true : false'>
				<text>{{ ac === 1 ? '退伍军人证明审核中' : '上传退伍军人证明' }}</text>
			</wux-upload>
			*证明只用于身份审核
		</view>
		<view class="lxk-button">
			<wux-button block type="positive" v-if="ac === 1" disabled>认证中</wux-button>
			<wux-button block type="positive" @click="onSubmit" v-else>{{ ac === 0 ? '认证' : '更新认证资料' }}</wux-button>
			<wux-button block type="light" @click="Back">返回</wux-button>
		</view>
		<view class="list-warning">已开启安全防护，请放心使用</view>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		stsToken,
		getMemberAc,
		updateMemberAc,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				fileList: [],
				url: 'https://gw-1300511476.cos.ap-guangzhou.myqcloud.com/',
				cos: null,
				ac: 0,
				form: {
					idname: null,
					idnumber: null,
					acUrl: null
				},
			}
		},
		onLoad() {
			this.getMemberAc()
		},
		methods: {
			getMemberAc() {
				getMemberAc().then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.form = r.detail.info
						this.ac = r.detail.ac
						this.fileList = [{
							uid: 1,
							status: 'done',
							url: '' + r.detail.info.acUrl + '',
						}]
						let m = this.$store.getters.member
						if (r.detail.ac > 1) {
							m.ac = r.detail.ac
							this.$store.commit('SET_MEMBER', m)
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			stsToken() {
				stsToken().then(response => {
					let r = response.data
					if (response.code === 20000) {
						const date = new Date()
						const year = date.getFullYear()
						const month = date.getMonth() + 1
						const day = date.getDate()
						const name = Math.random().toString(36).substr(2, 6) + '.png'
						const times = 'ac/' + year + '/' + month + '/' + day + '/'
						this.cos = r
						this.cos.key = times + name
						if (response.url) {
							this.url = response.url
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "idname") {
					f.idname = v.replace(reg, '')
				} else if (i === "idnumber") {
					f.idnumber = v.replace(reg, '')
				}
			},
			uploadSuccess() {
				const url = 'https://gw-1300511476.cos.ap-guangzhou.myqcloud.com/' + this.cos.key
				this.form.acUrl = url
			},
			removeFile() {
				this.fileList = []
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.idname) {
						this.forbiddenToast("真实姓名未填写")
						return false
					} else if (!f.idnumber) {
						this.forbiddenToast("身份证未填写")
						return false
					} else if (!f.acUrl) {
						this.forbiddenToast("退伍证明未上传")
						return false
					}
					const form = Object.assign({},
						f.idname ? {
							idname: f.idname
						} : {},
						f.idnumber ? {
							idnumber: f.idnumber
						} : {},
						f.acUrl ? {
							acUrl: f.acUrl
						} : {},
					);
					updateMemberAc(form).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.update) {
								this.$store.dispatch('MemberAC')
								$wuxToast().show({
									type: 'success',
									text: '已提交'
								})
								setTimeout(() => {
									uni.navigateBack();
								}, 1000)
							} else {
								$wuxToast().show({
									type: 'forbidden',
									text: '提交失败'
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

	.lxk-ac {
		margin-top: 10px;
		padding: 10px;
		font-size: 12px;
		color: #999;
		background: #fff;
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
		.van-field__input--disabled {
			color: #333;
			color: var(--text-color, #333);
		}

		.lxk-ac-upload {
			.wux-upload__files {
				width: 100%;

				.wux-upload__file {
					width: 100%;
					height: 150px;
				}

				.wux-upload__select {
					width: 100%;
					height: 150px;
				}
			}
		}
	}
</style>
