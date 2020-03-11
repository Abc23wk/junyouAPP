import requests from '@/utils/requests'
import request from '@/utils/request'

// 以下为api 接口
// 为你精选好的职位
export function getJob(wx) {
	return requests.get('/job', wx)
}

export function getWxsh(wx) {
	return requests.get('/job/wxsh', wx)
}

export function getTraining(wx) {
	return requests.get('/job/training', wx)
}

export function getJobDetail(wx) {
	return requests.get('/job/detail', wx)
}

export function getTrainingDetail(wx) {
	return requests.get('/job/training/detail', wx)
}

// 热门企业
export function getCompany(wx) {
	return requests.get('/job/company', wx)
}

export function getCompanyDetail(wx) {
	return requests.get('/job/company/detail', wx)
}

// 求职攻略
export function getArchives(wx) {
	return requests.get('/job/archives', wx)
}

// 请求文章
export function getArchivesDetail(wx) {
	return requests.get('/job/archives/detail', wx)
}

// 头部轮播图
export function getAdvertising(wx) {
	return requests.get('/job/advertising', wx)
}

export function addCollection(wx) {
	return request.post('/job/collection/add', wx)
}

export function delCollection(wx) {
	return request.post('/job/collection/del', wx)
}

export function getCollection(wx) {
	return request.get('/job/collection', wx)
}

export function addFocus(wx) {
	return request.post('/job/company/focus/add', wx)
}

export function getFocus(wx) {
	return request.get('/job/company/focus', wx)
}

export function delFocus(wx) {
	return request.post('/job/company/focus/del', wx)
}

export function getApply(wx) {
	return request.get('/job/apply', wx)
}

export function addApply(wx) {
	return request.post('/job/apply/add', wx)
}

export function upRasumeBasic(wx) {
	return request.post('/job/rasume/basic/update', wx)
}

export function getRasumeBasic(wx) {
	return request.get('/job/rasume/basic', wx)
}

export function upRasumePubdate(wx) {
	return request.post('/job/rasume/pubdate/update', wx)
}

export function upRasumePref(wx) {
	return request.post('/job/rasume/pref/update', wx)
}

export function getRasumePref(wx) {
	return request.get('/job/rasume/pref', wx)
}

export function getRasumeSetting(wx) {
	return request.get('/job/rasume/setting', wx)
}

export function upRasumeSetting(wx) {
	return request.post('/job/rasume/setting/update', wx)
}

export function addRasumeWork(wx) {
	return request.post('/job/rasume/work/add', wx)
}

export function getRasumeWork(wx) {
	return request.get('/job/rasume/work', wx)
}

export function getRasumeWorkDetail(wx) {
	return request.get('/job/rasume/work/detail', wx)
}

export function upRasumeWorkDetail(wx) {
	return request.post('/job/rasume/work/detail/update', wx)
}

export function delRasumeWorkDetail(wx) {
	return request.post('/job/rasume/work/detail/del', wx)
}

export function addRasumeProject(wx) {
	return request.post('/job/rasume/project/add', wx)
}

export function getRasumeProject(wx) {
	return request.get('/job/rasume/project', wx)
}

export function getRasumeProjectDetail(wx) {
	return request.get('/job/rasume/project/detail', wx)
}

export function upRasumeProjectDetail(wx) {
	return request.post('/job/rasume/project/detail/update', wx)
}

export function delRasumeProjectDetail(wx) {
	return request.post('/job/rasume/project/detail/del', wx)
}

export function addRasumeEdu(wx) {
	return request.post('/job/rasume/edu/add', wx)
}

export function getRasumeEdu(wx) {
	return request.get('/job/rasume/edu', wx)
}

export function getRasumeEduDetail(wx) {
	return request.get('/job/rasume/edu/detail', wx)
}

export function upRasumeEduDetail(wx) {
	return request.post('/job/rasume/edu/detail/update', wx)
}

export function delRasumeEduDetail(wx) {
	return request.post('/job/rasume/edu/detail/del', wx)
}

export function addRasumeHonor(wx) {
	return request.post('/job/rasume/honor/add', wx)
}

export function getRasumeHonor(wx) {
	return request.get('/job/rasume/honor', wx)
}

export function getRasumeHonorDetail(wx) {
	return request.get('/job/rasume/honor/detail', wx)
}

export function upRasumeHonorDetail(wx) {
	return request.post('/job/rasume/honor/detail/update', wx)
}

export function delRasumeHonorDetail(wx) {
	return request.post('/job/rasume/honor/detail/del', wx)
}

export function getRasume(wx) {
	return request.get('/job/rasume', wx)
}

export function getRasumePreview(wx) {
	return request.get('/job/rasume/preview', wx)
}

export function getJobApply(wx) {
	return request.get('/job/apply/list', wx)
}

export function getJobCollection(wx) {
	return request.get('/job/collection/list', wx)
}

export function getJobFocus(wx) {
	return request.get('/job/company/focus/list', wx)
}

export function stsToken(wx) {
	return request.get('/job/sts', wx)
}

export function getSecurity(wx) {
	return request.get('/job/security', wx)
}

export function getSecurityCode(wx) {
	return request.get('job/security/code', wx)
}

export function upMember(wx) {
	return request.post('/job/member/update', wx)
}

export function getInvite(wx) {
	return request.get('/job/invite', wx)
}

export function getTrainingApply(wx) {
	return request.get('/job/training/apply', wx)
}

export function getTrainingApplys(wx) {
	return request.get('/job/training/applys', wx)
}

export function addTrainingApply(wx) {
	return request.post('/job/training/apply/add', wx)
}

export function updateMemberAc(wx) {
	return request.post('/job/member/ac/update', wx)
}

export function getMemberAc(wx) {
	return request.get('/job/member/ac', wx)
}
