import request from '@/utils/request'
import { authorizationServer, sys } from '@/common/constant'

export function login(data) {
  const form = {
    username: data.username,
    password: data.password,
    status: data.randomStr,
    grant_type: 'password',
    scope: 'all'
  }
  return request({
    url: authorizationServer + '/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ZWJvb3Qtc3lzOmVib290LXN5cw=='
    },
    method: 'post',
    params: form
  })
}

export function getInfo() {
  return request({
    url: sys + '/oauth/userInfo',
    method: 'get'
  })
}

export const refreshToken = (refresh_token) => {
  const form = {
    refresh_token: refresh_token,
    grant_type: 'refresh_token',
    scope: 'all'
  }
  return request({
    url: authorizationServer + '/oauth/token',
    method: 'post',
    params: form
  })
}

export function logout() {
  return request({
    url: authorizationServer + '/logout',
    method: 'post'
  })
}
