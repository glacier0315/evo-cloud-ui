const Mock = require('mockjs')

var Random = Mock.Random

// 使用 Mock
// var users = Mock.mock({
//   'list|10-25': [{
//     'id|+1': 1,
//     'username|+1': Random.string('lower', 5),
//     'password|+1': Random.string('lower', 6),
//     'nickname|+1': Random.string('lower', 5),
//     'idCard|+1': /\d{17,17}[0-9]|[X]/,
//     'birthday|+1': Random.date('yyyy-MM-dd'),
//     'sex|1': [1, 2],
//     'status|1': ['0', '1'],
//     'email|+1': Mock.mock('@email'),
//     'mobile|+1': /[1]\d{10,10}/,
//     'delFlag': '0'
//   }]
// })

const users = []
for (let i = 0; i < 100; i++) {
  users.push(Mock.mock({
    'id': Random.id(),
    'username': Random.string('lower', 5),
    'password': Random.string('lower', 6),
    'nickname': Random.string('lower', 5),
    'idCard': /\d{17,17}([0-9]|[X])/,
    'birthday': Random.date('yyyy-MM-dd'),
    'sex|1': [1, 2],
    'status|1': ['0', '1'],
    'email|+1': Mock.mock('@email'),
    'mobile|+1': /[1]\d{10,10}/,
    'delFlag': '0'
  }))
}

module.exports = [
  {
    url: '/sys/user/list',
    type: 'get',
    response: config => {
      const { params, current = 1, size = 20 } = config.query

      const { username, nickname, idCard } = JSON.parse(params)

      const mockList = users.filter(item => {
        if (username && item.username !== username) return false
        if (nickname && item.nickname !== nickname) return false
        if (idCard && item.idCard !== idCard) return false
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

