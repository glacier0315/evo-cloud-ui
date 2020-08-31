const Mock = require('mockjs')
const { sys } = require('../constant')

module.exports = [
  {
    url: sys + '/userRole/addUser',
    type: 'post',
    response: config => {
      const { roleId, userIds } = config.body
      console.log('将角色 {} 授予用户 {}', roleId, userIds)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/userRole/deleteUser',
    type: 'post',
    response: config => {
      const { roleId, userIds } = config.body
      console.log('用户 {} 取消角色 {}', userIds, roleId)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/userRole/addRole',
    type: 'post',
    response: config => {
      const { roleIds, userId } = config.body
      console.log('将角色 {} 授予用户 {}', roleIds, userId)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/userRole/deleteRole',
    type: 'post',
    response: config => {
      const { roleIds, userId } = config.body
      console.log('用户 {} 取消角色 {}', userId, roleIds)
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
