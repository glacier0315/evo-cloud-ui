import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/sys/role/update`,
    method: 'put',
    data
  })
}

export function delRole(id) {
  return request({
    url: `/sys/role/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}
