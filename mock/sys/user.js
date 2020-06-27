const Mock = require('mockjs')

var Random = Mock.Random

// 使用 Mock
var users = Mock.mock({
  'list|10-25': [{
    'id|+1': 1,
    'username|+1': Random.string('lower', 5),
    'password|+1': Random.string('lower', 6),
    'nickname|+1': Random.string('lower', 5),
    'idCard|+1': /\d{17,17}[0-9]|[X]/,
    'birthday|+1': Random.date('yyyy-MM-dd'),
    'sex|1': [1, 2],
    'status|1': ['0', '1'],
    'email|+1': Mock.mock('@email'),
    'mobile|+1': /[1]\d{10,10}/,
    'delFlag': '0'
  }]
})

console.log('users', users)

module.exports = [
  {
    url: '/sys/user/list',
    type: 'get',
    response: config => {
      const { username, nickname, idCard, current = 1, size = 20, sort } = config.query

      let mockList = users.list.filter(item => {
        if (username && item.username !== +username) return false
        if (nickname && item.nickname !== nickname) return false
        if (idCard && item.idCard.indexOf(idCard) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

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
    response: _ => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/user/update',
    type: 'put',
    response: _ => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/user/delete',
    type: 'delete',
    response: _ => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]

