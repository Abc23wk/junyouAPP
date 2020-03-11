<template>
	<view class="content">
		<van-cell-group custom-class="lxk-zw" :border="false">
			<van-cell title="基本信息" icon="description" custom-class="title-color-positive" />
			<van-cell use-label-slot :border="false">
				<view slot="title">
					{{ detail.name }}<span>｜{{ detail.gender | gender }}｜{{ detail.birthdate | timesAgo }}岁</span>
				</view>
				<view slot="label">
					<view class="info"><span v-if="detail.info.marital">{{ detail.info.marital | marital }}｜</span>{{ detail.startjob | timesAgo }}年工作经验</view>
					<view class="info"><b class="label">求职状态：</b>{{ detail.jobstate | jobstate }}</view>
					<view class="info"><b class="label">手机号码：</b>{{ detail.phone }}</view>
					<view class="info" v-if="detail.emall"><b class="label">邮箱：</b>{{ detail.emall }}</view>
					<view class="info"><b class="label">居住地：</b>{{ detail.habitation }}</view>
					<view class="info" v-if="detail.info.income"><b class="label">年收入：</b>{{ detail.info.income }}元</view>
				</view>
			</van-cell>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false" v-if="detail.work.length > 0">
			<van-cell title="工作经验" icon="orders-o" custom-class="title-color-positive" />
			<wux-timeline wux-class="lxk-timeline">
				<wux-timeline-item v-for="(item, index) in detail.work" :key="index" is-link>
					<view class="time">{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}</view>
					<view class="position">{{ item.position }}｜<span v-if="item.type"></span>{{ item.type | prefType }}</view>
					<view class="company">{{ item.company }}</view>
					<view class='info' v-if="item.industry || item.nature || item.size"><span v-if="item.industry">{{ item.industry | industry }}</span>｜<span
						 v-if="item.nature">{{ item.nature | nature }}</span>｜<span v-if="item.size">{{ item.size | size }}</span></view>
					<view class="desc" v-if="item.description">
						<b>工作描述：</b>
						{{ item.description }}
					</view>
				</wux-timeline-item>
			</wux-timeline>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false" v-if="detail.project.length > 0">
			<van-cell title="项目经验" icon="orders-o" custom-class="title-color-positive" />
			<wux-timeline wux-class="lxk-timeline">
				<wux-timeline-item v-for="(item, index) in detail.project" :key="index" is-link>
					<view class="time">{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}</view>
					<view class="position">{{ item.name }}</view>
					<view class="company">{{ item.company }}</view>
					<view class="desc" v-if="item.description">
						<b>项目描述：</b>
						{{ item.description }}
					</view>
				</wux-timeline-item>
			</wux-timeline>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false">
			<van-cell title="求职意向" icon="aim" custom-class="title-color-positive" />
			<van-cell-group :border="false" custom-class="lxk-yx">
				<van-cell :border="false" v-if="detail.position">
					<view slot="title">
						求职职位<span>{{ detail.position }}</span>
					</view>
				</van-cell>
				<van-cell :border="false" v-if="detail.location">
					<view slot="title">
						工作地点<span>{{ detail.location }}</span>
					</view>
				</van-cell>
				<van-cell :border="false" v-if="detail.info.industry">
					<view slot="title">
						求职行业<span>{{ detail.info.industry | industry }}</span>
					</view>
				</van-cell>
				<van-cell :border="false" v-if="detail.salary">
					<view slot="title">
						期望薪资<span>{{ detail.salary | salary }}</span>
					</view>
				</van-cell>
				<van-cell :border="false" v-if="detail.info.arrival">
					<view slot="title">
						到岗时间<span>{{ detail.info.arrival | arrival }}</span>
					</view>
				</van-cell>
				<van-cell :border="false" v-if="detail.info.type">
					<view slot="title">
						工作类型<span>{{ detail.info.type | prefType }}</span>
					</view>
				</van-cell>
				<van-cell :border="false" v-if="detail.info.self">
					<view slot="title">
						个人评价<span>{{ detail.info.self }}</span>
					</view>
				</van-cell>
			</van-cell-group>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false" v-if="detail.edu.length > 0">
			<van-cell title="教育经历" icon="orders-o" custom-class="title-color-positive" />
			<wux-timeline wux-class="lxk-timeline">
				<wux-timeline-item v-for="(item, index) in detail.edu" :key="index" is-link>
					<view class="time">{{ item.start | parseTime('{y}/{m}') }} - {{ item.end | parseTime('{y}/{m}') }}</view>
					<view class="position">{{ item.school }}</view>
					<view class="company">{{ item.degree | degree }}｜{{ item.major }}</view>
					<view class="desc" v-if="item.description">
						<b>教育经历：</b>
						{{ item.description }}
					</view>
				</wux-timeline-item>
			</wux-timeline>
		</van-cell-group>
		<van-cell-group custom-class="lxk-cell-def" :border="false" v-if="detail.honor.length > 0">
			<van-cell title="军旅荣誉" icon="orders-o" custom-class="title-color-positive" />
			<wux-timeline wux-class="lxk-timeline">
				<wux-timeline-item v-for="(item, index) in detail.honor" :key="index" is-link>
					<view class="time">{{ item.time | parseTime('{y}/{m}') }}</view>
					<view class="position">{{ item.description }}</view>
				</wux-timeline-item>
			</wux-timeline>
		</van-cell-group>
		<wux-toast id="wux-toast" />
	</view>
