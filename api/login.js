import request from '@/utils/request'
import requests from '@/utils/requests'
export function login (wx) {
  return requests.post('/job/login', wx)
}

export function logins (wx) {
  return request.post('/job/login', wx)
}

export function applogin (app) {
  return requests.post('/job/login/app', app)
}

export function upLoginPwd (app) {
  return requests.post('/job/login/pwd', app)
}

export function upkey (wx) {
  return request.post('/job/sessionkey/update', wx)
}

export function getLoginCode(wx) {
	return requests.get('/job/login/code', wx)
}

export function getPwdCode(wx) {
	return requests.get('/job/pwd/code', wx)
}

export function applogins (app) {
  return request.post('/job/login/app', app)
}

export function getMemberAc(wx) {
	return request.get('/job/member/ac', wx)
}