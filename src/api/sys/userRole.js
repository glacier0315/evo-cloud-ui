import request from '@/utils/request'
import { sys } from '@/common/constant'

/**
 * 将当前角色授予用户
 * @param {*} data
 */
export function addUserRole(data) {
  return request({
    url: sys + '/userRole/addUser',
    method: 'post',
    data
  })
}

/**
 * 移除用户
 * @param {*} data
 */
export function deleteUserRole(data) {
  return request({
    url: sys + '/userRole/deleteUser',
    method: 'post',
    data
  })
}

/**
 * 给用户授予角色
 * @param {*} data
 */
export function addRoleUser(data) {
  return request({
    url: sys + '/userRole/addRole',
    method: 'post',
    data
  })
}

/**
 * 移除角色
 * @param {*} data
 */
export function deleteRoleUser(data) {
  return request({
    url: sys + '/userRole/deleteRole',
    method: 'post',
    data
  })
}
