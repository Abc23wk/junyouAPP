// 过滤器
function pluralize(time, label) {
	if (time === 1) {
		return time + label
	}
	return time + label + 's'
}

export function timeAgo(time) {
	const between = Date.now() / 1000 - Number(time)
	if (between < 3600) {
		return pluralize(~~(between / 60), ' minute')
	} else if (between < 86400) {
		return pluralize(~~(between / 3600), ' hour')
	} else {
		return pluralize(~~(between / 86400), ' day')
	}
}

export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}

	time = +time * 1000

	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		date = new Date(parseInt(time))
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

export function formatTime(time, option) {
	time = +time * 1000
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) { // less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
	}
}

export function timesAgo(time) {
	const times = Date.parse(new Date());
	return Math.floor((times - (time * 1000)) / 31536000000)
}


/* 数字 格式化*/
export function nFormatter(num, digits) {
	const si = [{
			value: 1E18,
			symbol: 'E'
		},
		{
			value: 1E15,
			symbol: 'P'
		},
		{
			value: 1E12,
			symbol: 'T'
		},
		{
			value: 1E9,
			symbol: 'G'
		},
		{
			value: 1E6,
			symbol: 'M'
		},
		{
			value: 1E3,
			symbol: 'k'
		}
	]
	for (let i = 0; i < si.length; i++) {
		if (num >= si[i].value) {
			return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
		}
	}
	return num.toString()
}

