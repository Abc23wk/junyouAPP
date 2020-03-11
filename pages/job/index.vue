<template>
	<view class="content">
		<view class="lxk-head">
			<van-search :value="search.value" use-action-slot shape="round" placeholder="搜索职位" @search="getSearch">
				<view slot="label">
					<span class="search-label" @click="city.show = true">{{ address.citys }}</span>
				</view>
			</van-search>
			<van-tabbar :active="filter.active" :border="false" :fixed="false" @change="onChange">
				<van-tabbar-item>{{ search.industry ? filter.industry.text.substr(0,4) :'全部行业' }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
				<van-tabbar-item>{{ search.salary ? '' : '薪资范围' }}
					<template v-if="filter.salary.value < 10 && search.salary">
						{{ filter.salary.value }} {{ filter.salary.value ? '千以上' : '' }}
					</template>
					<template v-else-if="filter.salary.value >= 10 && search.salary">
						{{ filter.salary.value / 10 }} 万以上
					</template>
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
				<van-tabbar-item>{{ search.publish | publish }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
				<van-tabbar-item>更多
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
			</van-tabbar>
		</view>
		<view v-if="list.length > 0">
			<van-cell-group custom-class="margin-top-10 lxk-zw" :border="false" >
				<van-cell :title="item.title" use-label-slot @click="detailTo(item.id)" :border="list.length - 1 === index ? false : true"
				 v-for="(item, index) in list" :key="index">
					<view class="lxk-price">
						<span v-if="item.salarystart === 0 && item.salaryend === 0">面议</span>
						<span v-else-if="parseFloat(item.salarystart.toString().length) >= 4 && parseFloat(item.salaryend.toString().length) >= 4">
							{{ item.salarystart / 10000 | numFilter }}-{{ item.salaryend / 10000 | numFilter}}万/月
						</span>
						<span v-else-if="parseFloat(item.salarystart.toString().length) < 4 && parseFloat(item.salaryend.toString().length) < 4">
							{{ item.salarystart }}-{{ item.salaryend }}元/月
						</span>
						<view class="area">{{ item.city }}-{{ item.area }}</view>
						<view class="time">
							<wux-timeago :to="item.pubdate * 1000" lang="zh_CN" />
						</view>
					</view>
					<view slot="label">
						<view class="company">{{ item.company.name }}</view>
						<view class="demand">{{ item.company.nature | nature }}｜{{ !item.working ? 0 :  item.working | workings }}｜{{ !item.schooling ? 0 :  item.schooling | schooling2 }}</view>
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		
		<view class="lxk-add" v-else-if="ready">
			<van-icon name="/static/icon/zhiwei.png" size="50px" />
			<view class="lxk-add-title">暂无职位</view>
			<view class="lxk-add-desc">你还可以换个地区或更换关键词搜索</view>
		</view>
		
		<van-popup :show="filter.salary.show" position="top" close-on-click-overlay @close="filterClose('salary')"
		 custom-class='lxk-popup' v-if="ready">
			<view class="lxk-popup-content">
				<view class="xinzi">月薪范围
					<span>(
						<i v-if="filter.salary.value < 10">{{ filter.salary.value ? filter.salary.value : '不限' }} {{ filter.salary.value ? '千以上' : '' }}</i>
						<i v-else-if="filter.salary.value >= 10">{{ filter.salary.value / 10 }} 万以上</i>
						)</span>
				</view>
				<wux-slider :defaultValue="filter.salary.def" showValue @afterChange="salary" />
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upSalary">确定</wux-button>
			</view>
		</van-popup>
		
		<van-popup :show="filter.industry.show" position="top" close-on-click-overlay @close="filterClose('industry')"
		 custom-class='lxk-popup' v-if="ready">
			<van-tree-select :items="filter.industry.items" :main-active-index="filter.industry.active" :active-id="filter.industry.id"
			 @click-nav="onClickNav" @click-item="onClickItem" />
		</van-popup>
		
		<van-popup :show="filter.publish.show" position="top" close-on-click-overlay @close="filterClose('publish')"
		 custom-class='lxk-popup' v-if="ready">
			<view class="lxk-popup-content">
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.publish.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.publish.text === item.text ? 'positive' : 'stable'" @click="filterClick(item.text,item.id,'publish')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upPublish">确定</wux-button>
			</view>
		</van-popup>
		
		<van-popup :show="filter.more.show" position="top" close-on-click-overlay @close="filterClose('more')" custom-class='lxk-popup'
		 v-if="ready">
			<view class="lxk-popup-content">
				<view class="lxk-popup-title">学历要求</view>
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.more.schooling.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.more.schooling.text === item.text ? 'positive' : 'stable'" @click="filterClick(item.text,item.id,'schooling')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
				<view class="lxk-popup-title">工作年限</view>
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.more.working.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.more.working.text === item.text ? 'positive' : 'stable'" @click="filterClick(item.text,item.id,'working')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
				<view class="lxk-popup-title">公司性质</view>
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.more.nature.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.more.nature.text === item.text ? 'positive' : 'stable'" @click="filterClick(item.text,item.id,'nature')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
				<view class="lxk-popup-title">公司规模</view>
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.more.size.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.more.size.text === item.text ? 'positive' : 'stable'" @click="filterClick(item.text,item.id,'size')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
				<view class="lxk-popup-title">工作类型</view>
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.more.type.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.more.type.text === item.text ? 'positive' : 'stable'" @click="filterClick(item.text,item.id,'type')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upMore">确定</wux-button>
			</view>
		</van-popup>
		
		<wux-cascader :visible="city.show" title="选择城市" :options="city.options" @close="city.show = false" @change="editCity"
		 v-if="ready" />
		<ltabbar></ltabbar>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getJob,
	} from '@/api/job'
	import citys from '@/utils/data'
	import publish from '@/utils/items/publish'
	import industrys from '@/utils/items/industry'
	import schooling from '@/utils/items/schooling'
	import working from '@/utils/items/working'
	import nature from '@/utils/items/nature'
	import size from '@/utils/items/size'
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
					industry: {
						items: industrys,
						show: false,
						active: 0,
						id: null,
						text: '全部行业'
					},
					salary: {
						show: false,
						def: [0],
						value: null
					},
					publish: {
						items: publish,
						show: false,
						text: null,
						id: null,
					},
					more: {
						show: false,
						schooling: {
							items: schooling,
							text: null,
							id: null,
						},
						working: {
							items: working,
							text: null,
							id: null,
						},
						nature: {
							items: nature,
							text: null,
							id: null,
						},
						size: {
							items: size,
							text: null,
							id: null,
						},
						type: {
							items: [{
									text: '全职',
									id: 1,
								},
								{
									text: '兼职',
									id: 2,
								},
								{
									text: '实习',
									id: 3
								}
							],
							text: null,
							id: null,
						},
					}
				},
				locations: {
					province: null,
					city: null,
					area: null,
					citys: '全国',
				},
				list: null,
				count: null,
				search: {
					industry: null,
					salary: null,
					publish: 0,
					schooling: null,
					working: null,
					nature: null,
					size: null,
					type: null,
					value: null,
					count: true,
					page: 1,
					limit: 10
				},
				city: {
					show: false,
					options: citys
				},
				showlist: false
			}
		},
		onShow() {
			this.$store.commit('SET_LTABBAR', 'job');
			this.showlist = true
			this.getJob();
		},
		onReady() {
			this.ready = true
		},
		onLoad(e) {
			uni.hideTabBar()
			if (e.search) {
				this.search.value = e.search
			}
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getJob() {
				const s = this.search
				const t = this
				const a = this.address
				let sl = this.showlist
				const search = Object.assign({}, {
						count: s.count,
						page: sl ? 1 : s.page,
						limit: sl ? 10 * s.page : s.limit,
					},
					s.industry ? {
						industry: s.industry
					} : {},
					s.salary ? {
						salary: s.salary
					} : {},
					s.publish && s.publish > 0 ? {
						publish: s.publish
					} : {},
					s.schooling && s.schooling > 0 ? {
						schooling: s.schooling
					} : {},
					s.working && s.working > 0 ? {
						working: s.working
					} : {},
					s.nature && s.nature > 0 ? {
						nature: s.nature
					} : {},
					s.size && s.size > 0 ? {
						size: s.size
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
				getJob(search).then(response => {
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
					this.getJob()
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
				this.getJob()
			},
			salary(e) {
				this.filter.salary.value = e.detail.value[0]
			},
			onClickNav(e) {
				this.filter.industry.active = e.detail.index
			},
			onClickItem(e) {
				this.search.industry = e.detail.id
				const f = this.filter
				f.industry.show = false
				f.active = null
				f.industry.id = e.detail.id
				f.industry.text = e.detail.text
				this.list = null
				this.getJob()
			},
			onChange(e) {
				const d = e.detail
				const f = this.filter
				f.active = d
				f.industry.show = d === 0 ? true : false
				f.salary.show = d === 1 ? true : false
				f.publish.show = d === 2 ? true : false
				f.more.show = d === 3 ? true : false
			},
			filterClose(n) {
				let f
				if (n === 'industry') {
					f = this.filter.industry
				} else if (n === 'salary') {
					f = this.filter.salary
				} else if (n === 'publish') {
					f = this.filter.publish
				} else if (n === 'more') {
					f = this.filter.more
				}
				f.show = false
				this.filter.active = null
			},
			filterClick(t, i, n) {
				let p
				if (n === 'publish') {
					p = this.filter.publish
				} else if (n === 'schooling') {
					p = this.filter.more.schooling
				} else if (n === 'working') {
					p = this.filter.more.working
				} else if (n === 'nature') {
					p = this.filter.more.nature
				} else if (n === 'size') {
					p = this.filter.more.size
				} else if (n === 'type') {
					p = this.filter.more.type
				}
				p.text = t
				p.id = i
			},
			upPublish() {
				const f = this.filter
				this.search.publish = f.publish.id ? f.publish.id : 0
				f.active = null
				f.publish.show = false
				this.list = null
				this.getJob()
			},
			upMore() {
				const f = this.filter
				const s = this.search
				s.schooling = f.more.schooling.id
				s.working = f.more.working.id
				s.nature = f.more.nature.id
				s.size = f.more.size.id
				s.type = f.more.type.id
				f.active = null
				f.more.show = false
				this.list = null
				this.getJob()
			},
			upSalary() {
				const f = this.filter
				this.search.salary = f.salary.value * 1000
				f.active = null
				f.salary.show = false
				this.list = null
				this.getJob()
			},
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/job/detail?id=' + id
				});
			},
			getSearch(e) {
				this.search.value = e.detail
				this.list = null
				this.getJob()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 80px 0 55px;
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

	.lxk-price {
		color: #ef473a;
	}

	.lxk-head {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 101;
		border-bottom: 1px solid #f8f8f8;
	}

	.xinzi {
		font-size: 12px;

		span {
			margin-left: 5px;
			color: #1989fa;
		}

		i {
			margin: 0 5px;
			display: inline-block;
		}
	}

	.lxk-popup-title {
		font-size: 12px;
	}

	.lxk-popup-content {
		padding: 10px;
	}

	.lxk-row {
		margin: 0 -10px;
	}

	.lxk-col {
		margin: auto 10px;
		width: 33.33333333%;
		float: left;
		display: block;
		box-sizing: border-box;
	}

	/deep/ {
		.popup-button {
			.wux-button {
				margin: 0;
				border-radius: 0;
			}
		}

		.wux-slider {
			padding: 80px 30px;
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
