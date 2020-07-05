/**
 * 组织机构
 */
import request from '@/utils/request'

export const getDeptList = () => {
  return request({
    url: '/sys/dept/list',
    method: 'get'
  })
}

export function addDept(data) {
  return request({
    url: '/sys/dept/add',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: `/sys/dept/update`,
    method: 'put',
    data
  })
}

export function delDept(id) {
  return request({
    url: `/sys/dept/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}

export function getRoleDepts(roleId) {
  return request({
    url: `/sys/dept/findByRole`,
    method: 'get',
    params: { 'roleId': roleId }
  })
}