export function html2Text(val) {
	const div = document.createElement('div')
	div.innerHTML = val
	return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
	return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function numFilter(value) {
	let realVal = ''
	if (value) {
		// 截取当前数据到小数点后三位
		let tempVal = parseFloat(value).toFixed(2)
		realVal = tempVal.substring(0, tempVal.length - 1)
	} else {
		realVal = '--'
	}
	return realVal
}

export function nature(state) {
	const num = {
		0: '公司性质',
		1: '国企',
		2: '外资（欧美）',
		3: '外资（非欧美）',
		4: '上市公司',
		5: '合资',
		6: '民营公司',
		7: '外企代表处',
		8: '政府机关',
		9: '事业单位',
		10: '非营利组织',
		11: '创业公司',
	}
	return num[state]
}

export function salary(state) {
	const num = {
		0: '未选择',
		1: '2千以下',
		2: '2-3千',
		3: '3-4.5千',
		4: '4.5-6千',
		5: '6-8千',
		6: '0.8-1万',
		7: '1-1.5万',
		8: '1.5-2万',
		9: '3-4万',
		10: '4-5万',
		11: '5万以上',
	}
	return num[state]
}

export function prefType(state) {
	const num = {
		0: '未选择',
		1: '全职',
		2: '兼职',
		3: '实习'
	}
	return num[state]
}

export function arrival(state) {
	const num = {
		1: '随时',
		2: '1周内',
		3: '1个月内',
		4: '3个月内',
		5: '待定'
	}
	return num[state]
}

export function size(state) {
	const num = {
		0: '公司规模',
		1: '少于50人',
		2: '50-150人',
		3: '150-500人',
		4: '500-1000人',
		5: '1000-5000人',
		6: '5000-10000人',
		7: '10000人以上',
	}
	return num[state]
}

export function working(state) {
	const num = {
		1: '1-3年',
		2: '3-5年',
		3: '5-10年',
		4: '10年以上'
	}
	return num[state]
}



export function workings(state) {
	const num = {
		0: '不限',
		1: '无经验',
		2: '1-3年',
		3: '3-5年',
		4: '5-10年',
		5: '10年以上'
	}
	return num[state]
}

export function schooling(state) {
	const num = {
		1: '初中及以下',
		2: '高中',
		3: '大专',
		4: '本科',
		5: '硕士',
		6: '博士'
	}
	return num[state]
}

export function schooling2(state) {
	const num = {
		0: '无学历要求',
		1: '初中及以下',
		2: '高中',
		3: '大专',
		4: '本科',
		5: '硕士',
		6: '博士'
	}
	return num[state]
}

export function schoolings(state) {
	const num = {
		0: '不限',
		1: '初中及以下',
		2: '高中',
		3: '大专',
		4: '本科',
		5: '硕士',
		6: '博士'
	}
	return num[state]
}

export function degree(state) {
	const num = {
		1: '初中及以下',
		2: '高中',
		3: '中技',
		4: '中专',
		5: '大专',
		6: '本科',
		7: '硕士',
		8: 'MBA',
		9: '博士'
	}
	return num[state]
}

export function publish(state) {
	const num = {
		0: '发布时间',
		1: '24小时内',
		3: '近三天',
		7: '近一周',
		30: '近一月'
	}
	return num[state]
}

export function gender(state) {
	const num = {
		0: '未知',
		1: '男性',
		2: '女性'
	}
	return num[state]
}

export function trainingType(state) {
	const num = {
		0: '培训性质',
		1: '上岗培训',
		2: '就业培训',
		3: '学历培训'
	}
	return num[state]
}

export function trainingTime(state) {
	const num = {
		3: '近三天',
		7: '近一周',
		30: '近一月',
		0: '培训时间'
	}
	return num[state]
}

export function jobstate(state) {
	const num = {
		1: '目前正在找工作',
		2: '观望有好机会会考虑',
		3: '我目前不想换工作'
	}
	return num[state]
}

export function resumestate(state) {
	const num = {
		1: '军优公开',
		2: '完全公开',
		3: '完全保密'
	}
	return num[state]
}

export function marital(state) {
	const num = {
		1: '未婚',
		2: '已婚',
		3: '保密'
	}
	return num[state]
}

export function political(state) {
	const num = {
		1: '中共党员',
		2: '共青团员',
		3: '民主党派人士',
		4: '无党派人士',
		5: '普通公民'
	}
	return num[state]
}

export function idtype(state) {
	const num = {
		1: '身份证',
		2: '护照',
		3: '军人证',
		4: '港澳居民来往内地通行证',
		5: '外国人永久居留身份证',
		6: '其他'
	}
	return num[state]
}

export function applyState(state) {
	const num = {
		1: '已投递',
		2: '已查阅',
		3: '感兴趣',
		4: '邀面试',
		5: '未通过',
	}
	return num[state]
}

export function applyClass(state) {
	const num = {
		1: 'title-color-positive',
		2: 'title-color-warning',
		3: 'title-color-assertive',
		4: 'title-color-assertive',
		5: '',
	}
	return num[state]
}

export function applyIcon(state) {
	const num = {
		1: 'exchange',
		2: 'eye-o',
		3: 'warn-o',
		4: 'like-o',
		5: 'phone-o'
	}
	return num[state]
}

export function ac(state) {
	const num = {
		0: '未认证',
		1: '认证中',
		2: '军人认证',
		3: '军属认证'
	}
	return num[state]
}

export function industry(state) {
	const num = {
		1: '计算机软件',
		2: '计算机硬件',
		3: '企业服务',
		4: '人工智能',
		5: '通信/网络设备',
		6: '网络/信息安全',
		7: '新媒体',
		8: '游戏',
		9: '云计算/大数据',
		10: '房地产开发与经营',
		11: '房地产中介',
		12: '土地与公共设施管理',
		13: '物业服务',
		14: '保险业',
		15: '典当',
		16: '互联网金融/小额贷款',
		17: '基金/风投',
		18: '汽车金融服务',
		19: '信托投资',
		20: '银行',
		21: '证券/期货',
		22: '房屋建筑/建筑设备安装',
		23: '公共建筑装饰装修',
		24: '土木工程建筑',
		25: '住宅装饰装修',
		26: '船舶/航空/航天/火车制造',
		27: '电气机械/器材制造',
		28: '电子设备制造',
		29: '纺织业/服饰产品加工制造',
		30: '非金属矿物制品业',
		31: '钢铁和有色金属冶炼及加工',
		32: '化学纤维制造业',
		33: '化学原来/化学制品',
		34: '金属制品业',
		35: '农副产品加工制造',
		36: '汽车制造',
		37: '燃料资源加工制造',
		38: '日化产品制造',
		39: '通用设备制造',
		40: '橡胶和塑料制品',
		41: '医药制造',
		42: '仪器仪表制造',
		43: '印刷/文体用品制造',
		44: '造纸/家具制造',
		45: '专用设备制造',
		46: '医疗设备/器械',
		47: '农林牧渔',
		48: '快速消费品',
		49: '贸易/进出口代理/拍卖',
		50: '耐用消费品',
		51: '零售/皮肤',
		52: '财务/审计/税务',
		53: '法律服务',
		54: '工程技术与设计服务',
		55: '广告业',
		56: '会议/展览服务',
		57: '检测/认证',
		58: '景区/商业/市场等综合管理',
		59: '人力资源服务',
		60: '商业代理服务',
		61: '专利/商标/知识产权',
		62: '专业技术服务',
		63: '咨询服务',
		64: '租聘服务',
		65: '广播/电视/电影/录音制作',
		66: '体育',
		67: '文化艺术/娱乐',
		68: '新闻/出版',
		69: '火车站/港口/汽车站/路政',
		70: '货运/物流仓储',
		71: '民航/铁路/公路/水路客运',
		72: '邮政/快递',
		73: '电力/水利/热力/燃气',
		74: '环保',
		75: '矿产/采掘',
		76: '石油/石化',
		77: '新能源',
		78: '科学技术推广服务业',
		79: '培训/课外教育/教育辅助',
		80: '学术/科研',
		81: '学校教育',
		82: '卫生服务',
		83: '养老/孤儿/看护等社会服务',
		84: '医院',
		85: '国家机构',
		86: '社团/组织/社会保障',
		87: '餐饮业',
		88: '酒店/民宿',
		89: '居民服务',
		90: '旅游业'

	}
	return num[state]
}
