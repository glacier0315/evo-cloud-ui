/**
 * 组织机构
 */
import request from '@/utils/request'
import { sys } from '@/common/constant'

export const getDeptList = () => {
  return request({
    url: sys + '/dept/list',
    method: 'get'
  })
}

export function saveDept(data) {
  return request({
    url: sys + '/dept/save',
    method: 'post',
    data
  })
}

export function delDept(id) {
  return request({
    url: sys + '/dept/delete',
    method: 'delete',
    params: { 'id': id }
  })
}

export function getRoleDepts(roleId) {
  return request({
    url: sys + '/dept/findByRole',
    method: 'get',
    params: { 'roleId': roleId }
  })
}
