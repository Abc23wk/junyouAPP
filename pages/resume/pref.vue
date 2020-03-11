<template>
	<view class="content">
		<view @click="city.show = true">
			<van-field required label="地点" :value="form.location" input-align="right" disabled />
		</view>
		<van-field id="position" required label="职位" :value="form.position" input-align="right" @change="onChange" />
		<view @click="onPicker('salary')">
			<van-field required label="薪资范围" :value="form.salary | salary" input-align="right" disabled />
		</view>
		<view @click="onPicker('industry')">
			<van-field label="行业" :value="form.industry | industry" input-align="right" disabled />
		</view>
		<view @click="onPicker('type')">
			<van-field label="工作类型" :value="form.type | prefType" input-align="right" disabled />
		</view>
		<view @click="onPicker('arrival')">
			<van-field label="到岗时间" :value="form.arrival | arrival" input-align="right" disabled />
		</view>
		<van-field id="self" autosize type="textarea" label="个人评价" :value="form.self" input-align="right" @change="onChange"
		 :border="false" />
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="Back">返回</wux-button>
		</view>
		<van-popup :show="show.salary" position="bottom" @close="show.salary = false" v-if="ready">
			<van-picker id="salary" show-toolbar title="薪资范围" value-key="label" :columns="options.salary" @cancel="show.salary = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.type" position="bottom" @close="show.type = false" v-if="ready">
			<van-picker id="type" show-toolbar title="工作类型" value-key="label" :columns="options.type" @cancel="show.type = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.arrival" position="bottom" @close="show.arrival = false" v-if="ready">
			<van-picker id="arrival" show-toolbar title="到岗时间" value-key="label" :columns="options.arrival" @cancel="show.arrival = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.industry" position="bottom" @close="show.industry = false" v-if="ready">
			<van-picker id="industry" show-toolbar title="行业" :columns="options.industry" @cancel="show.industry = false"
			 @confirm="onOptionsChange" @change="onPickerChange" />
		</van-popup>
		<wux-cascader :visible="city.show" title="选择城市" :options="city.options" @close="city.show = false" @change="cityChange"
		 v-if="ready" />
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import citys from '@/utils/data'
	import industrys from '@/utils/items/industrys'
	import {
		getRasumePref,
		upRasumePref,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				ready: false,
				city: {
					show: false,
					options: citys
				},
				defaultFieldNames: {
					label: 'text',
					value: 'id',
					children: 'children'
				},
				options: {
					salary: [{
						value: '1',
						label: '2千以下',
					}, {
						value: '2',
						label: '2-3千',
					}, {
						value: '3',
						label: '3-4.5千',
					}, {
						value: '4',
						label: '4.5-6千',
					}, {
						value: '5',
						label: '6-8千',
					}, {
						value: '6',
						label: '0.8-1万',
					}, {
						value: '7',
						label: '1-1.5万',
					}, {
						value: '8',
						label: '1.5-2万',
					}, {
						value: '9',
						label: '3-4万',
					}, {
						value: '10',
						label: '4-5万',
					}, {
						value: '11',
						label: '5万以上',
					}],
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
					arrival: [{
						value: '1',
						label: '随时',
					}, {
						value: '2',
						label: '1周内',
					}, {
						value: '3',
						label: '1个月内',
					}, {
						value: '4',
						label: '3个月内',
					}, {
						value: '5',
						label: '待定',
					}],
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
					]
				},
				show: {
					salary: false,
					type: false,
					arrival: false,
					industry: false
				},
				form: {
					location: null,
					position: null,
					salary: null,
					type: null,
					arrival: null,
					self: null,
					industry: null
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (this.$store.getters.member.resume) {
				this.getRasumePref()
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
				if (i === "position") {
					f.position = v.replace(reg, '')
				} else if (i === "self") {
					f.self = v.replace(reg, '')
				}
			},
			cityChange(e) {
				this.form.location = e.detail.options.map((n) => n.label).join('/')
			},
			onOptionsChange(e) {
				const i = e.target.id
				const d = e.detail
				const f = this.form
				const s = this.show
				if (i === 'salary') {
					f.salary = parseFloat(d.value.value)
					s.salary = false
				} else if (i === 'type') {
					f.type = parseFloat(d.value.value)
					s.type = false
				} else if (i === 'arrival') {
					f.arrival = parseFloat(d.value.value)
					s.arrival = false
				} else if (i === 'industry') {
					f.industry = parseFloat(d.value[1].value)
					s.industry = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'salary') {
					s.salary = true
				} else if (n === 'type') {
					s.type = true
				} else if (n === 'arrival') {
					s.arrival = true
				} else if (n === 'industry') {
					s.industry = true
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.location) {
						this.forbiddenToast("地点未选择")
						return false
					} else if (!f.position) {
						this.forbiddenToast("职位未填写")
						return false
					} else if (!f.salary) {
						this.forbiddenToast("薪资未选择")
						return false
					}
					const form = Object.assign({},
						f.location ? {
							location: f.location
						} : {},
						f.position ? {
							position: f.position
						} : {},
						f.salary ? {
							salary: f.salary
						} : {},
						f.type ? {
							type: f.type
						} : {},
						f.industry ? {
							industry: f.industry
						} : {},
						f.arrival ? {
							arrival: f.arrival
						} : {},
						f.self ? {
							self: f.self
						} : {},
					);
					upRasumePref(form).then(response => {
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
			getRasumePref() {
				getRasumePref().then(response => {
					let r = response.data
					if (response.code === 20000) {
						const f = this.form
						const d = r.detail
						f.location = d.location
						f.position = d.position
						f.salary = d.salary
						f.type = d.info.type
						f.industry = d.info.industry
						f.arrival = d.info.arrival
						f.self = d.info.self
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
