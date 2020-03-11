<template>
	<view class="content">
		<van-field id="description" required label="获得荣誉" :value="form.description" input-align="right" @change="onChange" />
		<view @click="onPicker('time')">
			<van-field required label="获得时间" input-align="right" disabled v-if="!form.time" />
			<van-field required label="获得时间" :value="!form.time ? 0 : form.time | parseTime('{y}-{m}')" input-align="right"
			 disabled v-else />
		</view>
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="Back">返回</wux-button>
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
		addRasumeHonor,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				to: 1,
				ready: false,
				options: {
					time: 1573026683000,
				},
				show: {
					time: false,
				},
				form: {
					time: null,
					description: null
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (e.list) {
				this.to = e.list
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
				console.log(d)
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
					const form = Object.assign({},
						f.description ? {
							description: f.description
						} : {},
						f.time ? {
							time: f.time
						} : {},
					);
					addRasumeHonor(form).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.add) {
								$wuxToast().show({
									type: 'success',
									text: '新增成功'
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
			Back() {
				if (this.to === 2) {
					uni.navigateBack({
						delta: 2
					});
				} else {
					uni.navigateBack();
				}
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
