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
    url: sys + '/role/findPage',
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

/**
 * 检验编码信息
 * @param {*} data
 */
export function checkCode(data) {
  return request({
    url: sys + '/role/checkCode',
    method: 'post',
    data: data
  })
}
