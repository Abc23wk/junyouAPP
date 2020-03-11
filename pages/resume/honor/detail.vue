<template>
	<view class="content">
		<van-field id="description" required label="获得荣誉" :value="form.description" input-align="right" @change="onChange" />
		<view @click="onPicker('time')">
			<van-field required label="获得时间" :value="!form.time ? 0 : form.time | parseTime('{y}-{m}')" input-align="right"
			 disabled :border="false" />
		</view>
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="delRasumeHonorDetail">删除</wux-button>
		</view>
		<van-popup :show="show.time" position="bottom" @close="show.time = false" v-if="ready">
			<van-datetime-picker id="time" type="year-month" :value="options.time" min-date="0" @cancel="show.time = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getRasumeHonorDetail,
		delRasumeHonorDetail,
		upRasumeHonorDetail,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				ready: false,
				options: {
					time: 1573026683000,
				},
				show: {
					time: false,
				},
				form: {
					time: null,
					description: null,
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (e.id) {
				this.getRasumeHonorDetail(e.id)
				this.id = e.id
			}
		},
		methods: {
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "description") {
					f.description = v.replace(reg, '')
				}
			},
			onOptionsChange(e) {
				const i = e.target.id
				const d = e.detail
				const f = this.form
				const s = this.show
				if (i === 'time') {
					f.time = d / 1000
					s.time = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'time') {
					s.time = true
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.description) {
						this.forbiddenToast("荣誉描述未填")
						return false
					} else if (!f.time) {
						this.forbiddenToast("获得时间未选")
						return false
					}
					const form = Object.assign({}, {
							id: this.id
						},
						f.description ? {
							description: f.description
						} : {},
						f.time ? {
							time: f.time
						} : {},
					);
					upRasumeHonorDetail(form).then(response => {
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
			getRasumeHonorDetail(id) {
				getRasumeHonorDetail({
					id
				}).then(response => {
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
			delRasumeHonorDetail() {
				delRasumeHonorDetail({
					id: this.id
				}).then(response => {
					let r = response.data
					if (response.code === 20000) {
						if (r.del) {
							$wuxToast().show({
								type: 'success',
								text: '删除成功'
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								});
							}, 1000)
						}
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
