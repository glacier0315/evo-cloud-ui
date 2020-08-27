import request from '@/utils/request'
import { sys } from '@/common/constant'

/**
 * 查询用户
 * @param {*} data
 */
export function getUserList(data) {
  return request({
    url: sys + '/user/pageList',
    method: 'post',
    data
  })
}

/**
 * 添加用户
 * @param {*} data
 */
export function addUser(data) {
  return request({
    url: sys + '/user/add',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param {*} data
 */
export function updateUser(data) {
  return request({
    url: sys + '/user/update',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param {*} id
 */
export function delUser(id) {
  return request({
    url: sys + '/user/delete',
    method: 'post',
    data: { 'id': id }
  })
}

/**
 * 用户密码重置
 * @param {*} id
 * @param {*} newPassword
 */
export function resetUserPwd(id, newPassword) {
  const data = {
    id,
    newPassword
  }
  return request({
    url: sys + '/user/resetPwd',
    method: 'post',
    data: data
  })
}

/**
 * 查询用户个人信息
 */
export function getUserProfile() {
  return request({
    url: sys + '/user/profile',
    method: 'get'
  })
}

/**
 *修改用户个人信息
 * @param {*} data
 */
export function updateUserProfile(data) {
  return request({
    url: sys + '/user/profile',
    method: 'post',
    data: data
  })
}

/**
 * 用户密码重置
 * @param {*} id
 * @param {*} oldPassword
 * @param {*} newPassword
 */
export function updateUserPwd(data) {
  return request({
    url: sys + '/user/updatePwd',
    method: 'post',
    data
  })
}

/**
 * 用户头像上传
 * @param {*} data
 */
export function uploadAvatar(data) {
  return request({
    url: sys + '/user/avatar',
    method: 'post',
    data: data
  })
}
