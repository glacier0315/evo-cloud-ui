const Mock = require('mockjs')

const Random = Mock.Random
const roles = [
  {
    id: 'admin',
    name: 'admin',
    code: 'visitor',
    status: '1',
    description: 'Super Administrator. Have access to view all pages.',
    menus: []
  },
  {
    id: 'editor',
    name: 'editor',
    code: 'editor',
    status: '1',
    description: 'Normal Editor. Can see all pages except permission page',
    menus: []
  },
  {
    id: 'visitor',
    name: 'visitor',
    code: 'visitor',
    status: '1',
    description: 'Just a visitor. Can only see the home page and the document page',
    menus: []
  }
]

for (let i = 0; i < 97; i++) {
  roles.push(Mock.mock({
    'id': Random.id(),
    'name': Random.string('lower', 5),
    'code': Random.string('lower', 6),
    'status|1': ['1', '2'],
    description: Random.paragraph(),
    menus: []
  }))
}

module.exports = [
  {
    url: '/sys/role/pageList',
    type: 'post',
    response: config => {
      const { params, current = 1, size = 20 } = config.body

      const { name, code, status } = params

      const mockList = roles.filter(item => {
        if (name && item.name !== name) return false
        if (code && item.code !== code) return false
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
    url: '/sys/role/add',
    type: 'post',
    response: config => {
      const role = config.body
      role.id = Random.id()
      roles.push(role)
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/role/update',
    type: 'put',
    response: config => {
      const role = config.body
      roles.forEach((item, index) => {
        if (role && role.id && item.id === role.id) {
          roles.splice(index, 1, role)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/role/delete',
    type: 'delete',
    response: config => {
      const id = config.query.id
      roles.forEach((item, index) => {
        if (id && item.id === id) {
          roles.splice(index, 1)
        }
      })
      return {
        code: '20000',
        data: 'success'
      }
    }
  },

  {
    url: '/sys/menu/findByRole',
    type: 'get',
    response: config => {
      const id = config.query.roleId
      let menus = []
      roles.forEach(item => {
        if (id && item.id === id) {
          menus = item.menus
        }
      })
      return {
        code: '20000',
        data: menus
      }
    }
  }
]
