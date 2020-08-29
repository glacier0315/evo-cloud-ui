import request from '@/utils/request'
import { sys } from '@/common/constant'

export function getRoleList() {
  return request({
    url: sys + '/role/list',
    method: 'get'
  })
}

export function getRolePageList(data) {
  return request({
    url: sys + '/role/pageList',
    method: 'post',
    data
  })
}

export function saveRole(data) {
  return request({
    url: sys + '/role/save',
    method: 'post',
    data
  })
}

export function delRole(id) {
  return request({
    url: sys + '/role/delete',
    method: 'post',
    data: { 'id': id }
  })
}

export function delUserRole(data) {
  return request({
    url: sys + '/role/user/delete',
    method: 'post',
    data
  })
}
