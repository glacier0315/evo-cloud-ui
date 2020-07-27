import request from '@/utils/request'
import { sys } from '@/common/constant'

export function getRoleList(data) {
  return request({
    url: sys + '/role/pageList',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: sys + '/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: sys + '/role/update',
    method: 'put',
    data
  })
}

export function delRole(id) {
  return request({
    url: sys + '/role/delete',
    method: 'delete',
    params: { 'id': id }
  })
}
