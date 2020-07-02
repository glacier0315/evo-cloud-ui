/**
 * 菜单资源
 */
import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/sys/menu/getRouters',
    method: 'get'
  })
}
// 获取权限
export const getPermissions = () => {
  return request({
    url: '/sys/menu/getPermissions',
    method: 'get'
  })
}

export const getList = () => {
  return request({
    url: '/sys/menu/list',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/menu/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/sys/menu/update`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/menu/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}
