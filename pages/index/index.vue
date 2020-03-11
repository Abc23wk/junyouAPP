<template>
	<view class="content">
		<div class="lxk-head">
			<swiper :autoplay="true" :interval="5000" :duration="1000" :style="{ height: advertising.height }">
				<swiper-item v-for="(item, index) in advertising.list" :key="index" @click="urlTo(item.url)">
					<img :src="item.value" style="width: 100%" mode="widthFix" @load="imageLoad">
				</swiper-item>
			</swiper>
			<van-search :background="ffffff" use-action-slot shape="round" placeholder="搜索职位" @search="getSearch" custom-class="lxk-index-search">
				<view slot="label">
					<span class="search-label" @click="city.show = true">{{ address.citys }}</span>
				</view>
			</van-search>
			<van-grid :border="false">
				<van-grid-item icon="/static/icon/zhiwei.png" text="热门职位" link-type="switchTab" url="/pages/job/index" />
				<van-grid-item icon="/static/icon/mingqi.png" text="名企直招" link-type="switchTab" url="/pages/company/index" />
				<van-grid-item icon="/static/icon/gonglve.png" text="求职攻略" url="/pages/article/strategy" />
				<van-grid-item icon="/static/icon/peixun.png" text="教育培训" url="/pages/training/index" />
				<van-grid-item icon="/static/icon/tixing.png" text="投递反馈" url="/pages/record/index" />
				<van-grid-item icon="/static/icon/yaoqing.png" text="面试邀请" url="/pages/record/index?active=3" />
				<van-grid-item icon="/static/icon/zhengce.png" text="最新政策" url="/pages/article/policy" />
				<van-grid-item icon="/static/icon/dongtai.png" text="新闻动态" url="/pages/article/new" />
			</van-grid>
		</div>
		<van-notice-bar backgroundColor="#fff" color="#4e8cee" left-icon="bullhorn-o" :text="notice.title" @click="detailTo(notice.id,3)"
		 v-if="notice" />
		 
		<van-notice-bar backgroundColor="#fff" color="#4e8cee" left-icon="bullhorn-o" text="欢迎登陆军优创就业,这里为退伍军人提供最好的职位和最新的政策"
		 v-else />
		 
		<van-cell-group custom-class="margin-top-10 lxk-mq" :border="false" v-if="company.list">
			<van-cell title="热门企业" value="更多" is-link @click="companyTo" />
			<van-cell :title="item.name" use-label-slot :icon="item.logo" :border="company.list.length - 1 === index ? false : true"
			 v-for="(item, index) in company.list" :key="index" @click="detailTo(item.id,1)">
				<view slot="label">
					{{ item.nature | nature }}｜{{ item.size | size }}｜在招 <span class="job-num">{{ item.job_num }}</span>个
				</view>
			</van-cell>
		</van-cell-group>
		<van-cell-group custom-class="margin-top-10 lxk-zw" :border="false" v-if="ready && job.list">
			<van-cell title="为你精选好职位" value="更多" is-link @click="jobTo" />
			<van-cell :title="item.title" use-label-slot :border="job.list.length - 1 === index ? false : true" @click="detailTo(item.id,2)"
			 v-for="(item, index) in job.list" :key="index">
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
		<van-cell-group custom-class="margin-top-10" :border="false" v-if="ready && archives.list">
			<van-cell title="求职攻略" value="更多" is-link @click="strategyTo" />
			<van-cell :title="item.title" is-link v-for="(item, index) in archives.list" :key="index" :border="archives.list.length - 1 === index ? false : true"
			 @click="detailTo(item.id,3)" />
		</van-cell-group>
		<wux-cascader :visible="city.show" title="选择城市" :options="city.options" @close="city.show = false" @change="editCity"
		 v-if="ready" />
		<ltabbar></ltabbar>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getCompany,
		getJob,
		getArchives,
		getAdvertising,
	} from '@/api/job'
	import {
		$wuxToast
	} from '../../wxcomponents/wux/index'
	import citys from '@/utils/data'
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
				notice: null,
				advertising: {
					height: '180px',
					list: null,
					search: {
						type: 101,
						page: 1,
						limit: 5
					}
				},
				job: {
					list: null,
					search: {
						page: 1,
						limit: 5
					}
				},
				company: {
					// 热门企业
					list: null,
					search: {
						page: 1,
						limit: 5
					}
				},
				archives: {
					// 求职攻略
					list: null,
					search: {
						arctype: '1,2,3,4,5',
						page: 1,
						limit: 5
					}
				},
				locations: {
					province: null,
					city: null,
					area: null,
					citys: '全国',
				},
				search: {
					value: null,
				},
				city: {
					show: false,
					options: citys
				}
			}
		},
		onShow() {
			uni.hideKeyboard()
			this.$store.commit('SET_LTABBAR', 'home');
		},
		onReady() {
			this.ready = true
		},
		onLoad() {
			uni.hideTabBar()
			this.getAdvertising();
		},
		methods: {
			getAdvertising() {
				// 头部轮播图
				const t = this.advertising
				getAdvertising(t.search).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.list = r.list
						this.getCompany();// 热门企业
						this.getJob();// 为你精选好的职位
						this.getArchives();// 求职攻略
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			getCompany() {
				// 热门企业
				const t = this.company
				getCompany(t.search).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.list = r.list
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			getJob() {
				// 为你精选好的职位
				const s = this.job.search
				const t = this.job
				const a = this.address
				const search = Object.assign({}, {
						page: s.page,
						limit: s.limit,
					},
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
					console.log(response);
					let r = response.data
					if (response.code === 20000) {
						t.list = r.list
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			// getArchives : async function(){    
			// 		console.log("哈哈哈哈哈哈");
			//         const t = this.archives
			//         let res = await getDevice(t)     //这样写的好处是不存在异步处理，不会影响数据处理顺序
			//         console.log(res+"：新的方法")
			//     },
			getArchives() {
				// 求职攻略
				const t = this.archives
				getArchives(t.search).then(response => {
					let r = response.data
					if (response.code === 20000) {
						t.list = r.list
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			},
			imageLoad(e) {
				const winWid = uni.getSystemInfoSync().windowWidth
				const ratio = e.detail.width / e.detail.height
				this.advertising.height = winWid / ratio + 'px'
			},
			editCity(e) {
				// 选择城市
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
			},
			detailTo(i, n) {
				if (n === 1) {
					uni.navigateTo({
						url: '/pages/company/detail?id=' + i
					});
				} else if (n === 2) {
					uni.navigateTo({
						url: '/pages/job/detail?id=' + i
					});
				} else if (n === 3) {
					uni.navigateTo({
						url: '/pages/article/detail?id=' + i
					});
				}
			},
			companyTo() {
				uni.switchTab({
					url: '/pages/company/index'
				});
			},
			jobTo() {
				uni.switchTab({
					url: '/pages/job/index'
				});
			},
			strategyTo() {
				uni.navigateTo({
					url: '/pages/article/strategy'
				});
			},
			getSearch(e) {
				setTimeout(() => {
					if (e.detail) {
						uni.reLaunch({
							url: '/pages/job/index?search=' + e.detail
						});
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '未填写职位'
						})
					}
				}, 500)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 0 55px;
	}

	.lxk-head {
		background: #fff;
		margin-bottom: 10px;
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
			background: #f8f8f8;
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

	.job-num {
		font-size: 12px;
		color: #1a8afa;
		padding: 0 5px;
		font-weight: 700;
	}

	/deep/ {
		.lxk-mq {
			.cell-index--van-cell__left-icon {
				font-size: 32px;
				padding-top: 21px;
			}
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

		.lxk-index-search {
			position: relative;
			top: -27px;
			margin-bottom: -27px;
			.van-search__content {
				background: #fff;
				box-shadow: 0 .02667rem .32rem hsla(0, 0%, 85.9%, .35);
			}
		}
	}
</style>
