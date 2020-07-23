import request from '@/utils/request'

/**
 * 查询用户
 * @param {*} data
 */
export function getUserList(data) {
  return request({
    url: '/sys/user/pageList',
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
    url: '/sys/user/add',
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
    url: '/sys/user/update',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {*} id
 */
export function delUser(id) {
  return request({
    url: '/sys/user/delete',
    method: 'delete',
    params: { 'id': id }
  })
}

/**
 * 用户密码重置
 * @param {*} id
 * @param {*} oldPassword
 */
export function resetUserPwd(id, oldPassword) {
  const data = {
    id,
    oldPassword
  }
  return request({
    url: '/sys/user/resetPwd',
    method: 'post',
    data: data
  })
}

/**
 * 查询用户个人信息
 */
export function getUserProfile() {
  return request({
    url: '/sys/user/profile',
    method: 'get'
  })
}

/**
 *修改用户个人信息
 * @param {*} data
 */
export function updateUserProfile(data) {
  return request({
    url: '/sys/user/profile',
    method: 'put',
    data: data
  })
}

/**
 * 用户密码重置
 * @param {*} id
 * @param {*} oldPassword
 * @param {*} newPassword
 */
export function updateUserPwd(id, oldPassword, newPassword) {
  const data = {
    id,
    oldPassword,
    newPassword
  }
  return request({
    url: '/sys/user/updatePwd',
    method: 'put',
    params: data
  })
}

/**
 * 用户头像上传
 * @param {*} data
 */
export function uploadAvatar(data) {
  return request({
    url: '/sys/user/avatar',
    method: 'post',
    data: data
  })
}
