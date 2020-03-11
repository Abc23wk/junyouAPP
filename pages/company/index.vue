<template>
	<view class="content">
		<view class="lxk-head">
			<van-search :value="search.value" use-action-slot shape="round" placeholder="搜索企业" @search="getSearch">
				<view slot="label">
					<span class="search-label" @click="city.show = true">{{ address.citys }}</span>
				</view>
			</van-search>
			<van-tabbar :active="filter.active" :border="false" :fixed="false" @change="onChange">
				<van-tabbar-item>{{ search.industry ? filter.industry.text.substr(0,4) :'全部行业' }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
				<van-tabbar-item>{{ search.nature | nature }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
				<van-tabbar-item>{{ search.size | size }}
					<van-icon name="play" custom-class="lxl-filter" />
				</van-tabbar-item>
			</van-tabbar>
		</view>
		<view v-if="list.length > 0">
			<van-cell-group custom-class="margin-top-10 lxk-mq" :border="false">
				<van-cell :title="item.name" use-label-slot :icon="item.logo" :border="list.length - 1 === index ? false : true"
				 v-for="(item, index) in list" :key="index" @click="detailTo(item.id)">
					<view slot="label">
						{{ item.nature | nature }}｜{{ item.size | size }}｜在招职位 <span class="job-num">{{ item.job_num }}</span>个
					</view>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="lxk-add" v-else-if="ready">
			<van-icon name="/static/icon/mingqi.png" size="50px" />
			<view class="lxk-add-title">暂无企业提供职位</view>
			<view class="lxk-add-desc">你可以换个地区或更换企业名称搜索</view>
		</view>
		<van-popup :show="filter.industry.show" position="top" close-on-click-overlay @close="popupClose('industry')"
		 custom-class='lxk-popup' v-if="ready">
			<van-tree-select :items="filter.industry.items" :main-active-index="filter.industry.active" :active-id="filter.industry.id"
			 @click-nav="onClickNav" @click-item="onClickItem" />
		</van-popup>
		<van-popup :show="filter.nature.show" position="top" close-on-click-overlay custom-class='lxk-popup' @close="popupClose('nature')"
		 v-if="ready">
			<view class="lxk-popup-content">
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.nature.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.nature.text === item.text ? 'positive' : 'stable'"
						 @click="filterClick(item.text,item.id,'nature')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upNature">确定</wux-button>
			</view>
		</van-popup>
		<van-popup :show="filter.size.show" position="top" close-on-click-overlay custom-class='lxk-popup' @close="popupClose('size')"
		 v-if="ready">
			<view class="lxk-popup-content">
				<van-row gutter="20">
					<van-col span="8" v-for="(item, index) in filter.size.items" :key="index">
						<wux-button hoverClass="none" block size="small" :type="filter.size.text === item.text ? 'positive' : 'stable'"
						 @click="filterClick(item.text,item.id,'size')">{{ item.text }}</wux-button>
					</van-col>
				</van-row>
			</view>
			<view class="popup-button">
				<wux-button block type="positive" @click="upSize">确定</wux-button>
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
		getCompany,
	} from '@/api/job'
	import citys from '@/utils/data'
	import industrys from '@/utils/items/industry'
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
					nature: {
						items: nature,
						show: false,
						text: null,
						id: null,
					},
					size: {
						items: size,
						show: false,
						text: null,
						id: null,
					},
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
					nature: 0,
					size: 0,
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
			this.$store.commit('SET_LTABBAR', 'company');
			this.showlist = true
			this.getCompany();
		},
		onReady() {
			uni.hideTabBar()
			this.ready = true
		},
		onPullDownRefresh() {
			this.refresher()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.refresher()
		},
		methods: {
			getCompany() {
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
					s.nature && s.nature > 0 ? {
						nature: s.nature
					} : {},
					s.size && s.size > 0 ? {
						size: s.size
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
				getCompany(search).then(response => {
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
				this.getCompany()
			},
			refresher() {
				let t = this
				if (t.count > t.list.length) {
					t.search.page = t.search.page++
					this.getCompany()
				} else {
					$wuxToast().hide()
					$wuxToast().show({
						type: 'forbidden',
						text: '已加载全部'
					})
				}
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
				this.getCompany()
			},
			filterClick(t, i, n) {
				let p
				if (n === 'nature') {
					p = this.filter.nature
				} else if (n === 'size') {
					p = this.filter.size
				}
				p.text = t
				p.id = i
			},
			upNature() {
				const f = this.filter
				this.search.nature = f.nature.id ? f.nature.id : 0
				f.active = null
				f.nature.show = false
				this.list = null
				this.getCompany()
			},
			upSize() {
				const f = this.filter
				this.search.size = f.size.id ? f.size.id : 0
				f.active = null
				f.size.show = false
				this.list = null
				this.getCompany()
			},
			onChange(e) {
				const d = e.detail
				const f = this.filter
				f.active = d
				f.industry.show = d === 0 ? true : false
				f.nature.show = d === 1 ? true : false
				f.size.show = d === 2 ? true : false
			},
			popupClose(e) {
				const f = this.filter
				f.active = null
				if (e === 'industry') {
					f.industry.show = false
				} else if (e === 'nature') {
					f.nature.show = false
				} else if (e === 'size') {
					f.size.show = false
				}
			},
			detailTo(id) {
				uni.navigateTo({
					url: '/pages/company/detail?id=' + id
				});
			},
			getSearch(e) {
				setTimeout(() => {
					this.search.value = e.detail
					this.list = null
					this.getCompany()
				}, 500)
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

	.job-num {
		font-size: 12px;
		color: #1a8afa;
		padding: 0 5px;
		font-weight: 700;
	}

	.lxk-price {
		color: #ed6a0c;
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

	/deep/ {
		.lxk-mq {
			.van-icon {
				font-size: 32px;
				padding-top: 21px;
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
