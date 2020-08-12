/**
 * 菜单资源
 */
import request from '@/utils/request'
import { sys } from '@/common/constant'

// 获取路由
export const getRouters = () => {
  return request({
    url: sys + '/menu/getRouters',
    method: 'get'
  })
}
// 获取权限
export const getPermissions = () => {
  return request({
    url: sys + '/menu/getPermissions',
    method: 'get'
  })
}

export const getMenuList = () => {
  return request({
    url: sys + '/menu/list',
    method: 'get'
  })
}

export function saveMenu(data) {
  return request({
    url: sys + '/menu/save',
    method: 'post',
    data
  })
}

export function delMenu(id) {
  return request({
    url: sys + '/menu/delete',
    method: 'delete',
    params: { 'id': id }
  })
}

export function getRoleMenus(roleId) {
  return request({
    url: sys + '/menu/findByRole',
    method: 'get',
    params: { 'roleId': roleId }
  })
}
