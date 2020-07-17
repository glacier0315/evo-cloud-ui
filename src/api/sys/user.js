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
 * @param {*} userId
 * @param {*} password
 */
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
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
 * @param {*} userId
 * @param {*} oldPassword
 * @param {*} newPassword
 */
export function updateUserPwd(userId, oldPassword, newPassword) {
  const data = {
    userId,
    oldPassword,
    newPassword
  }
  return request({
    url: '/sys/user/profile/updatePwd',
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
    url: '/sys/user/profile/avatar',
    method: 'post',
    data: data
  })
}
