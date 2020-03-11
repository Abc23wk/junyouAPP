<template>
	<view class="content">
		<view class="lxk-head">
			<van-search :value="search.value" use-action-slot shape="round" placeholder="搜索培训" @search="getSearch">
				<view slot="label">
					<span class="search-label" @click="city.show = true">{{ address.citys }}</span>
				</view>
			</van-search>
			<van-tabbar :active="filter.active" :border="false" :fixed="false" @change="onChange">
				<van-tabbar-item>{{ search.type | trainingType }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
				<van-tabbar-item>{{ search.time | trainingTime }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
			</van-tabbar>
		</view>
		<view v-if="list.length > 0">
			<van-cell-group custom-class="margin-top-10 lxk-zw" :border="false">
				<van-cell use-label-slot @click="detailTo(item.id)" :border="list.length - 1 === index ? false : true" v-for="(item, index) in list"
				 :key="index">
					<view slot="title">
						{{ item.title }}
						<span class="lxk-price">
							{{ item.cost > 0 ? item.cost : '免费' }}
						</span>
					</view>
					<view slot="label">
						{{ item.type | trainingType }}｜{{ item.course }}节课程｜已报名 <span class="job-num">{{ item.num }}</span>个
						<view>培训时间：{{ item.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="lxk-add" v-else-if="ready">
			<van-icon name="/static/icon/peixun.png" size="50px" />
			<view class="lxk-add-title">暂无培训安排</view>
			<view class="lxk-add-desc">你可以换个地区或更换培训名称搜索</view>
		</view>
		<van-popup :show="filter.type.show" position="top" close-on-click-overlay @close="filterClose('type')" custom-class='lxk-popup'
		 v-if="ready">
			<view class="lxk-popup-content">
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.type.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.type.text === item.text ? 'positive' : 'stable'"
						 @click="filterClick(item.text,item.id,'type')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upType">确定</wux-button>
			</view>
		</van-popup>
		<van-popup :show="filter.time.show" position="top" close-on-click-overlay @close="filterClose('time')" custom-class='lxk-popup'
		 v-if="ready">
			<view class="lxk-popup-content">
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.time.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.time.text === item.text ? 'positive' : 'stable'"
						 @click="filterClick(item.text,item.id,'time')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upTime">确定</wux-button>
			</view>
		</van-popup>
		<wux-cascader :visible="city.show" title="选择城市" :options="city.options" @close="city.show = false" @change="editCity"
		 v-if="ready" />
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getTraining,
	} from '@/api/job'
	import citys from '@/utils/data'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'address',
			])
		},
		data() {
			return {
				ready: false,
				filter: {
					active: null,
					type: {
						items: [{
								text: '上岗培训',
								id: 1,
							},
							{
								text: '就业培训',
								id: 2,
							},
							{
								text: '学历培训',
								id: 3
							},
							{
								text: '不限',
								id: 0,
							}
						],
						show: false,
						text: null,
						id: null,
					},
					time: {
						items: [{
								text: '近三天',
								id: 3,
							},
							{
								text: '近一周',
								id: 7,
							},
							{
								text: '近一月',
								id: 30
							},
							{
								text: '不限',
								id: 0,
							}
						],
						show: false,
						text: null,
						id: null,
					},
				},
				list: null,
				count: null,
				search: {
					time: 0,
					type: 0,
					count: true,
					page: 1,
					limit: 10
				},
				locations: {
					province: null,
					city: null,
					area: null,
					citys: '全国',
				},
				city: {
					show: false,
					options: citys
				},
				showlist: false
			}
		},
		onReady() {
			this.ready = true
		},
		onShow() {
			this.showlist = true
			this.getTraining();
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getTraining() {
				const s = this.search
				const t = this
				const a = this.address
				let sl = this.showlist
				const search = Object.assign({}, {
						count: s.count,
						page: sl ? 1 : s.page,
						limit: sl ? 10 * s.page : s.limit,
					},
					s.time ? {
						time: s.time
					} : {},
					s.type ? {
						type: s.type
					} : {},
					s.value ? {
						value: s.value
					} : {},
					a.province ? {
						province: a.province
					} : {},
					a.city ? {
						city: a.city
					} : {},
					a.area ? {
						area: a.area
					} : {},
				);
				getTraining(search).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.count = r.list.count
						if (t.list && t.list.length > 0 && !sl) {
							t.list = t.list.concat(r.list.rows)
						} else {
							sl = false
							t.list = r.list.rows
						}
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			refresher() {
				let t = this
				if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getTraining()
				} else {
					$wuxToast().hide()
					$wuxToast().show({
						type: 'forbidden',
						text: '已加载全部'
					})
				}
			},
			editCity(e) {
				let s = this.locations
				let address = e.detail.options.map((n) => n.label)
				let arr = e.detail.options.map((n) => n.label)
				if (arr.length === 1) {
					s.citys = address[0]
				} else if (arr.length === 2) {
					s.citys = address[1]
				} else if (arr.length === 3) {
					s.citys = address[2]
				}
				s.province = arr[0]
				s.city = arr[1]
				s.area = arr[2]
				this.$store.commit('SET_ADDRESS', s)
				this.list = null
				this.getTraining()
			},
			filterClose(n) {
				let f
				if (n === 'type') {
					f = this.filter.type
				} else if (n === 'time') {
					f = this.filter.time
				}
				f.show = false
				this.filter.active = null
			},
			filterClick(t, i, n) {
				let p
				if (n === 'type') {
					p = this.filter.type
				} else if (n === 'time') {
					p = this.filter.time
				}
				p.text = t
				p.id = i
			},
			upType() {
				const f = this.filter
				this.search.type = f.type.id ? f.type.id : 0
				f.active = null
				f.type.show = false
				this.list = null
				this.getTraining()
			},
			upTime() {
				const f = this.filter
				this.search.time = f.time.id ? f.time.id : 0
				f.active = null
				f.time.show = false
				this.list = null
				this.getTraining()
			},
			onChange(e) {
				const d = e.detail
				const f = this.filter
				f.active = d
				f.type.show = d === 0 ? true : false
				f.time.show = d === 1 ? true : false
			},
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/training/detail?id=' + id
				});
			},
			getSearch(e) {
				setTimeout(() => {
					this.search.value = e.detail
					this.list = null
					this.getTraining()
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 80px 0 0;
	}

	.search-label {
		padding: 0 10px;
		margin-right: 10px;
		color: #323233;
		font-size: 14px;
		line-height: 34px;
		position: relative;

		&:after {
			content: '';
			background: #fff;
			position: absolute;
			width: 1px;
			top: 0;
			bottom: 0;
			right: 0;
		}
	}

	.job-num {
		font-size: 12px;
		color: #1a8afa;
		padding: 0 5px;
		font-weight: 700;
	}

	.lxk-price {
		color: #ef473a;
		float: right;
	}

	.lxk-popup-title {
		font-size: 12px;
	}

	.lxk-popup-content {
		padding: 10px;
	}

	.lxk-head {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 101;
		border-bottom: 1px solid #f8f8f8;
	}

	/deep/ {
		.lxk-zw {

			.time,
			.demand {
				font-size: 12px;
				color: #999;
				line-height: 24px;
			}

			.company,
			.area {
				font-size: 12px;
				color: #666;
				line-height: 24px;
			}
		}

		.popup-button {
			.wux-button {
				margin: 0;
				border-radius: 0;
			}
		}

		.lxk-head {
			.van-search {
				padding-bottom: 0;
			}

			.van-tabbar {
				height: 40px;
			}
		}

		.lxk-popup {
			padding: 85px 0 0;
		}

		.lxl-filter {
			margin-left: 5px;
			transform: rotate(90deg);
		}
	}

	.lxk-add {
		padding-top: 40%;
		text-align: center;

		.lxk-add-title {
			font-size: 16px;
			margin: 20px auto 10px;
		}

		.lxk-add-desc {
			font-size: 12px;
			color: #C0C4CC;
			margin-bottom: 20px;
		}

		/deep/ {
			.wux-button--small {
				padding-left: 30px;
				padding-right: 30px;
			}
		}
	}
</style>
