const Mock = require('mockjs')

const Random = Mock.Random

const users = []
// 添加admin
users.push(Mock.mock({
  'id': 'admin-token',
  'username': 'admin',
  'password': 'admin',
  'nickname': 'Super Admin',
  'idCard': /\d{17,17}([0-9]|[X])/,
  'birthday': Random.date('yyyy-MM-dd'),
  'sex|1': [1, 2],
  'status|1': ['1', '2'],
  'email|+1': Mock.mock('@email'),
  'mobile|+1': /[1]\d{10,10}/,
  'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  'introduction': 'I am a super administrator',
  'delFlag': '0',
  roles: ['admin']
}))
// 添加editor
users.push(Mock.mock({
  'id': 'editor-token',
  'username': 'editor',
  'password': 'editor',
  'nickname': 'Normal Editor',
  'idCard': /\d{17,17}([0-9]|[X])/,
  'birthday': Random.date('yyyy-MM-dd'),
  'sex|1': [1, 2],
  'status|1': ['1', '2'],
  'email|+1': Mock.mock('@email'),
  'mobile|+1': /[1]\d{10,10}/,
  'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  'introduction': 'I am an editor',
  'delFlag': '0',
  roles: ['editor']
}))

// 添加测试数据
for (let i = 0; i < 98; i++) {
  users.push(Mock.mock({
    'id': Random.id(),
    'username': Random.string('lower', 5),
    'password': Random.string('lower', 6),
    'nickname': Random.string('lower', 5),
    'idCard': /\d{17,17}([0-9]|[X])/,
    'birthday': Random.date('yyyy-MM-dd'),
    'sex|1': [1, 2],
    'status|1': ['1', '2'],
    'email|+1': Mock.mock('@email'),
    'mobile|+1': /[1]\d{10,10}/,
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    'introduction': Random.paragraph(),
    'delFlag': '0'
  }))
}

module.exports = {
  users
}

