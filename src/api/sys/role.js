import request from '@/utils/request'
import { sys } from '@/common/constant'

export function getRoleList() {
  return request({
    url: sys + '/role/findAll',
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

export function getRoleByUser(userId) {
  return request({
    url: sys + '/role/findByUserId',
    method: 'get',
    params: { userId: userId }
  })
}

export function delUserRole(data) {
  return request({
    url: sys + '/role/user/delete',
    method: 'post',
    data
  })
}

export function addUserRole(data) {
  return request({
    url: sys + '/role/user/add',
    method: 'post',
    data
  })
}
