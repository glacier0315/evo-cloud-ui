const Mock = require('mockjs')
const { users } = require('./data/user')

const Random = Mock.Random

module.exports = [
  {
    url: '/sys/user/pageList',
    type: 'post',
    response: config => {
      const { params, current = 1, size = 20 } = config.body
      const { username, nickname, idCard, sex, status } = params

      const mockList = users.filter(item => {
        if (username && item.username !== username) return false
        if (nickname && item.nickname !== nickname) return false
        if (idCard && item.idCard !== idCard) return false
        if (sex && item.sex !== sex) return false
        if (status && item.status !== status) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < size * current && index >= size * (current - 1))

      return {
        code: '20000',
        data: {
          total: mockList.length,
          records: pageList
        }
      }
    }
  },

  {
    url: '/sys/user/add',
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
    url: '/sys/user/update',
    type: 'put',
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
    url: '/sys/user/delete',
    type: 'delete',
    response: config => {
      const id = config.query.id
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
  }
]

