<template>
	<view class="content">
		<view @click="onPicker('start')">
			<van-field required label="开始时间" input-align="right" disabled v-if="!form.start" />
			<van-field required label="开始时间" :value="!form.start ? 0 : form.start | parseTime('{y}-{m}')" input-align="right"
			 disabled v-else />
		</view>
		<view @click="onPicker('end')">
			<van-field required label="结束时间" input-align="right" disabled v-if="!form.end" />
			<van-field required label="结束时间" :value="!form.end ? 0 : form.end | parseTime('{y}-{m}')" input-align="right"
			 disabled v-else />
		</view>
		<van-field id="company" required label="公司" :value="form.company" input-align="right" @change="onChange" />
		<van-field id="name" required label="项目名称" :value="form.name" input-align="right" @change="onChange" />
		<van-field id="description" required autosize type="textarea" label="项目描述" :value="form.description" input-align="right"
		 @change="onChange" :border="false" />
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="delRasumeProjectDetail">删除</wux-button>
		</view>
		<van-popup :show="show.start" position="bottom" @close="show.start = false" v-if="ready">
			<van-datetime-picker id="start" type="year-month" :value="options.start" min-date="0" @cancel="show.start = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.end" position="bottom" @close="show.end = false" v-if="ready">
			<van-datetime-picker id="end" type="year-month" :value="options.end" min-date="0" @cancel="show.end = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import sizes from '@/utils/items/size'
	import natures from '@/utils/items/nature'
	import industrys from '@/utils/items/industry'
	import {
		getRasumeProjectDetail,
		upRasumeProjectDetail,
		delRasumeProjectDetail,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				id: null,
				ready: false,
				options: {
					start: 1573026683000,
					end: 1573026683000,
				},
				show: {
					start: false,
					end: false
				},
				form: {
					start: null,
					end: null,
					company: null,
					name: null,
					description: null
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (e.id) {
				this.getRasumeProjectDetail(e.id)
				this.id = e.id
			}
		},
		methods: {
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "company") {
					f.company = v.replace(reg, '')
				} else if (i === "name") {
					f.name = v.replace(reg, '')
				} else if (i === "description") {
					f.description = v.replace(reg, '')
				}
			},
			onOptionsChange(e) {
				const i = e.target.id
				const d = e.detail
				const f = this.form
				const s = this.show
				if (i === 'start') {
					f.start = d / 1000
					s.start = false
				} else if (i === 'end') {
					f.end = d / 1000
					s.end = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'start') {
					s.start = true
				} else if (n === 'end') {
					s.end = true
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.start) {
						this.forbiddenToast("开始时间未选")
						return false
					} else if (!f.end) {
						this.forbiddenToast("结束时间未选")
						return false
					} else if (!f.company) {
						this.forbiddenToast("公司未填写")
						return false
					} else if (!f.name) {
						this.forbiddenToast("项目名称未填")
						return false
					} else if (!f.description) {
						this.forbiddenToast("工作描述未填")
						return false
					}
					const form = Object.assign({}, {
							id: this.id
						},
						f.start ? {
							start: f.start
						} : {},
						f.end ? {
							end: f.end
						} : {},
						f.company ? {
							company: f.company
						} : {},
						f.name ? {
							name: f.name
						} : {},
						f.description ? {
							description: f.description
						} : {}
					);
					upRasumeProjectDetail(form).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.up) {
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
			getRasumeProjectDetail(id) {
				getRasumeProjectDetail({
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
			delRasumeProjectDetail() {
				delRasumeProjectDetail({
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

	/deep/ {
		.van-field__input--disabled {
			color: #333;
			color: var(--text-color, #333);
		}
	}
</style>
