<template>
	<view class="content">
		<van-field id="name" required label="姓名" :value="form.name" input-align="right" @change="onChange" />
		<view @click="onPicker('gender')">
			<van-field required label="性别" :value="form.gender | gender" input-align="right" disabled />
		</view>
		<view @click="onPicker('birthdate')">
			<van-field required label="出生日期" input-align="right" disabled v-if="!form.birthdate" />
			<van-field required label="出生日期" :value="!form.birthdate ? 0 : form.birthdate | parseTime('{y}-{m}-{d}')"
			 input-align="right" disabled v-else />
		</view>
		<van-field id="phone" type="number" required label="手机号码" :value="form.phone" input-align="right" @change="onChange" />
		<view @click="onPicker('jobstate')">
			<van-field required label="求职状态" :value="form.jobstate | jobstate" input-align="right" disabled />
		</view>
		<view @click="onPicker('startjob')">
			<van-field required label="开始工作年份" input-align="right" disabled v-if="!form.startjob" />
			<van-field required label="开始工作年份" :value="!form.startjob ? 0 : form.startjob | parseTime('{y}-{m}-{d}')"
			 input-align="right" disabled v-else />
		</view>
		<view @click="city.show = true">
			<van-field required label="居住地" :value="form.habitation" input-align="right" disabled />
		</view>
		<van-field id="emall" label="邮箱" :value="form.emall" input-align="right" @change="onChange" />
		<view @click="onPicker('idtype')">
			<van-field label="证件类型" :value="form.idtype | idtype" input-align="right" disabled />
		</view>
		<van-field id="idnumber" type="idcard" label="证件号" :value="form.idnumber" input-align="right" @change="onChange" />
		<van-field id="income" type="number" label="目前年收入" :value="form.income" input-align="right" @change="onChange" />
		<view @click="onPicker('marital')">
			<van-field label="婚姻状况" :value="form.marital | marital" input-align="right" disabled />
		</view>
		<view @click="onPicker('political')">
			<van-field label="政治面貌" :value="form.political | political" input-align="right" :border="false" disabled />
		</view>
		<view class="lxk-button">
			<wux-button block type="positive" @click="onSubmit">保存</wux-button>
			<wux-button block type="light" @click="Back">返回</wux-button>
		</view>
		<van-popup :show="show.gender" position="bottom" @close="show.gender = false" v-if="ready">
			<van-picker id="gender" show-toolbar title="性别" value-key="label" :columns="options.gender" @cancel="show.gender = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.jobstate" position="bottom" @close="show.jobstate = false" v-if="ready">
			<van-picker id="jobstate" show-toolbar title="求职状态" value-key="label" :columns="options.jobstate" @cancel="show.jobstate = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.marital" position="bottom" @close="show.marital = false" v-if="ready">
			<van-picker id="marital" show-toolbar title="婚姻状况" value-key="label" :columns="options.marital" @cancel="show.marital = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.political" position="bottom" @close="show.political = false" v-if="ready">
			<van-picker id="political" show-toolbar title="政治面貌" value-key="label" :columns="options.political" @cancel="show.political = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.idtype" position="bottom" @close="show.idtype = false" v-if="ready">
			<van-picker id="idtype" show-toolbar title="证件类型" value-key="label" :columns="options.idtype" @cancel="show.idtype = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.birthdate" position="bottom" @close="show.birthdate = false" v-if="ready">
			<van-datetime-picker id="birthdate" type="date" :value="options.birthdate" min-date="0" @cancel="show.birthdate = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<van-popup :show="show.startjob" position="bottom" @close="show.startjob = false" v-if="ready">
			<van-datetime-picker id="startjob" type="date" :value="options.startjob" min-date="0" @cancel="show.startjob = false"
			 @confirm="onOptionsChange" />
		</van-popup>
		<wux-cascader :visible="city.show" title="选择城市" :options="city.options" @close="city.show = false" @change="cityChange"
		 v-if="ready" />
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import citys from '@/utils/data'
	import {
		getRasumeBasic,
		upRasumeBasic,
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
				options: {
					gender: [{
						value: '1',
						label: '男性',
					}, {
						value: '2',
						label: '女性',
					}],
					birthdate: 631123200000,
					startjob: 1262275200000,
					jobstate: [{
						value: '1',
						label: '目前正在找工作',
					}, {
						value: '2',
						label: '观望有好机会会考虑',
					}, {
						value: '3',
						label: '我目前不想换工作',
					}],
					marital: [{
						value: '1',
						label: '未婚',
					}, {
						value: '2',
						label: '已婚',
					}, {
						value: '3',
						label: '保密',
					}],
					political: [{
						value: '1',
						label: '中共党员',
					}, {
						value: '2',
						label: '共青团员',
					}, {
						value: '3',
						label: '民主党派人士',
					}, {
						value: '4',
						label: '无党派人士',
					}, {
						value: '5',
						label: '普通公民',
					}],
					idtype: [{
						value: '1',
						label: '身份证',
					}, {
						value: '2',
						label: '护照',
					}, {
						value: '3',
						label: '军人证',
					}, {
						value: '4',
						label: '港澳居民来往内地通行证',
					}, {
						value: '5',
						label: '外国人永久居留身份证',
					}, {
						value: '6',
						label: '其他',
					}]
				},
				show: {
					gender: false,
					birthdate: false,
					jobstate: false,
					startjob: false,
					marital: false,
					political: false,
					idtype: false
				},
				form: {
					name: null,
					gender: null,
					birthdate: null,
					phone: null,
					jobstate: null,
					startjob: null,
					habitation: null,
					province: null,
					city: null,
					area: null,
					emall: null,
					idtype: null,
					idnumber: null,
					income: null,
					marital: false,
					political: false
				},
			}
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			if (this.$store.getters.member.resume) {
				this.getRasumeBasic()
			}
		},
		methods: {
			onChange(e) {
				let f = this.form
				let i = e.target.id
				let v = e.detail
				const reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g
				if (i === "name") {
					f.name = v.replace(reg, '')
				} else if (i === "phone") {
					f.phone = parseFloat(v.replace(reg, ''))
				} else if (i === "habitation") {
					f.habitation = v.replace(reg, '')
				} else if (i === "emall") {
					f.emall = v.replace(reg, '')
				} else if (i === "idnumber") {
					f.idnumber = v.replace(reg, '')
				} else if (i === "income") {
					f.income = parseFloat(v.replace(reg, ''))
				}
			},
			cityChange(e) {
				const c = e.detail.options.map((n) => n.label)
				this.form.habitation = c.join('/')
				const f = this.form
				if (c.length === 3) {
					f.province = c[0]
					f.city = c[1]
					f.area = c[2]
				} else if (c.length === 2) {
					f.province = c[0]
					f.city = c[1]
				} else if (c.length === 1) {
					f.province = c[0]
				}
			},
			onOptionsChange(e) {
				const i = e.target.id
				const d = e.detail
				const f = this.form
				const s = this.show
				if (i === 'gender') {
					f.gender = parseFloat(d.value.value)
					s.gender = false
				} else if (i === 'birthdate') {
					f.birthdate = d / 1000
					s.birthdate = false
				} else if (i === 'jobstate') {
					f.jobstate = parseFloat(d.value.value)
					s.jobstate = false
				} else if (i === 'startjob') {
					f.startjob = d / 1000
					s.startjob = false
				} else if (i === 'marital') {
					f.marital = parseFloat(d.value.value)
					s.marital = false
				} else if (i === 'political') {
					f.political = parseFloat(d.value.value)
					s.political = false
				} else if (i === 'idtype') {
					f.idtype = parseFloat(d.value.value)
					s.idtype = false
				}
			},
			onPicker(n) {
				const s = this.show
				if (n === 'gender') {
					s.gender = true
				} else if (n === 'birthdate') {
					s.birthdate = true
				} else if (n === 'jobstate') {
					s.jobstate = true
				} else if (n === 'startjob') {
					s.startjob = true
				} else if (n === 'marital') {
					s.marital = true
				} else if (n === 'political') {
					s.political = true
				} else if (n === 'idtype') {
					s.idtype = true
				}
			},
			onSubmit() {
				setTimeout(() => {
					const f = this.form
					if (!f.name) {
						this.forbiddenToast("姓名未填写")
						return false
					} else if (!f.gender) {
						this.forbiddenToast("性别未选择")
						return false
					} else if (!f.birthdate) {
						this.forbiddenToast("出生日期未选择")
						return false
					} else if (!f.phone) {
						this.forbiddenToast("手机号未填写")
						return false
					} else if (!f.jobstate) {
						this.forbiddenToast("求职状态未选择")
						return false
					} else if (!f.startjob) {
						this.forbiddenToast("工作年份未选择")
						return false
					} else if (!f.habitation) {
						this.forbiddenToast("居住地未填写")
						return false
					}
					const form = Object.assign({},
						f.name ? {
							name: f.name
						} : {},
						f.gender ? {
							gender: f.gender
						} : {},
						f.birthdate ? {
							birthdate: f.birthdate
						} : {},
						f.phone ? {
							phone: parseFloat(f.phone)
						} : {},
						f.jobstate ? {
							jobstate: f.jobstate
						} : {},
						f.startjob ? {
							startjob: f.startjob
						} : {},
						f.habitation ? {
							habitation: f.habitation
						} : {},
						f.province ? {
							province: f.province
						} : {},
						f.city ? {
							city: f.city
						} : {},
						f.area ? {
							area: f.area
						} : {},
						f.emall ? {
							emall: f.emall
						} : {},
						f.idtype ? {
							idtype: f.idtype
						} : {},
						f.idnumber ? {
							idnumber: f.idnumber
						} : {},
						f.income ? {
							income: f.income
						} : {},
						f.marital ? {
							marital: f.marital
						} : {},
						f.political ? {
							political: f.political
						} : {},
					);
					upRasumeBasic(form).then(response => {
						let r = response.data
						if (response.code === 20000) {
							if (r.up) {
								$wuxToast().show({
									type: 'success',
									text: '保存成功'
								})
								let me = this.$store.getters.member
								me.resume = true
								this.$store.commit('SET_MEMBER', me);
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
			getRasumeBasic() {
				getRasumeBasic().then(response => {
					let r = response.data
					if (response.code === 20000) {
						const f = this.form
						const d = r.detail
						f.name = d.name
						f.gender = d.gender
						f.birthdate = d.birthdate
						f.phone = d.phone
						f.jobstate = d.jobstate
						f.startjob = d.startjob
						f.habitation = d.habitation
						f.emall = d.emall
						f.idtype = d.info.idtype
						f.idnumber = d.info.idnumber
						f.income = d.info.income
						f.marital = d.info.marital
						f.political = d.info.political
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
