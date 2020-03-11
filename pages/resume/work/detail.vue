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
		<van-field id="position" required label="职位" :value="form.position" input-align="right" @change="onChange" />
		<van-field id="description" required autosize type="textarea" label="工作描述" :value="form.description" input-align="right"
		 @change="onChange" />
		<view @click="onPicker('size')">
			<van-field label="公司规模" :value="form.size | size" input-align="right" disabled />
		</view>
		<view @click="onPicker('nature')">
			<van-field label="公司性质" :value="form.nature | nature" input-align="right" disabled />
		</view>
		<view @click="onPicker('industry')">
			<van-field label="公司行业" :value="form.industry | industry" input-align="right" disabled />
		</view>
		<view @click="onPicker('type')">
			<van-field label="工作类型" :value="form.type | prefType" input-align="right" disabled :border="false" />
		</view>
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="delRasumeWorkDetail">删除</wux-button>
		</view>
		<van-popup :show="show.industry" position="bottom" @close="show.industry = false" v-if="ready">
			<van-picker id="industry" show-toolbar title="行业" :columns="options.industry" @cancel="show.industry = false"
			 @confirm="onOptionsChange" @change="onPickerChange" />
		</van-popup>
		<van-popup :show="show.type" position="bottom" @close="show.type = false" v-if="ready">
			<van-picker id="type" show-toolbar title="工作类型" value-key="label" :columns="options.type" @cancel="show.type = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.size" position="bottom" @close="show.size = false" v-if="ready">
			<van-picker id="size" show-toolbar title="公司规模" :columns="options.size" @cancel="show.size = false" @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.nature" position="bottom" @close="show.nature = false" v-if="ready">
			<van-picker id="nature" show-toolbar title="公司性质" :columns="options.nature" @cancel="show.nature = false" @confirm="onOptionsChange" />
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
	import sizes from '@/utils/items/size'
	import natures from '@/utils/items/nature'
	import industrys from '@/utils/items/industrys'
	import {
		getRasumeWorkDetail,
		upRasumeWorkDetail,
		delRasumeWorkDetail,
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
					size: null,
					nature: null,
					industry: [{
							values: ['互联网/IT/电子/通信', '房地产', '金融业', '建筑业', '制造业', '农林牧渔', '批发/零售/贸易', '专业服务', '文化/体育/娱乐', '交通运输/仓储/物流',
								'能源/环保/矿产', '教育培训/科研', '卫生及社会工作', '公共管理/社会保障', '生活服务'
							],
							className: 'column1'
						},
						{
							values: [{
									text: '计算机软件',
									value: '1'
								},
								{
									text: '计算机硬件',
									value: '2'
								},
								{
									text: '企业服务',
									value: '3'
								},
								{
									text: '人工智能',
									value: '4'
								},
								{
									text: '通信/网络设备',
									value: '5'
								},
								{
									text: '网络/信息安全',
									value: '6'
								},
								{
									text: '新媒体',
									value: '7'
								},
								{
									text: '游戏',
									value: '8'
								},
								{
									text: '云计算/大数据',
									value: '9'
								}
							],
							className: 'column2'
						}
					],
					type: [{
						value: '1',
						label: '全职',
					}, {
						value: '2',
						label: '兼职',
					}, {
						value: '3',
						label: '实习',
					}],
				},
				show: {
					start: false,
					end: false,
					size: false,
					nature: false,
					type: false,
					industry: false,
				},
				form: {
					start: null,
					end: null,
					company: null,
					position: null,
					description: null,
					size: null,
					nature: null,
					industry: null,
					type: null
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			let o = this.options
			sizes.pop()
			o.size = sizes
			natures.pop()
			o.nature = natures
			if (e.id) {
				this.getRasumeWorkDetail(e.id)
				this.id = e.id
			}
		},
		methods: {
			onPickerChange(event) {
				const {
					picker,
					value,
					index
				} = event.detail;
				picker.setColumnValues(1, industrys[value[0]]);
			},
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "company") {
					f.company = v.replace(reg, '')
				} else if (i === "position") {
					f.position = v.replace(reg, '')
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
				} else if (i === 'size') {
					f.size = parseFloat(d.value.id)
					s.size = false
				} else if (i === 'nature') {
					f.nature = parseFloat(d.value.id)
					s.nature = false
				} else if (i === 'type') {
					f.type = parseFloat(d.value.value)
					s.type = false
				} else if (i === 'industry') {
					f.industry = parseFloat(d.value[1].value)
					s.industry = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'start') {
					s.start = true
				} else if (n === 'end') {
					s.end = true
				} else if (n === 'size') {
					s.size = true
				} else if (n === 'nature') {
					s.nature = true
				} else if (n === 'type') {
					s.type = true
				} else if (n === 'industry') {
					s.industry = true
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
					} else if (!f.position) {
						this.forbiddenToast("职位未填写")
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
						f.position ? {
							position: f.position
						} : {},
						f.description ? {
							description: f.description
						} : {},
						f.industry ? {
							industry: f.industry
						} : {},
						f.size ? {
							size: f.size
						} : {},
						f.nature ? {
							nature: f.nature
						} : {},
						f.type ? {
							type: f.type
						} : {},
					);
					upRasumeWorkDetail(form).then(response => {
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
			getRasumeWorkDetail(id) {
				getRasumeWorkDetail({
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
			delRasumeWorkDetail() {
				delRasumeWorkDetail({
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
