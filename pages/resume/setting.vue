<template>
	<view class="content">
		<van-field id="title" required label="简历名称" :value="form.title" input-align="right" @change="onChange" />
		<view @click="onPicker('state')">
			<van-field required label="公开程度" :value="form.state | resumestate" input-align="right" disabled :border="false" />
		</view>
		<view class="lxk-button">
			<wux-button block type="balanced" @click="acTo" v-if="member.ac < 1">去认证</wux-button>
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
		</view>
		<van-popup :show="show.state" position="bottom" @close="show.state = false">
			<van-picker id="state" show-toolbar title="公开程度" value-key="label" :columns="options.state" @cancel="show.state = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getRasumeSetting,
		upRasumeSetting,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'member',
			])
		},
		data() {
			return {
				options: {
					state: [{
						value: '1',
						label: '军优公开',
					}, {
						value: '2',
						label: '完全公开',
					}, {
						value: '3',
						label: '完全保密',
					}],
				},
				show: {
					state: false,
				},
				form: {
					title: null,
					state: null,
				},
			}
		},
		onLoad(e) {
			this.getRasumeSetting()
		},
		methods: {
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "title") {
					f.title = v.replace(reg, '')
				}
			},
			onOptionsChange(e) {
				const i = e.target.id
				const d = e.detail.value.value
				const f = this.form
				const s = this.show
				if (i === 'state') {
					f.state = parseFloat(d)
					s.state = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'state') {
					s.state = true
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.title) {
						this.forbiddenToast("简历名称未填")
						return false
					} else if (!f.state) {
						this.forbiddenToast("公开程度未选")
						return false
					}
					const form = Object.assign({},
						f.title ? {
							title: f.title
						} : {},
						f.state ? {
							state: f.state
						} : {},
					);
					upRasumeSetting(form).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.up) {
								$wuxToast().show({
									type: 'success',
									text: '保存成功'
								})
								setTimeout(() => {
									uni.navigateBack();
								}, 1000)
							} else {
								$wuxToast().show({
									type: 'forbidden',
									text: '保存失败'
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
			getRasumeSetting() {
				getRasumeSetting().then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.form = r.detail
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					}
				})
			},
			acTo() {
				uni.navigateTo({
					url: '/pages/my/ac'
				});
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

	/deep/ {
		.van-field__input--disabled {
			color: #333;
			color: var(--text-color, #333);
		}
	}
</style>
