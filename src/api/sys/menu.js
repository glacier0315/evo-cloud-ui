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

export const getPermissions = () => {
  return request({
    url: '/sys/menu/getPermissions',
    method: 'get'
  })
}
