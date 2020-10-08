const Mock = require('mockjs')
const { users } = require('./data/user')
const { sys } = require('../constant')

const Random = Mock.Random

module.exports = [
  {
    url: sys + '/user/findPage',
    type: 'post',
    response: config => {
      const { params, pageNum = 1, pageSize = 20 } = config.body
      const { username, nickname, idCard, sex, deptId, status } = params

      const mockList = users.filter(item => {
        if (username && item.username !== username) return false
        if (nickname && item.nickname !== nickname) return false
        if (idCard && item.idCard !== idCard) return false
        if (sex && item.sex !== sex) return false
        if (deptId && item.deptId !== deptId) return false
        if (status && item.status !== status) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))

      return {
        code: '20000',
        data: {
          pageNum: pageNum,
          pageSize: pageSize,
          total: mockList.length,
          list: pageList
        }
      }
    }
  },

  {
    url: sys + '/user/add',
    type: 'post',
    response: config => {
      const user = config.body
      user.id = Random.id()
      users.push(user)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/update',
    type: 'post',
    response: config => {
      const user = config.body
      users.forEach((item, index) => {
        if (user && user.id && item.id === user.id) {
          users.splice(index, 1, user)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/delete',
    type: 'post',
    response: config => {
      const { id } = config.body
      users.forEach((item, index) => {
        if (id && item.id === id) {
          users.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/profile',
    type: 'get',
    response: config => {
      const user = {}
      if (users && users.length > 0) {
        Object.assign(user, users[0])
      }
      return {
        code: '20000',
        data: user
      }
    }
  },

  {
    url: sys + '/user/profile',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/resetPwd',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/updatePwd',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/avatar',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: sys + '/user/checkUsername',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: false
      }
    }
  },

  {
    url: sys + '/user/checkIdCard',
    type: 'post',
    response: config => {
      return {
        code: '20000',
        data: false
      }
    }
  }
]

