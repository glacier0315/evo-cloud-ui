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

export const getMenuList = () => {
  return request({
    url: '/sys/menu/list',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/sys/menu/add',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: `/sys/menu/update`,
    method: 'put',
    data
  })
}

export function delMenu(id) {
  return request({
    url: `/sys/menu/delete`,
    method: 'delete',
    params: { 'id': id }
  })
}
