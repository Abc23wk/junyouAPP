<template>
	<view class="content">
		<view @click="onPicker('degree')">
			<van-field required label="学历" :value="form.degree | degree" input-align="right" disabled />
		</view>
		<van-field id="school" required label="学校" :value="form.school" input-align="right" @change="onChange" />
		<view @click="onPicker('start')">
			<van-field required label="入学时间" input-align="right" disabled v-if="!form.start" />
			<van-field required label="入学时间" :value="!form.start ? 0 : form.start | parseTime('{y}-{m}')" input-align="right"
			 disabled v-else />
		</view>
		<view @click="onPicker('end')">
			<van-field required label="毕业时间" input-align="right" disabled v-if="!form.end" />
			<van-field required label="毕业时间" :value="!form.end ? 0 : form.end | parseTime('{y}-{m}')" input-align="right"
			 disabled v-else />
		</view>
		<van-field id="major" required label="专业" :value="form.major" input-align="right" @change="onChange" />
		<van-field id="description" autosize type="textarea" label="专业描述" :value="form.description" input-align="right"
		 @change="onChange" :border="false" />
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="delRasumeEduDetail">删除</wux-button>
		</view>
		<van-popup :show="show.degree" position="bottom" @close="show.degree = false" v-if="ready">
			<van-picker id="degree" show-toolbar title="工作类型" value-key="label" :columns="options.degree" @cancel="show.degree = false"
			 @confirm="onOptionsChange" />
		</van-popup>
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
	import {
		getRasumeEduDetail,
		delRasumeEduDetail,
		upRasumeEduDetail,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				ready: false,
				options: {
					start: 1573026683000,
					end: 1573026683000,
					degree: [{
						value: '1',
						label: '初中及以下',
					}, {
						value: '2',
						label: '高中',
					}, {
						value: '3',
						label: '中技',
					}, {
						value: '4',
						label: '中专',
					}, {
						value: '5',
						label: '大专',
					}, {
						value: '6',
						label: '本科',
					}, {
						value: '7',
						label: '硕士',
					}, {
						value: '8',
						label: 'MBA',
					}, {
						value: '9',
						label: '博士',
					}],
				},
				show: {
					degree: false,
					start: false,
					end: false,
				},
				form: {
					degree: null,
					school: null,
					start: null,
					end: null,
					major: null,
					description: null
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (e.id) {
				this.getRasumeEduDetail(e.id)
				this.id = e.id
			}
		},
		methods: {
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "school") {
					f.school = v.replace(reg, '')
				} else if (i === "major") {
					f.major = v.replace(reg, '')
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
				} else if (i === 'degree') {
					f.degree = parseFloat(d.value.value)
					s.degree = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'start') {
					s.start = true
				} else if (n === 'end') {
					s.end = true
				} else if (n === 'degree') {
					s.degree = true
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.degree) {
						this.forbiddenToast("学历未选择")
						return false
					} else if (!f.school) {
						this.forbiddenToast("学校未填写")
						return false
					} else if (!f.start) {
						this.forbiddenToast("开始时间未选")
						return false
					} else if (!f.end) {
						this.forbiddenToast("结束时间未选")
						return false
					} else if (!f.major) {
						this.forbiddenToast("专业未填写")
						return false
					} else if (!f.description) {
						this.forbiddenToast("专业描述未填")
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
						f.degree ? {
							degree: f.degree
						} : {},
						f.school ? {
							school: f.school
						} : {},
						f.description ? {
							description: f.description
						} : {},
						f.major ? {
							major: f.major
						} : {},
					);
					upRasumeEduDetail(form).then(response => {
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
			getRasumeEduDetail(id) {
				getRasumeEduDetail({
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
			delRasumeEduDetail() {
				delRasumeEduDetail({
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
