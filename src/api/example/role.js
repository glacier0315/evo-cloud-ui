import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/vue-element-admin/role`,
    method: 'put',
    data
  })
}

export function deleteRole(key) {
  return request({
    url: `/vue-element-admin/role`,
    method: 'delete',
    params: { 'key': key }
  })
}
