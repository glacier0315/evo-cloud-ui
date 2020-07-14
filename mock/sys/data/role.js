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

module.exports = {
  roles
}