</template>

<script>
	import {
		getRasumePreview,
	} from '@/api/job'
	import {
		$wuxToast,
	} from '../../wxcomponents/wux/index'
	export default {
		data() {
			return {
				detail: {
					info: {
						marital: 0,
						type: 0
					}
				},
			}
		},
		onShow() {
			this.getRasumePreview()
		},
		methods: {
			getRasumePreview() {
				getRasumePreview().then(response => {
					let r = response.data
					if (response.code === 20000) {
						this.detail = r.detail
					} else {
						$wuxToast().show({
							type: 'forbidden',
							text: '请求异常'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ {
		.lxk-timeline {
			padding: 30px 10px 0;
			font-size: 12px;
			line-height: 28px;

			.wux-timeline-item__tail {
				left: 17rpx;
				top: 10px;
				border-left: 2rpx solid #e8e8e8;
			}

			.wux-timeline-item__dot {
				border: 2rpx solid #387ef5;
				width: 15rpx;
				height: 15rpx;
				margin-left: 5px;
				margin-top: 4px;
			}

			.time {
				font-size: 14px;
				color: #666;
			}

			.company {
				font-size: 14px;
				color: #666;
			}

			.position {
				font-size: 14px;
				color: #333;
			}

			.info {
				font-size: 12px;
				color: #999;
			}

			.desc {
				font-size: 12px;
				line-height: 18px;
				color: #666;
				word-wrap: break-word;

				b {
					color: #999;
				}
			}
		}

		.title-color-positive {
			color: $uni-color-positive;
		}

		.lxk-yx {
			padding: 10px 0 10px 10px;

			.van-cell__title {
				font-size: 12px;
				color: #999;
			}

			span {
				font-size: 12px;
				color: #333;
				margin-left: 15px;
			}
		}

		.lxk-cell-def {
			margin-top: 10px;
			overflow: hidden;
			background: #fff;
		}

		.lxk-zw {
			overflow: hidden;
			background: #fff;

			span {
				margin-left: 5px;
				font-size: 12px;
				color: #999;
				line-height: 24px;
			}

			.info {
				font-size: 12px;
				color: #333;
				line-height: 24px;

				.label {
					width: 6em;
					color: #666;
					display: inline-block;
				}

				.van-icon {
					margin-right: 3px;
					vertical-align: middle;
				}
			}
		}
	}
</style>
